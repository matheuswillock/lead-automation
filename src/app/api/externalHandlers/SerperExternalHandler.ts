import axios from "axios";
import InputSearchLead from "../../../domain/Dto/InputSearchLead";
import OutputSearchLead from '../../../domain/Dto/OutputSearchLead';
import { Output } from "@/domain/Output";

const DEFAULT_PLACES_URL = "https://google.serper.dev/places";

const getPlacesUrl = (): string => {
  const configuredUrl = process.env.SERPER_API_URL?.trim();
  if (!configuredUrl) return DEFAULT_PLACES_URL;

  const normalizedUrl = configuredUrl.replace(/\/+$/, "");
  return normalizedUrl.endsWith("/places")
    ? normalizedUrl
    : `${normalizedUrl}/places`;
};

export const SerperApi = {
  placesBatch: async (queries: InputSearchLead[], apiKey?: string): Promise<Output[]> => {
    try {
      const key = apiKey?.trim() || process.env.SERPER_API_KEY;
      if (!queries?.length || !key || queries.some((query) => !query?.q?.trim())) {
        throw new Error("Invalid queries or API key");
      }
      const response = await axios.post(getPlacesUrl(), queries, {
        headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      });
      if (!Array.isArray(response?.data) || response.data.length !== queries.length) {
        throw new Error("Invalid Serper Places batch response");
      }
      return response.data.map((item: any) => OutputSearchLead.CreateOutput(item.searchParameters, item.places, item.credits));
    } catch (error: any) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const message = status ? `Serper Places request failed with HTTP ${status}` : error.message || "Unknown error";
      console.error("Error in SerperApi.placesBatch:", message);
      return [new Output(false, [], [message], null)];
    }
  },
  places: async (query: InputSearchLead, apiKey?: string): Promise<Output> => {
    try {

      const key = apiKey?.trim() || process.env.SERPER_API_KEY;
      const baseUrl = getPlacesUrl();
      if (!query || !key) {
        throw new Error("Invalid query or API key");
      }

      if (!query.q?.trim()) {
        throw new Error("A search query is required");
      }

      const response = await axios.post(baseUrl, query, {
        headers: {
          "X-API-KEY": key,
          "Content-Type": "application/json",
        },
      });

      if (!response || !response.data) {
        console.warn("36 - SerperApi.search: No data in response");
        return new Output(false, [], ["No results found"], null);
      }

      if (!response.data || !response.data.places || response.data.places.length === 0) {
        console.warn("36 - SerperApi.search: No places found in response");
        return new Output(false, [], ["No results found"], null);
      }

      return OutputSearchLead.CreateOutput(
        response.data.searchParameters,
        response.data.places,
        response.data.credits
      );

    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const safeMessage = status
        ? `Serper Places request failed with HTTP ${status}`
        : errorMessage;
      console.error("Error in SerperApi.places:", safeMessage);
      return new Output(false, [], [safeMessage], null);
    }
  },
};
