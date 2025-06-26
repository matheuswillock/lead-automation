import axios from "axios";
import InputSearchLead from "./Dto/InputSearchLead";
import OutputSearchLead from './Dto/OutputSearchLead';
import { Output } from "@/domain/Output";
import { OutputLocations } from "./Dto/OutputLocations";
import { InputLocations } from "./Dto/InputLocations";

const BASE_URL = process.env.NEXT_PUBLIC_SERPER_API_URL;
const DEV_BASE_URL = process.env.NEXT_PUBLIC_SERPER_DEV_API_URL;

export const SerperApi = {
  search: async (query: InputSearchLead, apiKey: string): Promise<Output> => {
    try {
      const response = await axios.post(`${BASE_URL}/search`, query, {
        headers: {
          "X-API-KEY": apiKey || process.env.SERP_API_KEY || "",
        },
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        return new Output(false, [], ["No results found"], null);
      }

      return OutputSearchLead.CreateOutput(
        response.data.searchParameters,
        response.data.places,
        response.data.credits
      );

    } catch (error: any) {
      console.error("Error in SerperApi.search:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      throw error;
    }
  },

  getLocations: async (input: InputLocations): Promise<Output> => {
    try {
      const response = await axios.get(`${DEV_BASE_URL}/locations`, {
        params: {
          q: input.query,
          limit: input.limit,
        },
      });

      if (!response.data || !response.data.locations || response.data.locations.length === 0) {
        return OutputLocations.CreateOutput([]);
      }

      return OutputLocations.CreateOutput(response.data.locations || []);
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
      throw error;
    }
  }
};