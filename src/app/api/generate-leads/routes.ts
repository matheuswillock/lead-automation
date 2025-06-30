import type { NextApiRequest, NextApiResponse } from "next";
import { Main } from "@/app/api/useCases/Main";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { input, lastPage, sendToWhatsApp, message } = req.body;
    // Chave de API só no backend!
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) return res.status(500).json({ error: "API key not configured" });

    // Chame sua função Main passando a chave
    await Main({
      input,
      lastPage,
      apiKey,
      sendToWhatsApp,
      message,
    });

    // Você pode retornar um resultado ou apenas status
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Erro ao gerar leads" });
  }
}

