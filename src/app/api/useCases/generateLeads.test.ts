import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";
import { Main } from "@/app/api/useCases/generateLeads";
import type { InputSerper } from "@/services/SerperService/Serper";
import { Output } from "@/domain/Output";
import OutputSearchLead, {
  type Place,
  type SearchParameters,
} from "@/domain/Dto/OutputSearchLead";
import { SerperApi } from "@/app/api/externalHandlers/SerperExternalHandler";
import InputSearchLead from "@/domain/Dto/InputSearchLead";

function makePlace(position: number): Place {
  return {
    position,
    title: `Business ${position}`,
    address: "Rua de Teste, 1, Jundiaí - SP",
    latitude: -23.18,
    longitude: -46.88,
    rating: 4.8,
    ratingCount: 32,
    priceLevel: "",
    category: "Business",
    cid: `cid-${position}`,
    phoneNumber: "5511999999999",
    website: "https://example.test",
  };
}

function makeSerperOutput(page: number, credits: number): Output {
  const searchParameters = {
    q: "BPO financeiro",
    gl: "br",
    hl: "pt-br",
    uule: "",
    type: "places",
    num: 10,
    page,
    location: "Jundiaí, SP, Brazil",
    disableBackup: false,
    engine: "google",
  } as SearchParameters;

  return new Output(
    true,
    [],
    [],
    new OutputSearchLead(searchParameters, [makePlace(page)], credits),
  );
}

test("Main forwards the request API key to each Serper places call", async () => {
  const originalPlaces = SerperApi.places;
  const receivedKeys: Array<string | undefined> = [];
  SerperApi.places = async (_query, apiKey) => {
    receivedKeys.push(apiKey);
    return makeSerperOutput(1, 1);
  };

  try {
    await Main({
      input: {
        query: "BPO financeiro",
        location: "Jundiaí, SP, Brazil",
        country: "br",
        language: "pt-br",
        page: 1,
      },
      lastPage: 1,
      apiKey: "request-scoped-test-key",
    });

    assert.deepEqual(receivedKeys, ["request-scoped-test-key"]);
  } finally {
    SerperApi.places = originalPlaces;
  }
});

test("Main sums Serper-reported credits and does not mutate the input page", async () => {
  const originalPlaces = SerperApi.places;
  const pages: number[] = [];
  SerperApi.places = async (query) => {
    pages.push(query.page);
    return makeSerperOutput(query.page, query.page + 1);
  };

  const input: InputSerper = {
    query: "BPO financeiro",
    location: "Jundiaí, SP, Brazil",
    country: "br",
    language: "pt-br",
    page: 1,
  };

  try {
    const output = await Main({ input, lastPage: 2, apiKey: "test-key" });

    assert.equal(output.isValid, true);
    assert.deepEqual(pages, [1, 2]);
    assert.equal(output.result.leads.credits, 5);
    assert.equal(input.page, 1);
  } finally {
    SerperApi.places = originalPlaces;
  }
});

test("Places request folds the location into q and never sends location", () => {
  const request = InputSearchLead.fromSearchLead({
    query: "oficina mecânica",
    location: " Jundiaí, SP ",
    country: "br",
    language: "pt-br",
    page: 1,
  });

  assert.equal(request.q, "oficina mecânica Jundiaí, SP");
  assert.equal("location" in JSON.parse(JSON.stringify(request)), false);
});

test("Places request omits an empty optional location", () => {
  const request = InputSearchLead.fromSearchLead({
    query: "BPO financeiro",
    location: "  ",
    country: "br",
    language: "pt-br",
    page: 1,
  });

  assert.equal(request.q, "BPO financeiro");
  assert.equal(request.gl, "br");
  assert.equal(request.hl, "pt-br");
  assert.equal(request.page, 1);
  assert.equal("location" in JSON.parse(JSON.stringify(request)), false);
});

test("Serper Places uses the current endpoint and authenticated JSON contract", async () => {
  const originalPost = axios.post;
  const originalUrl = process.env.SERPER_API_URL;
  let request: { url: string; body: unknown; headers: Record<string, string> } | undefined;
  delete process.env.SERPER_API_URL;

  axios.post = (async (url: string, body: unknown, config?: { headers?: Record<string, string> }) => {
    request = { url, body, headers: config?.headers ?? {} };
    return {
      data: {
        searchParameters: {
          q: "BPO financeiro",
          gl: "br",
          hl: "pt-br",
          page: 1,
          type: "places",
        },
        places: [makePlace(1)],
        credits: 1,
      },
    } as never;
  }) as typeof axios.post;

  try {
    const result = await SerperApi.places(
      new InputSearchLead("BPO financeiro", "Jundiaí, SP, Brazil", "br", "pt-br", 1),
      "request-scoped-test-key",
    );

    assert.equal(result.isValid, true);
    assert.equal(request?.url, "https://google.serper.dev/places");
    assert.deepEqual(JSON.parse(JSON.stringify(request?.body)), {
      q: "BPO financeiro",
      location: "Jundiaí, SP, Brazil",
      gl: "br",
      hl: "pt-br",
      page: 1,
    });
    assert.equal(request?.headers["X-API-KEY"], "request-scoped-test-key");
    assert.equal(request?.headers["Content-Type"], "application/json");
  } finally {
    axios.post = originalPost;
    if (originalUrl === undefined) delete process.env.SERPER_API_URL;
    else process.env.SERPER_API_URL = originalUrl;
  }
});
