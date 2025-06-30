
import { SerperApi } from "../externalHandlers/SerperExternalHandler";
import { InputLocations } from "../../../domain/Dto/InputLocations";
import { Output } from "@/domain/Output";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // if (req.method !== "POST") return res.status(405).end();

  try {
    console.log("Received request to fetch locations");
    const input = await req.json();

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }

    const locations: Output = await SerperApi.getLocations(input as InputLocations);

    if (!locations) {
      return NextResponse.json({ error: "No locations found" }, { status: 404 });
    } else if (!locations.isValid) {
      return NextResponse.json({ locations }, { status: 400 });
    }

    return NextResponse.json(locations, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Error fetching locations" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "API de locations está ativa. Use POST para buscar locais." });
}