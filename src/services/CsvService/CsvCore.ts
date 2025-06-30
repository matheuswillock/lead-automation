import OutputSearchLead, { Place } from "@/domain/Dto/OutputSearchLead";
import { FormatPhoneNumber } from "../helpers/PhoneFormatter";
import XLSX from "xlsx";

export interface TableCsvRow {
  name: string;
  address: string;
  phone: string;
  whatsappLink: string;
  website: string;
  rating: string;
  priceRange: string;
  category: string;
  location: string;
}

export const GenerateCsvContent = (
  searchLeads: OutputSearchLead,
  lastPage?: number
) => {
  if (!searchLeads || !searchLeads.places || searchLeads.places.length === 0) {
    return;
  }

  const { q, location } = searchLeads.searchParameters ?? { q: '', location: '' };

  const excelFilename = `Leads-${q}-${location}-${new Date().toISOString().split('T')[0]}.xlsx`;

  const table: TableCsvRow[] = [];

  searchLeads.places.forEach(place => {
    const { whatsappLink } = FormatPhoneNumber(place.phoneNumber || "");

    const isMobileNumber = /^\d{2}9\d{8}$/.test(whatsappLink.replace('https://wa.me/55', ''));

    if (!isMobileNumber && !place.website) {
      console.log(`⛔️ Removido: ${place.title} (sem celular e sem site)`);
      return;
    }

    const row = GenerateRowCsvContent(place) as TableCsvRow | null;
    row ? table.push(row) : null;
  });

  if (table.length === 0) {
    console.log("⛔️ Nenhum dado válido encontrado para gerar o CSV.");
    return;
  }

  const wsLeads = XLSX.utils.json_to_sheet(table);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsLeads, 'Leads');

  if (lastPage !== undefined) {
    const wsLastPage = XLSX.utils.json_to_sheet([{ lastPage }]);
    XLSX.utils.book_append_sheet(wb, wsLastPage, 'LastPage');
  }

  XLSX.writeFile(wb, excelFilename);

  console.log(`✅ Excel '${excelFilename}' gerado com sucesso! (${table.length} contatos válidos)`);

  return {
    filename: excelFilename,
    content: table,
  };
}

const GenerateRowCsvContent = (item: Place) => {
  if (!item || !item.title || !item.address || !item.latitude || !item.longitude) {
    console.warn("Dados insuficientes para gerar a linha do CSV:", item);
    return null;
  }

  const {formatted, whatsappLink} = FormatPhoneNumber(item.phoneNumber || "");

  return {
    name: item.title || "",
    address: item.address || "",
    phone: formatted,
    whatsappLink: whatsappLink,
    website: item.website || "",
    rating: item.rating ? item.rating.toString() : "",
    priceRange: item.priceLevel || "",
    category: item.category || "",
    location: `${item.latitude}, ${item.longitude}`,
  };
}


// TODO: Validar o uso da api Nominatim para geocodificação reversa
// async function getAddressFromLatLng(lat: number, lng: number): Promise<string | null> {
//   const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
//   const response = await fetch(url, {
//     headers: { 'User-Agent': 'lead-automation/1.0' }
//   });
//   if (!response.ok) return null;
//   const data = await response.json();
//   return data.display_name || null;
// }

// // Uso:
// const lat = -23.55052;
// const lng = -46.633308;
// getAddressFromLatLng(lat, lng).then(address => {
//   console.log(address); // Endereço completo
// });