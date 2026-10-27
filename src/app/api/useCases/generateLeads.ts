import { InputSerper, MAX_SERPER_PAGES } from '@/services/SerperService/Serper';
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import { GenerateCsvContent } from "@/services/CsvService/CsvCore";
import { Output } from '@/domain/Output';
import { OutputGenerateLeads } from './dto/OutputGenerateLeads';
import { SerperApi } from '../externalHandlers/SerperExternalHandler';
import InputSearchLead from '@/domain/Dto/InputSearchLead';
// import { useWhatsAppSender } from "@/hooks/WhatsappHooks/useWhatsAppSender";

export interface MainProps {
  input: InputSerper;
  lastPage: number;
  apiKey?: string;
}

export const Main = async ({input, lastPage, apiKey} : MainProps) : Promise<Output> => {
  if (!input || !input.query?.trim()) {
    return new Output(false, [], ["A search query is required"], null);
  }

  if (!Number.isInteger(lastPage) || lastPage < 1 || lastPage > MAX_SERPER_PAGES) {
    return new Output(false, [], [`lastPage must be between 1 and ${MAX_SERPER_PAGES}`], null);
  }

  const searchLeads: OutputSearchLead = new OutputSearchLead();
  searchLeads.credits = 0;
  const resolvedApiKey = apiKey?.trim() || process.env.SERPER_API_KEY;

  if (!resolvedApiKey) {
    console.error('API key is required.');
    return OutputGenerateLeads.CreateOutput(undefined, undefined);
  }

  const firstPage = Number.isInteger(input.page) && input.page > 0 ? input.page : 1;

  for (let page = firstPage; page <= lastPage ; page++) {
    const pageInput = { ...input, page };

    try {
      const results = await GetLeads(pageInput, resolvedApiKey);

      if (!results) {
        console.warn(`No valid results found for page ${page}`);
        return OutputGenerateLeads.CreateOutput(undefined, undefined);
      }

      if(searchLeads.searchParameters == undefined) {
        searchLeads.searchParameters = results.searchParameters;
        searchLeads.places = results.places;
      } else {
        searchLeads.places = [
          ...(searchLeads.places ?? []),
          ...(results.places ?? [])
        ];
      }

      searchLeads.credits += results.credits ?? 1;

    } catch (error) {
      console.error('Error fetching leads:', error);
      return OutputGenerateLeads.CreateOutput(undefined, undefined);
    }
  }

  if (searchLeads.places?.length === 0) {
    return OutputGenerateLeads.CreateOutput(undefined, undefined);
  }

  return OutputGenerateLeads.CreateOutput(searchLeads, lastPage);
}

export const GetLeads = async (
  input: InputSerper,
  apiKey?: string
) : Promise<OutputSearchLead | null> => {
  try {
    if (!input) {
      throw new Error("Invalid input: InputSerper is required");
    }

    const leads: Output = await loadLeads(input, apiKey)
    if (!leads || !leads.isValid) {
      console.warn("No leads found or invalid response");
      return null;
    }

    if (!leads.result || !leads.result.searchParameters || !leads.result.places) {
      console.warn("Invalid leads structure");
      return null;
    }

    if (!leads) {
      return null;
    }

    return leads.result as OutputSearchLead;
  } catch (error: any) {
    console.error("Error in SerperService:", error);
    return null;
  }
};

const loadLeads = async (input: InputSerper, apiKey?: string): Promise<Output> => {
  try {
    const data: Output = await SerperApi.places(
      InputSearchLead.fromSearchLead(input),
      apiKey
    );

    if (!data || !data.isValid) {
      console.warn("No leads found or invalid response");
      return new Output(false, [], ["No leads found"], null);
    }

    return data;
  } catch (err: any) {
    console.error("Error fetching leads:", err);
    return new Output(false, [], [err.message || "Unknown error"], null);
  }
};
