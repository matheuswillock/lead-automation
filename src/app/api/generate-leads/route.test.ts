import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { POST } from "./route";

const input = {
  query: "BPO financeiro",
  location: "Jundiaí, SP, Brazil",
  country: "br",
  language: "pt-br",
  page: 1,
};

test("lead search rejects page limits outside the supported Serper range", async () => {
  for (const lastPage of [0, 11, 1.5]) {
    const response = await POST(
      new NextRequest("http://localhost/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, lastPage }),
      }),
    );

    assert.equal(response.status, 400, `lastPage=${lastPage} should be rejected`);
  }
});
