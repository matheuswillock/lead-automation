import InputSearchLead from "../src/domain/Dto/InputSearchLead";
import { SerperApi } from "../src/app/api/externalHandlers/SerperExternalHandler";

type SearchHandler = typeof SerperApi.places;
type BatchSearchHandler = typeof SerperApi.placesBatch;
type Place = Record<string, unknown> & { cid?: string; placeId?: string; website?: string; phoneNumber?: string };

const note = "Resultados são candidatos e precisam de verificação manual; nenhum contato ou exportação foi realizado.";

export function createLeadTools(search: SearchHandler = SerperApi.places, batchSearch?: BatchSearchHandler) {
  let creditsUsed = 0;

  const fetchPage = async (query: string, location: string | undefined, gl: string, hl: string, page: number) => {
    const output = await search(InputSearchLead.fromSearchLead({ query, location, country: gl, language: hl, page }));
    if (!output.isValid) throw new Error(toActionableError(output.errorMessages.join("; ")));
    creditsUsed += output.result?.credits ?? 1;
    return (output.result?.places ?? []) as Place[];
  };

  const format = (places: Place[], used: number, totalBeforeDedup = places.length, budget?: number) => ({
    candidates: places.map((place) => ({
      ...place,
      hasWebsite: Boolean(place.website),
      websiteHost: getWebsiteHost(place.website),
      classification: "candidate" as const,
    })),
    totalBeforeDedup,
    creditsUsed: used,
    ...(budget === undefined ? {} : { budgetExceeded: used > budget, budgetExhausted: used >= budget }),
    note,
  });

  const deduplicate = (places: Place[]) => {
    const seen = new Set<string>();
    return places.filter((place) => {
      const key = place.cid ? `cid:${place.cid}` : place.placeId ? `placeId:${place.placeId}` : undefined;
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  return {
    async searchPlaces(input: { query: string; location?: string; gl?: string; hl?: string; page?: number; maxCredits: number }) {
      validateSearch(input.query, input.maxCredits, 1);
      const startCredits = creditsUsed;
      const places = await fetchPage(input.query, input.location, input.gl ?? "br", input.hl ?? "pt-br", input.page ?? 1);
       return format(places, creditsUsed - startCredits, places.length, input.maxCredits);
    },
    async searchPlacesPages(input: { query: string; location?: string; gl?: string; hl?: string; pages: number; maxCredits: number }) {
      validateSearch(input.query, input.maxCredits, input.pages);
      if (!Number.isInteger(input.pages) || input.pages < 1 || input.pages > 10) throw new Error("pages must be an integer from 1 to 10");
      const startCredits = creditsUsed;
      const places: Place[] = [];
       for (let page = 1; page <= input.pages && creditsUsed - startCredits < input.maxCredits; page++) {
         places.push(...await fetchPage(input.query, input.location, input.gl ?? "br", input.hl ?? "pt-br", page));
       }
        const candidates = deduplicate(places);
        return format(candidates, creditsUsed - startCredits, places.length, input.maxCredits);
     },
    async runBatch(input: { niches: string[]; locations: string[]; pages: number; confirmCredits: number; targetCandidates?: number }) {
      const plan = this.planBatch(input);
      if (!Number.isInteger(input.confirmCredits) || input.confirmCredits !== plan.estimatedCredits) {
        throw new Error(`confirmCredits must equal estimated credits: ${plan.estimatedCredits}`);
      }
      const target = input.targetCandidates ?? plan.maxRawCandidates;
      if (!Number.isInteger(target) || target < 1 || target > plan.maxRawCandidates) {
        throw new Error(`targetCandidates must be an integer from 1 to ${plan.maxRawCandidates}`);
      }
      const startCredits = creditsUsed;
      const raw: Place[] = [];
      const runBatchSearch = batchSearch ?? (search === SerperApi.places ? SerperApi.placesBatch : undefined);
       let budgetStopped = false;
       for (const niche of input.niches) {
         for (const location of input.locations) {
           if (budgetStopped) break;
           if (deduplicate(raw).length >= target) break;
           for (let page = 1; page <= input.pages && deduplicate(raw).length < target && creditsUsed - startCredits < input.confirmCredits; page++) {
            const query = InputSearchLead.fromSearchLead({ query: niche, location, country: "br", language: "pt-br", page });
            if (runBatchSearch) {
              const outputs = await runBatchSearch([query]);
              const failed = outputs.find((output) => !output.isValid);
              if (failed) throw new Error(toActionableError(failed.errorMessages.join("; ")));
              if (outputs.length !== 1) throw new Error("Invalid Serper Places batch response");
               for (const output of outputs) {
                 creditsUsed += output.result?.credits ?? 1;
                 raw.push(...(output.result?.places ?? []) as Place[]);
               }
            } else {
              const output = await search(query);
              if (!output.isValid) throw new Error(toActionableError(output.errorMessages.join("; ")));
               creditsUsed += output.result?.credits ?? 1;
               raw.push(...(output.result?.places ?? []) as Place[]);
             }
             if (creditsUsed - startCredits >= input.confirmCredits) budgetStopped = true;
           }
         }
        if (deduplicate(raw).length >= target) break;
      }
       return { ...format(deduplicate(raw).slice(0, target), creditsUsed - startCredits, raw.length, input.confirmCredits), estimatedCredits: plan.estimatedCredits,
        targetCandidates: target, note: `${note} Créditos efetivamente usados: ${creditsUsed - startCredits}.` };
    },
    filterCandidates(candidates: Place[], filters: { semWebsite?: boolean; hasPhone?: boolean; minRating?: number }) {
      if (filters.minRating !== undefined && (!Number.isFinite(filters.minRating) || filters.minRating < 0 || filters.minRating > 5)) {
        throw new Error("minRating must be between 0 and 5");
      }
      const filtered = candidates.filter((candidate) =>
        (!filters.semWebsite || !candidate.website) &&
        (!filters.hasPhone || Boolean(candidate.phoneNumber)) &&
        (filters.minRating === undefined || (typeof candidate.rating === "number" && candidate.rating >= filters.minRating)));
      return { ...format(filtered, 0, candidates.length), totalFiltered: filtered.length,
        note: "Filtragem local; nenhuma chamada de rede nem crédito foi usado." };
    },
    planBatch(input: { niches: string[]; locations: string[]; pages: number }) {
      if (!input.niches.length || !input.locations.length || !Number.isInteger(input.pages) || input.pages < 1 || input.pages > 10) {
        throw new Error("niches and locations must be non-empty, and pages must be from 1 to 10");
      }
      const queries = input.niches.length * input.locations.length * input.pages;
      return { queries, estimatedCredits: queries, maxRawCandidates: queries * 10, note: "Plano apenas estimativo; nenhuma consulta/rede/crédito foi usada." };
    },
    getCredits() { return { creditsUsed }; },
  };
}

function validateSearch(query: string, maxCredits: number, required: number) {
  if (!query?.trim()) throw new Error("query is required");
  if (!Number.isInteger(maxCredits) || maxCredits < required) throw new Error(`maxCredits must be an integer of at least ${required}`);
}

function getWebsiteHost(website?: string) {
  if (!website) return null;
  try { return new URL(website.startsWith("http") ? website : `https://${website}`).hostname; }
  catch { return null; }
}

function toActionableError(message: string) {
  if (/HTTP 401\b/.test(message)) return "Serper rejected authentication (HTTP 401); check the server-side SERPER_API_KEY.";
  if (/HTTP 402\b/.test(message)) return "Serper reports insufficient credits (HTTP 402); check the account balance.";
  if (/HTTP 429\b/.test(message)) return "Serper rate limit reached (HTTP 429); wait before retrying.";
  return message || "Serper Places search failed.";
}
