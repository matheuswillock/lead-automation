import { useState, useCallback } from "react";
import { Client, LocalAuth } from "whatsapp-web.js";
import { TableCsvRow } from "@/services/CsvService/CsvCore";

const mensagem = `Olá, tudo bem? Gostaria de saber se você está interessado em nossos serviços. Temos uma oferta especial para novos clientes!`;

export function useWhatsAppSender() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const sendToWhatsApp = useCallback(async (leadsTable: TableCsvRow[] | TableCsvRow) => {
    setStatus("Iniciando envio...");

    setError(null);

    const client = new Client({
      authStrategy: new LocalAuth(),
    });

    client.on('qr', (qr) => {
      setQrCode(qr);
      setStatus('QR code recebido. Escaneie para autenticar.');
    });

    client.on('ready', async () => {
      setStatus('Cliente WhatsApp pronto!');
      const leadsArray = Array.isArray(leadsTable) ? leadsTable : [leadsTable];
      if (leadsArray.length === 0) {
        setStatus('Nenhum lead encontrado para enviar mensagens.');
        return;
      }

      for (const lead of leadsArray) {
        const whatsappNumber = lead.whatsappLink?.replace('https://wa.me/', '');

        if (!whatsappNumber) {
          setStatus(`Número inválido ou vazio para ${lead.name} (${lead.whatsappLink})`);
          continue;
        }

        try {
          const chatId = `${whatsappNumber}@c.us`;
          setStatus(`Enviando mensagem para ${lead.name} (${whatsappNumber})`);
          await client.sendMessage(chatId, mensagem);
          setStatus(`Mensagem enviada para ${lead.name}`);
        } catch (err) {
          if (err instanceof Error) {
            setError(`Erro ao enviar para ${lead.name} (${whatsappNumber}): ${err.message}`);
          } else {
            setError(`Erro ao enviar para ${lead.name} (${whatsappNumber}): ${err}`);
          }
        }
      }
      setStatus('Todas as mensagens foram processadas!');
      setIsSending(false);
    });

    client.initialize();
  }, []);

  return { sendToWhatsApp, status, error, qrCode, isSending };
}