# Design e arquitetura

## Visão geral

TheLeadsFy é uma aplicação Next.js/TypeScript. A interface e as rotas ficam em `src/app`; integrações e regras de serviço ficam em `src/services`; Prisma e a configuração Supabase atendem persistência/autenticação. O servidor MCP local fica isolado em `mcp/` e reutiliza o cliente/handler Serper do projeto.

## Fluxo de busca

1. A interface envia nicho e região à API de geração de leads.
2. A API/use case chama Serper Places pelo handler do servidor.
3. Os resultados são normalizados como candidatos e apresentados para revisão manual.
4. A filtragem do MCP atua apenas sobre candidatos recebidos no argumento; não busca nem persiste dados.

## Servidor MCP

- Transporte: stdio, iniciado com `npm run mcp`.
- Registro das ferramentas: `mcp/server.ts`.
- Ferramentas comuns: implementação em `mcp/tools.ts`; Maps e Reviews em `mcp/phase3.ts`; contagem combinada em `mcp/credits.ts`.
- Configuração do cliente local: `.mcp.json`; segredos permanecem em `.env.local`/ambiente do servidor.
- `leadsfy_plan_batch`, `leadsfy_filter_candidates` e `leadsfy_get_credits` não fazem chamadas de rede. Busca Places, execução de lote, Maps e Reviews podem gerar custo.

## Decisões e limites

- A cidade é enviada junto à consulta `q`; não confiar no parâmetro Serper `location` com texto livre.
- Resultados externos não são leads qualificados; não há automação de contato.
- Toda execução paga exige orçamento explícito. Lotes exigem igualdade entre o custo estimado e `confirmCredits`.
- Maps e Reviews são capacidades opcionais. Reviews recebe identificador (`fid`, `cid` ou `placeId`) do chamador; descoberta automática de `fid` não está implementada.
- Scrape está excluído por decisão de produto.
- As avaliações da Fase 4 usam dados sintéticos e a ferramenta local de filtragem, para não gastar créditos.

## Referências de implementação

- `src/app/api/` — rotas da aplicação.
- `src/app/api/useCases/` — casos de uso.
- `src/app/api/externalHandlers/SerperExternalHandler.ts` — integração Serper.
- `mcp/server.ts`, `mcp/tools.ts`, `mcp/phase3.ts`, `mcp/credits.ts` — servidor MCP.
- `mcp/evaluation.xml` — conjunto de avaliações da Fase 4.
