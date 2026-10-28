import assert from "node:assert/strict";
import test from "node:test";
import { createLeadTools } from "./tools";

const place = (id: string) => ({
  position: 1, title: `Business ${id}`, address: "Address", latitude: 1, longitude: 2,
  rating: 4, ratingCount: 10, category: "Shop", cid: id,
});

test("single Places search requires explicit credit budget and labels results as candidates", async () => {
  let calls = 0;
  let sentQuery = "";
  const tools = createLeadTools(async (input) => {
    calls++;
    sentQuery = input.q;
    return { isValid: true, errorMessages: [], result: { places: [place("a")], credits: 1 } } as never;
  });

  await assert.rejects(tools.searchPlaces({ query: "plumber", maxCredits: 0 }));
  const result = await tools.searchPlaces({ query: "plumber", location: "Jundiai", maxCredits: 1 });
  assert.equal(calls, 1);
  assert.equal(sentQuery, "plumber Jundiai");
  assert.equal(result.creditsUsed, 1);
  assert.deepEqual(tools.getCredits(), { creditsUsed: 1 });
  assert.match(result.note, /candidatos/i);
});

test("single Places search reports when the provider charge exceeds its credit budget", async () => {
  const tools = createLeadTools(async () => ({
    isValid: true, errorMessages: [], result: { places: [place("a")], credits: 2 },
  } as never));
  const result = await tools.searchPlaces({ query: "plumber", maxCredits: 1 });
  assert.equal(result.creditsUsed, 2);
  assert.equal(result.budgetExceeded, true);
});

test("pages search rejects over ten pages or an insufficient budget before calling Serper", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => { calls++; return {} as never; });
  await assert.rejects(tools.searchPlacesPages({ query: "dentist", pages: 11, maxCredits: 11 }));
  await assert.rejects(tools.searchPlacesPages({ query: "dentist", pages: 2, maxCredits: 1 }));
  assert.equal(calls, 0);
});

test("Serper authentication, credit, and rate errors have actionable messages", async () => {
  for (const [status, message] of [[401, /check the server-side SERPER_API_KEY/], [402, /insufficient credits/], [429, /rate limit reached/i]] as const) {
    const tools = createLeadTools(async () => ({ isValid: false, errorMessages: [`Serper Places request failed with HTTP ${status}`] } as never));
    await assert.rejects(tools.searchPlaces({ query: "dentist", maxCredits: 1 }), message);
  }
});

test("pages search deduplicates repeated cid and counts reported credits", async () => {
  let call = 0;
  const tools = createLeadTools(async () => {
    call++;
    return { isValid: true, errorMessages: [], result: { places: [place("same"), place(`p${call}`)], credits: 1 } } as never;
  });
  const result = await tools.searchPlacesPages({ query: "dentist", pages: 2, maxCredits: 2 });
  assert.equal(result.candidates.length, 3);
  assert.equal(result.creditsUsed, 2);
  assert.equal(result.totalBeforeDedup, 4);
});

test("pages search stops after a provider charge exhausts its budget", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => {
    calls++;
    return { isValid: true, errorMessages: [], result: { places: [], credits: 3 } } as never;
  });
  const result = await tools.searchPlacesPages({ query: "dentist", pages: 2, maxCredits: 2 });
  assert.equal(calls, 1);
  assert.equal(result.creditsUsed, 3);
  assert.equal(result.budgetExceeded, true);
  assert.equal(result.budgetExhausted, true);
});

test("batch plan estimates cost without calling Serper and credits are session-local", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => { calls++; return {} as never; });
  const plan = tools.planBatch({ niches: ["dentist", "plumber"], locations: ["Jundiai"], pages: 2 });
  assert.equal(plan.queries, 4);
  assert.equal(plan.estimatedCredits, 4);
  assert.equal(plan.maxRawCandidates, 40);
  assert.equal(calls, 0);
  assert.deepEqual(tools.getCredits(), { creditsUsed: 0 });
});

test("batch requires exact credit confirmation before any search and runs combinations sequentially", async () => {
  let calls = 0;
  const tools = createLeadTools(async (input) => {
    calls++;
    return { isValid: true, errorMessages: [], result: { places: [place(`${input.q}-${calls}`)], credits: 1 } } as never;
  });
  const args = { niches: ["dentist", "plumber"], locations: ["Jundiai"], pages: 2, confirmCredits: 3 };
  await assert.rejects(tools.runBatch(args), /confirmCredits must equal estimated credits: 4/);
  assert.equal(calls, 0);
  const result = await tools.runBatch({ ...args, confirmCredits: 4, targetCandidates: 2 });
  assert.equal(calls, 2);
  assert.equal(result.creditsUsed, 2);
  assert.equal(result.candidates.length, 2);
  assert.equal(result.note.includes("sequencial"), false);
});

test("batch handler receives only the needed page and reports returned credits", async () => {
  const batchRequests: string[][] = [];
  let fallbackCalls = 0;
  const tools = createLeadTools(async () => { fallbackCalls++; return {} as never; }, async (queries) => {
    batchRequests.push(queries.map((query) => query.q));
    return queries.map((_, index) => ({ isValid: true, errorMessages: [], result: { places: [place(index === 0 ? "same" : `unique-${index}`)], credits: index + 2 } } as never));
  });
  const args = { niches: ["dentist", "plumber"], locations: ["Jundiai", "Campinas"], pages: 2, confirmCredits: 8, targetCandidates: 1 };
  await assert.rejects(tools.runBatch({ ...args, confirmCredits: 7 }), /confirmCredits must equal estimated credits: 8/);
  assert.deepEqual(batchRequests, []);
  const result = await tools.runBatch(args);
  assert.deepEqual(batchRequests, [["dentist Jundiai"]]);
  assert.equal(fallbackCalls, 0);
  assert.equal(result.creditsUsed, 2);
  assert.equal(result.candidates.length, 1);
  assert.match(result.note, /Créditos efetivamente usados: 2/);
});

test("batch asks only for as many pages as needed to reach target, after explicit full-plan confirmation", async () => {
  const requested: string[][] = [];
  const tools = createLeadTools(async () => ({} as never), async (queries) => {
    requested.push(queries.map((query) => query.q));
    return queries.map((_, index) => ({ isValid: true, errorMessages: [], result: { places: [place(`p${requested.length}-${index}`)], credits: 1 } } as never));
  });
  const input = { niches: ["dentist"], locations: ["A", "B"], pages: 3, confirmCredits: 6, targetCandidates: 1 };
  const result = await tools.runBatch(input);
  assert.deepEqual(requested, [["dentist A"]]);
  assert.equal(result.creditsUsed, 1);
});

test("batch stops before another page when provider charges exceed confirmed credits", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => {
    calls++;
    return { isValid: true, errorMessages: [], result: { places: [], credits: 3 } } as never;
  });
  const result = await tools.runBatch({ niches: ["dentist"], locations: ["A"], pages: 2, confirmCredits: 2 });
  assert.equal(calls, 1);
  assert.equal(result.creditsUsed, 3);
  assert.equal(result.budgetExceeded, true);
  assert.equal(result.budgetExhausted, true);
});

test("batch does not start another page after the confirmed budget is fully spent", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => {
    calls++;
    return { isValid: true, errorMessages: [], result: { places: [], credits: 2 } } as never;
  });
  const result = await tools.runBatch({ niches: ["dentist"], locations: ["A"], pages: 2, confirmCredits: 2 });
  assert.equal(calls, 1);
  assert.equal(result.creditsUsed, 2);
  assert.equal(result.budgetExceeded, false);
  assert.equal(result.budgetExhausted, true);
});

test("batch preserves actionable HTTP errors from a failed batch handler", async () => {
  const tools = createLeadTools(async () => ({} as never), async () => [
    { isValid: false, errorMessages: ["Serper Places request failed with HTTP 429"] } as never,
  ]);
  await assert.rejects(tools.runBatch({ niches: ["dentist"], locations: ["A"], pages: 2, confirmCredits: 2 }), /rate limit reached/i);
});

test("batch deduplicates candidate ids and bounds the target", async () => {
  let calls = 0;
  const tools = createLeadTools(async () => {
    calls++;
    return { isValid: true, errorMessages: [], result: { places: [place("duplicate"), place(`unique-${calls}`)], credits: 1 } } as never;
  });
  const result = await tools.runBatch({ niches: ["dentist"], locations: ["A", "B", "C"], pages: 2, confirmCredits: 6, targetCandidates: 3 });
  assert.equal(result.candidates.length, 3);
  assert.equal(result.totalBeforeDedup, 4);
  assert.equal(calls, 2);
});

test("candidate filtering is local and supports website, phone, and minimum rating", () => {
  const tools = createLeadTools(async () => { throw new Error("network must not be called"); });
  const candidates = [
    { ...place("a"), phoneNumber: "123", website: "https://a.test" },
    { ...place("b"), phoneNumber: "456", rating: 3, website: undefined },
    { ...place("c"), phoneNumber: "789", rating: 4, website: undefined },
  ];
  const result = tools.filterCandidates(candidates, { semWebsite: true, hasPhone: true, minRating: 4 });
  assert.deepEqual(result.candidates.map((candidate) => candidate.cid), ["c"]);
  assert.deepEqual(tools.getCredits(), { creditsUsed: 0 });
});

test("phone filter recognizes the Serper phoneNumber field", () => {
  const tools = createLeadTools(async () => { throw new Error("network must not be called"); });
  const result = tools.filterCandidates([{ ...place("serper"), phoneNumber: "+55 11 1234-5678" }], { hasPhone: true });
  assert.equal(result.candidates.length, 1);
});
