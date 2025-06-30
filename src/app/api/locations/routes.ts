import { NextApiRequest, NextApiResponse } from "next";
import { SerperApi } from "../externalHandlers/SerperExternalHandler";
import { InputLocations } from "../../../domain/Dto/InputLocations";
import { Output } from "@/domain/Output";

async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({ error: "Input is required" });
    }

    const locations: Output = await SerperApi.getLocations(input as InputLocations);

    if (!locations) {
      return res.status(404).json({ error: "No locations found" });
    } else if (!locations.isValid) {
      return res.status(400).json({ locations });
    }

    return res.status(200).json(locations);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message || "Error fetching locations" });
  }
}

export { POST as default, POST };
