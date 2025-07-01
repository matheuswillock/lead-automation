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

export const GetLocations = async (query: string, limit: number) : Promise<OutputLocations>  => {
  try {
    // TODO: Chamar a API Serper para buscar locais
    const fetchedLocations = await loadLocations(new InputLocations(query, limit));

    if (!fetchedLocations || !fetchedLocations.locations || fetchedLocations.locations.length === 0) {
      console.warn("No locations found or invalid response");
      return new OutputLocations([]);
    }

    return fetchedLocations as OutputLocations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return new OutputLocations([]);
  }
}

const loadLocations = async (input: InputLocations): Promise<OutputLocations> => {
  try {
    const res = await fetch("api/locations", {
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