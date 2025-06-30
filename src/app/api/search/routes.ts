import { NextApiRequest, NextApiResponse } from "next";
import { SerperApi } from "../externalHandlers/SerperExternalHandler";
import { Output } from "@/domain/Output";

async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== "POST") {
      return res.status(405).end();
    }

    const {input, apiKey} = req.body;

    if (!input.query || !input.location || !input.country || !input.language || !input.page) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const leads: Output = await SerperApi.search(input, apiKey);

    if (!leads) {
      return res.status(404).json({ error: "No leads found" });
        }

    if (!leads.isValid) {
      return res.status(400).json({ error: "No results found" });
    }

    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json(new Output(false, [], ["Failed to fetch leads"], null));
  }
}
export { POST as default, POST };