import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { loadEnvConfig } from "@next/env";
import { z } from "zod";
import { createLeadTools } from "./tools";
import { createOptionalTools } from "./phase3";
import { sumCredits } from "./credits";

loadEnvConfig(process.cwd());

const server = new McpServer({ name: "leadsfy", version: "1.0.0" });
const tools = createLeadTools();
const optionalTools = createOptionalTools();
const commonSearch = {
  query: z.string().min(1).describe("Busca/localidade; itens retornados são candidatos."),
  location: z.string().optional(),
  gl: z.string().default("br"),
  hl: z.string().default("pt-br"),
  maxCredits: z.number().int().min(1).describe("Limite explícito de créditos autorizado para esta chamada."),
};
const asToolResult = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data) }],
  structuredContent: data as Record<string, unknown>,
});

server.registerTool("leadsfy_search_places", {
  description: "Busca uma página do Serper Places. Consome créditos; resultados são candidatos para validação manual.",
  inputSchema: { ...commonSearch, page: z.number().int().min(1).default(1) },
  annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: false },
}, async (input) => asToolResult(await tools.searchPlaces(input)));

server.registerTool("leadsfy_search_places_pages", {
  description: "Busca de 1 a 10 páginas Places de uma consulta, deduplica por cid/placeId. Consome créditos; retorna candidatos.",
  inputSchema: { ...commonSearch, pages: z.number().int().min(1).max(10).describe("Páginas solicitadas, obrigatório; cada página custa 1 crédito.") },
  annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: false },
}, async (input) => asToolResult(await tools.searchPlacesPages(input)));

server.registerTool("leadsfy_plan_batch", {
  description: "Estima consultas e créditos para nichos × regiões × páginas. Não faz rede nem consome créditos.",
  inputSchema: {
    niches: z.array(z.string().min(1)).min(1),
    locations: z.array(z.string().min(1)).min(1),
    pages: z.number().int().min(1).max(10),
  },
  annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
}, async (input) => asToolResult(tools.planBatch(input)));

server.registerTool("leadsfy_run_batch", {
  description: "Executa combinações nicho × local × páginas em mini-batches Serper. Exige confirmação exata dos créditos estimados; pode consumir créditos.",
  inputSchema: {
    niches: z.array(z.string().min(1)).min(1),
    locations: z.array(z.string().min(1)).min(1),
    pages: z.number().int().min(1).max(10),
    confirmCredits: z.number().int().min(1).describe("Deve ser igual aos créditos estimados pelo plano."),
    targetCandidates: z.number().int().min(1).optional(),
  },
  annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: false },
}, async (input) => asToolResult(await tools.runBatch(input)));

server.registerTool("leadsfy_filter_candidates", {
  description: "Filtra candidatos fornecidos localmente; não faz consultas de rede nem consome créditos.",
  inputSchema: {
    candidates: z.array(z.record(z.string(), z.json())),
    semWebsite: z.boolean().optional(),
    hasPhone: z.boolean().optional(),
    minRating: z.number().min(0).max(5).optional(),
  },
  annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
}, async ({ candidates, ...filters }) => asToolResult(tools.filterCandidates(candidates, filters)));

server.registerTool("leadsfy_maps_search", {
  description: "Busca no Serper Maps; custa 3 créditos. Resultados são candidatos e exigem validação manual.",
  inputSchema: {
    q: z.string().optional(), ll: z.string().optional(), placeId: z.string().optional(), cid: z.string().optional(),
    hl: z.string().default("pt-br"), page: z.number().int().min(1).default(1),
    maxCredits: z.number().int().min(3).describe("Teto autorizado (mínimo 3; custo conhecido do Maps). A resposta sinaliza budgetExceeded se o fornecedor cobrar mais."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: false },
}, async (input) => asToolResult(await optionalTools.mapsSearch(input)));

server.registerTool("leadsfy_place_reviews", {
  description: "Obtém avaliações de um local por fid, cid ou placeId. Custa 1 crédito; reviews são dados externos não verificados.",
  inputSchema: {
    fid: z.string().optional(), cid: z.string().optional(), placeId: z.string().optional(),
    sortBy: z.enum(["mostRelevant", "newest", "highestRating", "lowestRating"]).optional(),
    topicId: z.string().optional(), nextPageToken: z.string().optional(), gl: z.string().default("br"), hl: z.string().default("pt-br"),
    maxCredits: z.number().int().min(1).describe("Teto autorizado (mínimo 1; custo conhecido de Reviews). A resposta sinaliza budgetExceeded se o fornecedor cobrar mais."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true, idempotentHint: false },
}, async (input) => asToolResult(await optionalTools.placeReviews(input)));

server.registerTool("leadsfy_get_credits", {
  description: "Retorna créditos gastos nesta sessão deste processo MCP, incluindo buscas, Maps e Reviews; não consulta saldo Serper.",
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false, idempotentHint: true },
}, async () => asToolResult({ creditsUsed: sumCredits(tools.getCredits(), optionalTools.getCredits()) }));

server.connect(new StdioServerTransport()).catch((error: unknown) => {
  console.error("Failed to start LeadsFy MCP server", error instanceof Error ? error.message : "Unknown error");
  process.exitCode = 1;
});
