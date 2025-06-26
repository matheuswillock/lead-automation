import axios from "axios";
import InputSearchLead from "./Dto/InputSearchLead";
import OutputSearchLead from './Dto/OutputSearchLead';
import { Output } from "@/domain/Output";

export const SerperApiConfig = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERPER_API_URL || "",
  timeout: 10000, // 10 seconds
})

SerperApiConfig.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  return config;
});

export const SerperApi = {
  search: async (query: InputSearchLead, apiKey: string): Promise<Output> => {
    try {
      const response = await SerperApiConfig.post("/search", query, {
        headers: {
          "X-API-KEY": apiKey || process.env.SERP_API_KEY || "",
        },
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        return new Output(false, [], ["No results found"], null);
      }

      return OutputSearchLead.ToValidOutput(
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
};