import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("phase 4 evaluation contains ten independent zero-credit MCP tasks", () => {
  const xml = readFileSync(new URL("./evaluation.xml", import.meta.url), "utf8");
  const pairs = [...xml.matchAll(/<qa_pair>\s*<question>([\s\S]*?)<\/question>\s*<answer>([\s\S]*?)<\/answer>\s*<\/qa_pair>/g)];

  assert.equal(pairs.length, 10);
  assert.equal(new Set(pairs.map(([, question]) => question)).size, 10);
  for (const [, question, answer] of pairs) {
    assert.match(question, /leadsfy_filter_candidates twice/);
    assert.match(question, /mock candidates/);
    assert.ok(answer.trim().length > 0);
    assert.doesNotMatch(question, /leadsfy_(?:search_places|search_places_pages|run_batch|maps_search|place_reviews)\b/);
  }
});
