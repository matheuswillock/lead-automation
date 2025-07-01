import { InputSerper } from '@/services/SerperService/Serper';
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
  // sendToWhatsApp: boolean;
  // message?: string;
}

export const Main = async ({input, lastPage, apiKey} : MainProps) : Promise<Output> => {
  const searchLeads: OutputSearchLead = new OutputSearchLead();
  searchLeads.credits = 0;
  const resolvedApiKey = apiKey ?? process.env.SERP_API_KEY;

  if (!resolvedApiKey) {
    console.error('API key is required.');
    return OutputGenerateLeads.CreateOutput(undefined, undefined);
  }

  for (let page = input.page; page < lastPage ; page++) {
    input.page = page;
    console.log(`Fetching page ${page}...`);

    try {
      console.log(`Fetching leads for query: ${input.query}, location: ${input.location}, page: ${input.page}`);
      const results = await GetLeads(input);

      if (!results) {
        console.warn(`No valid results found for page ${page}`);
        return OutputGenerateLeads.CreateOutput(undefined, undefined);
      }

      console.log(`Leads fetched successfully: ${JSON.stringify(results)}`);

      if(searchLeads.searchParameters == undefined) {
        searchLeads.searchParameters = results.searchParameters;
        searchLeads.places = results.places;
      } else {
        searchLeads.places = [
          ...(searchLeads.places ?? []),
          ...(results.places ?? [])
        ];
      }

      searchLeads.credits += 1;

    } catch (error) {
      console.error('Error fetching leads:', error);
      return OutputGenerateLeads.CreateOutput(undefined, undefined);
    }
  }

  if (searchLeads.places?.length === 0) {
    return OutputGenerateLeads.CreateOutput(undefined, undefined);
  }

  return OutputGenerateLeads.CreateOutput(searchLeads, lastPage);

  // const csvResult = GenerateCsvContent(searchLeads, lastPage);
  // if (!csvResult || !csvResult.filename || !csvResult.content) {
  //   console.error('No valid data found to generate CSV.');
  //   return;
  // }
  // const { filename, content } = csvResult;

  // console.log(`CSV generated successfully: ${filename}`);

  // console.log(`CSV generated successfully. Total pages searched: ${lastPage}`);
  // console.log(`Total pages processed: ${input.page}`);

  // // Enviar somente quando o WhatsApp estiver configurado
  // // await sendToWhatsApp(content);

  // console.log(`Total leads found: ${searchLeads.places?.length || 0}`);
  // console.log(`Total credits used: ${searchLeads.credits}`);
  // console.log('--- Finished ---');
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

    console.log("Leads fetched successfully:", leads.result);
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
    console.log("Fetching leads with input:", input);
    const data: Output = await SerperApi.places(
      InputSearchLead.fromSearchLead(input),
      apiKey
    );

    if (!data || !data.isValid) {
      console.warn("No leads found or invalid response");
      return new Output(false, [], ["No leads found"], null);
    }

    console.log("Leads fetched successfully:", data.result);
    return data;
  } catch (err: any) {
    console.error("Error fetching leads:", err);
    return new Output(false, [], [err.message || "Unknown error"], null);
  }
};