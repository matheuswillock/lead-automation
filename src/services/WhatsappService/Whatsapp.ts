import { Client, LocalAuth } from "whatsapp-web.js";
import { TableCsvRow } from "@/services/CsvService/CsvCore";

const mensagem = `Olá, tudo bem? Gostaria de saber se você está interessado em nossos serviços. Temos uma oferta especial para novos clientes!`;

export interface WhatsAppSendResult {
  status: string[];
  error: string[];
  qrCode?: string;
}

export async function sendWhatsAppMessages(leadsTable: TableCsvRow[] | TableCsvRow): Promise<WhatsAppSendResult> {
  const status: string[] = [];
  const error: string[] = [];
  let qrCode: string | undefined;

  const client = new Client({
    authStrategy: new LocalAuth(),
  });

  return new Promise((resolve) => {
    client.on('qr', (qr) => {
      qrCode = qr;
      status.push('QR code recebido. Escaneie para autenticar.');
    });

    client.on('ready', async () => {
      status.push('Cliente WhatsApp pronto!');
      const leadsArray = Array.isArray(leadsTable) ? leadsTable : [leadsTable];
      if (leadsArray.length === 0) {
        status.push('Nenhum lead encontrado para enviar mensagens.');
        resolve({ status, error, qrCode });
        return;
      }

      for (const lead of leadsArray) {
        const whatsappNumber = lead.whatsappLink?.replace('https://wa.me/', '');

        if (!whatsappNumber) {
          status.push(`Número inválido ou vazio para ${lead.name} (${lead.whatsappLink})`);
          continue;
        }

        try {
          const chatId = `${whatsappNumber}@c.us`;
          status.push(`Enviando mensagem para ${lead.name} (${whatsappNumber})`);
          await client.sendMessage(chatId, mensagem);
          status.push(`Mensagem enviada para ${lead.name}`);
        } catch (err: any) {
          error.push(`Erro ao enviar para ${lead.name} (${whatsappNumber}): ${err?.message || err}`);
        }
      }
      status.push('Todas as mensagens foram processadas!');
      resolve({ status, error, qrCode });
    });

    client.initialize();
  });
}