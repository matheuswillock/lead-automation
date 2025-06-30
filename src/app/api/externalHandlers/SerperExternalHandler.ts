import axios from "axios";
import InputSearchLead from "../../../domain/Dto/InputSearchLead";
import OutputSearchLead from '../../../domain/Dto/OutputSearchLead';
import { Output } from "@/domain/Output";
import { OutputLocations } from "../../../domain/Dto/OutputLocations";
import { InputLocations } from "../../../domain/Dto/InputLocations";

const BASE_URL = process.env.SERPER_API_URL;
const DEV_BASE_URL = process.env.SERPER_DEV_API_URL;
const API_KEY = process.env.SERPER_API_KEY;

export const SerperApi = {
  search: async (query: InputSearchLead, apiKey?: string): Promise<Output> => {
    try {

      const key = apiKey ?? API_KEY;
      if (!query || !key) {
        throw new Error("Invalid query or API key");
      }

      const response = await axios.post(`${BASE_URL}/search`, query, {
        headers: {
          "X-API-KEY": key,
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
      console.log("url:", `${DEV_BASE_URL}/locations`);
      const response = await axios.get(`${DEV_BASE_URL}/locations`, {
        params: {
          q: input.query,
          limit: input.limit,
        },
      });

      console.log("Response from Serper API:", response.data);

      if (!response.data || response.data.length === 0) {
        console.warn("No locations found");
        return OutputLocations.CreateOutput([]);
      }

      console.log("Locations fetched successfully:", response.data);
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