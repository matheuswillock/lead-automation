import assert from "node:assert/strict"
import test from "node:test"
import { NextRequest } from "next/server"

import { GET } from "./route"

test("returns normalized Brazilian city suggestions from BrasilAPI", async () => {
  const originalFetch = global.fetch
  let requestedUrl = ""

  global.fetch = (async (input: URL | RequestInfo) => {
    requestedUrl = String(input)
    return Response.json([
      { nome: "Jundiaí", estado: "SP", id: 1, regiao: "Sudeste" },
    ])
  }) as typeof fetch

  try {
    const response = await GET(new NextRequest("http://localhost/api/locations?country=br&q=jundiai"))

    assert.equal(response.status, 200)
    assert.equal(requestedUrl, "https://brasilapi.com.br/api/cptec/v1/cidade/jundiai")
    assert.deepEqual(await response.json(), {
      locations: [{ label: "Jundiaí, SP, Brasil", value: "Jundiaí, SP, Brasil" }],
    })
  } finally {
    global.fetch = originalFetch
  }
})

test("does not call an external service for unsupported countries or short searches", async () => {
  const originalFetch = global.fetch
  let fetchCalls = 0
  global.fetch = (async () => {
    fetchCalls += 1
    return Response.json([])
  }) as typeof fetch

  try {
    for (const url of [
      "http://localhost/api/locations?country=us&q=new%20york",
      "http://localhost/api/locations?country=br&q=s",
    ]) {
      const response = await GET(new NextRequest(url))
      assert.equal(response.status, 200)
      assert.deepEqual(await response.json(), { locations: [] })
    }
    assert.equal(fetchCalls, 0)
  } finally {
    global.fetch = originalFetch
  }
})
