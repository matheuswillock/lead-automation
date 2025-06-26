import { SerperApi } from "@/app/api/serperApi/routes";
// import { inputSerper } from "./dto/InputSerper";
import InputSearchLead from "@/app/api/serperApi/Dto/InputSearchLead";
import OutputSearchLead from "@/app/api/serperApi/Dto/OutputSearchLead";
import { OutputLocations } from '../../app/api/serperApi/Dto/OutputLocations';
import { InputLocations } from "@/app/api/serperApi/Dto/InputLocations";

export interface InputSerper {
  query: string;
  location: string;
  country: string;
  language: string;
  page: number;
}

export const GetLeads = async (
  input: InputSerper,
  apiKey: string
) : Promise<OutputSearchLead> => {
  try {
    if (!input || !apiKey) {
      throw new Error("Invalid input or API key");
    }
    const generateLeads = await SerperApi.search(
      InputSearchLead.fromSearchLead(input),
      apiKey
    );

    if (!generateLeads.isValid) {
      throw new Error("No results found");
    }

    return generateLeads.result as OutputSearchLead;
  } catch (error) {
    console.error("Error in SerperService:", error);
    throw new Error("Failed to fetch data from Serper API");
  }
};

export const GetLocations = async (query: string, limit: number) : Promise<OutputLocations>  => {
  try {
    const locations = await SerperApi.getLocations(new InputLocations(query, limit));

    if (!locations || !locations.isValid) {
      throw new Error("No locations found");
    }

    return locations.result as OutputLocations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    throw new Error("Failed to fetch locations from Serper API");
  }
}