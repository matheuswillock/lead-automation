import { GetLeads, InputSerper } from '@/services/SerperService/Serper';
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import { GenerateCsvContent } from "@/services/CsvService/CsvCore";
// import { useWhatsAppSender } from "@/hooks/WhatsappHooks/useWhatsAppSender";

export interface MainProps {
  input: InputSerper;
  lastPage: number;
  apiKey?: string;
  sendToWhatsApp: boolean;
  message?: string;
}

export const Main = async ({input, lastPage, apiKey, sendToWhatsApp} : MainProps) => {
  // const { send, status, error, qrCode, isSending } = useWhatsAppSender();
  const searchLeads: OutputSearchLead = new OutputSearchLead();
  searchLeads.credits = 0;
  console.log('--- Started ---');

  // if (!input) {
  //   console.error('Query is required.');
  //   return;
  // }

  console.log(`Searching for: ${input.query} in location: ${input.location || 'anywhere'}`);

  // const resolvedApiKey = apiKey ?? process.env.SERP_API_KEY;
  // console.log(`Using API key: ${resolvedApiKey}`);
  // if (!resolvedApiKey) {
  //   console.error('API key is required.');
  //   return;
  // }

  for (let page = input.page; page < lastPage ; page++) {
    input.page = page;
    console.log(`Fetching page ${page}...`);

    try {
      console.log(`Fetching leads for query: ${input.query}, location: ${input.location}, page: ${input.page}`);
      const results = await GetLeads(input);
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
      return;
    }
  }

  const csvResult = GenerateCsvContent(searchLeads, lastPage);
  if (!csvResult || !csvResult.filename || !csvResult.content) {
    console.error('No valid data found to generate CSV.');
    return;
  }
  const { filename, content } = csvResult;

  console.log(`CSV generated successfully: ${filename}`);

  console.log(`CSV generated successfully. Total pages searched: ${lastPage}`);
  console.log(`Total pages processed: ${input.page}`);

  // Enviar somente quando o WhatsApp estiver configurado
  // await sendToWhatsApp(content);

  console.log(`Total leads found: ${searchLeads.places?.length || 0}`);
  console.log(`Total credits used: ${searchLeads.credits}`);
  console.log('--- Finished ---');


}