import axios from "axios";

const MAPS_URL = "https://google.serper.dev/maps";
const REVIEWS_URL = "https://google.serper.dev/reviews";
type Post = (url: string, body: Record<string, unknown>, apiKey: string) => Promise<{ data: Record<string, unknown> }>;

export function createOptionalTools(post: Post = async (url, body, apiKey) => {
  const response = await axios.post(url, body, { headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" } });
  return { data: response.data };
}) {
  let creditsUsed = 0;
  const request = async (url: string, body: Record<string, unknown>) => {
    const apiKey = process.env.SERPER_API_KEY?.trim();
    if (!apiKey) throw new Error("SERPER_API_KEY is not configured on the server.");
    try {
      return (await post(url, body, apiKey)).data;
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (status === 401 || status === 403) throw new Error(`Serper rejected authentication (HTTP ${status}).`);
      if (status === 402) throw new Error("Serper reports insufficient credits (HTTP 402).");
      if (status === 429) throw new Error("Serper rate limit reached (HTTP 429).");
      throw new Error(status ? `Serper request failed with HTTP ${status}.` : "Serper request failed.");
    }
  };
  const creditCount = (data: Record<string, unknown>, maxCredits: number, fallback: number) => {
    const value = data.credits;
    const exact = typeof value === "number" && Number.isFinite(value) && value > 0;
    const used = exact ? value : fallback;
    creditsUsed += used;
    return { used, exact, budgetExceeded: used > maxCredits };
  };
  const formatCandidates = (results: unknown[]) => results.map((item) => {
    const place = item && typeof item === "object" ? item as Record<string, unknown> : {};
    return { ...place, classification: "candidate", hasWebsite: Boolean(place.website) };
  });

  return {
    async mapsSearch(input: { q?: string; ll?: string; placeId?: string; cid?: string; hl?: string; page?: number; maxCredits: number }) {
      if (![input.q, input.ll, input.placeId, input.cid].some((value) => value?.trim())) throw new Error("Provide q, ll, placeId, or cid for Maps.");
      if (!Number.isInteger(input.maxCredits) || input.maxCredits < 3) throw new Error("maxCredits must be at least 3 for a Maps request.");
      if (input.page !== undefined && (!Number.isInteger(input.page) || input.page < 1)) throw new Error("page must be a positive integer.");
      const { maxCredits, ...query } = input;
      const data = await request(MAPS_URL, { ...query, hl: input.hl ?? "pt-br", page: input.page ?? 1 });
      const charge = creditCount(data, maxCredits, 3);
      return { candidates: formatCandidates(Array.isArray(data.places) ? data.places : []), creditsUsed: charge.used, creditsExact: charge.exact, budgetExceeded: charge.budgetExceeded,
        note: "Resultados do Maps são candidatos e precisam de validação manual; nenhum contato foi realizado." };
    },
    async placeReviews(input: { fid?: string; cid?: string; placeId?: string; sortBy?: string; topicId?: string; nextPageToken?: string; gl?: string; hl?: string; maxCredits: number }) {
      if (![input.fid, input.cid, input.placeId].some((value) => value?.trim())) throw new Error("Provide at least one of fid, cid, or placeId for Reviews.");
      if (!Number.isInteger(input.maxCredits) || input.maxCredits < 1) throw new Error("maxCredits must be at least 1 for a Reviews request.");
      const { maxCredits, ...query } = input;
      const data = await request(REVIEWS_URL, { ...query, gl: input.gl ?? "br", hl: input.hl ?? "pt-br" });
      const charge = creditCount(data, maxCredits, 1);
      return { reviews: Array.isArray(data.reviews) ? data.reviews : [], nextPageToken: data.nextPageToken ?? null,
        creditsUsed: charge.used, creditsExact: charge.exact, budgetExceeded: charge.budgetExceeded,
        note: "Reviews são conteúdo externo não verificado; não representam qualificação do candidato." };
    },
    getCredits() { return { creditsUsed }; },
  };
}
