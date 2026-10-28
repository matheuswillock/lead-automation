import assert from "node:assert/strict";
import test from "node:test";
import { createOptionalTools } from "./phase3";
import { sumCredits } from "./credits";

test("phase three exposes optional Serper tools", async () => {
  assert.equal(typeof createOptionalTools, "function");
});

test("phase three does not expose a scraper tool", () => {
  const tools = createOptionalTools(async () => ({ data: {} }));
  assert.equal("scrapeSite" in tools, false);
});

test("Maps requires a 3-credit budget and returns candidate results", async () => {
  const previousKey = process.env.SERPER_API_KEY;
  process.env.SERPER_API_KEY = "test-only";
  const requests: Array<{ url: string; body: Record<string, unknown>; key: string }> = [];
  const tools = createOptionalTools(async (url, body, key) => {
    requests.push({ url, body, key });
    return { data: { places: [{ title: "Shop", cid: "1" }], credits: 3 } };
  });
  try {
    await assert.rejects(tools.mapsSearch({ q: "coffee", maxCredits: 2 }), /at least 3/);
    assert.equal(requests.length, 0);
    const result = await tools.mapsSearch({ q: "coffee", maxCredits: 3 });
    assert.equal(requests[0]?.url, "https://google.serper.dev/maps");
    assert.equal(requests[0]?.body.q, "coffee");
    assert.equal(requests[0]?.key, "test-only");
    assert.equal(result.candidates[0].classification, "candidate");
    assert.equal(result.creditsUsed, 3);
    assert.deepEqual(tools.getCredits(), { creditsUsed: 3 });
  } finally {
    if (previousKey === undefined) delete process.env.SERPER_API_KEY;
    else process.env.SERPER_API_KEY = previousKey;
  }
});

test("Reviews requires a place identifier and returns pagination data", async () => {
  const previousKey = process.env.SERPER_API_KEY;
  process.env.SERPER_API_KEY = "test-only";
  const tools = createOptionalTools(async (url, body) => {
    assert.equal(url, "https://google.serper.dev/reviews");
    assert.equal(body.nextPageToken, "cursor");
    return { data: { reviews: [{ text: "Review" }], nextPageToken: "next", credits: 1 } };
  });
  try {
    await assert.rejects(tools.placeReviews({ maxCredits: 1 }), /at least one/);
    const result = await tools.placeReviews({ cid: "place-cid", nextPageToken: "cursor", maxCredits: 1 });
    assert.equal(result.reviews.length, 1);
    assert.equal(result.nextPageToken, "next");
    assert.deepEqual(tools.getCredits(), { creditsUsed: 1 });
  } finally {
    if (previousKey === undefined) delete process.env.SERPER_API_KEY;
    else process.env.SERPER_API_KEY = previousKey;
  }
});

test("Maps and Reviews report when provider charges exceed the caller budget", async () => {
  const previousKey = process.env.SERPER_API_KEY;
  process.env.SERPER_API_KEY = "test-only";
  const tools = createOptionalTools(async (url) => ({
    data: url.endsWith("/maps") ? { places: [], credits: 4 } : url.endsWith("/reviews") ? { reviews: [], credits: 2 } : { markdown: "", credits: 12 },
  }));
  try {
    const maps = await tools.mapsSearch({ q: "coffee", maxCredits: 3 });
    const reviews = await tools.placeReviews({ cid: "cid", maxCredits: 1 });
    assert.equal(maps.budgetExceeded, true);
    assert.equal(reviews.budgetExceeded, true);
    assert.deepEqual(tools.getCredits(), { creditsUsed: 6 });
  } finally {
    if (previousKey === undefined) delete process.env.SERPER_API_KEY;
    else process.env.SERPER_API_KEY = previousKey;
  }
});

test("combined credit counter sums the base and optional tool ledgers", () => {
  assert.equal(sumCredits({ creditsUsed: 4 }, { creditsUsed: 7 }), 11);
});
