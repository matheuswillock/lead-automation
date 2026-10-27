import axios from "axios";
import InputSearchLead from "../../../domain/Dto/InputSearchLead";
import OutputSearchLead from '../../../domain/Dto/OutputSearchLead';
import { Output } from "@/domain/Output";
import { OutputLocations } from "../../../domain/Dto/OutputLocations";
import { InputLocations } from "../../../domain/Dto/InputLocations";

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

  getLocations: async (input: InputLocations): Promise<Output> => {
    try {
      const DEV_BASE_URL = process.env.SERPER_DEV_API_URL;
      
      if (!DEV_BASE_URL) {
        throw new Error("DEV Base URL is not configured");
      }

      // The locations endpoint does not require authentication
      const response = await axios.get(`${DEV_BASE_URL}locations`, {
        params: {
          q: input.query || "",
          limit: input.limit || 25,
        },
      });

      if (!response.data || response.data.length === 0) {
        console.warn("No locations found");
        return OutputLocations.CreateOutput([]);
      }
      return OutputLocations.CreateOutput(response.data || []);
    } catch (error: any) {
      console.error("Error in SerperApi.getLocations:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.warn("Returning empty locations due to error");
      return OutputLocations.CreateOutput([]);
    }
  }
};
