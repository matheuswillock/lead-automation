'use client'
import InputSearchLead from "@/domain/Dto/InputSearchLead";
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import { OutputLocations } from '../../domain/Dto/OutputLocations';
import { InputLocations } from "@/domain/Dto/InputLocations";
import { Output } from "@/domain/Output";

export interface InputSerper {
  query: string;
  location: string;
  country: string;
  language: string;
  page: number;
}

export const GetLeads = async (
  input: InputSerper,
  apiKey?: string
) : Promise<OutputSearchLead> => {
  try {
    if (!input) {
      throw new Error("Invalid input: InputSerper is required");
    }

    const leads: OutputSearchLead | null = await loadLeads(input, apiKey)

    if (!leads) {
      throw new Error("No leads found");
    }

    return leads as OutputSearchLead;
  } catch (error) {
    console.error("Error in SerperService:", error);
    throw new Error("Failed to fetch data from Serper API");
  }
};

const loadLeads = async (input: InputSerper, apiKey?: string): Promise<OutputSearchLead | null> => {
  try {
    const res = await fetch("http://localhost:3001/api/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, apiKey }),
    });
    const data: Output = await res.json();

    if (!res.ok) {
      console.warn("Failed to fetch leads:", data.errorMessages || "Unknown error");
      return null;
    }

    if (!data || !data.isValid) {
      console.warn("No leads found or invalid response");
      return null;
    }

    console.log("Leads fetched successfully:", data.result);
    return data.result as OutputSearchLead;
  } catch (err) {
    console.error("Error fetching leads:", err);
    return null;
  }
};

export const GetLocations = async (query: string, limit: number) : Promise<OutputLocations>  => {
  try {
    console.log("Fetching locations for query:", query, "with limit:", limit);

    // TODO: Chamar a API Serper para buscar locais
    const fetchedLocations = await loadLocations(new InputLocations(query, limit));

    if (!fetchedLocations || !fetchedLocations.locations || fetchedLocations.locations.length === 0) {
      console.warn("No locations found or invalid response");
      return new OutputLocations([]);
    }

    console.log("Locations fetched successfully:", fetchedLocations.locations);
    return fetchedLocations as OutputLocations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return new OutputLocations([]);
  }
}

const loadLocations = async (input: InputLocations): Promise<OutputLocations> => {
  try {
    const res = await fetch("http://localhost:3001/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data: Output = await res.json();

    if (!res.ok) {
      console.warn("Failed to fetch locations:", data.errorMessages || "Unknown error");
      return new OutputLocations([]);
    }

    if (!data || !data.isValid) {
      console.warn("No locations found or invalid response");
      return new OutputLocations([]);
    }

    console.log("Locations fetched successfully:", data.result);
    if (!data.result.locations || data.result.locations.length === 0) {
      console.warn("No locations found in response");
      return new OutputLocations([]);
    }
    return data.result as OutputLocations;
  } catch (err) {
    console.error("Error fetching locations:", err);
    return new OutputLocations([]);
  }
};