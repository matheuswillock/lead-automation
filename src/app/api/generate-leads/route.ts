import { Main } from "@/app/api/useCases/generateLeads";
import { InputSerper, MAX_SERPER_PAGES } from "@/services/SerperService/Serper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }
    const { input, lastPage }: { input: InputSerper; lastPage: number } = await req.json();

    if (!input || typeof input.query !== "string" || !input.query.trim()) {
      return NextResponse.json({ error: "A search query is required" }, { status: 400 });
    }

    if (!Number.isInteger(lastPage) || lastPage < 1 || lastPage > MAX_SERPER_PAGES) {
      return NextResponse.json(
        { error: `lastPage must be an integer between 1 and ${MAX_SERPER_PAGES}` },
        { status: 400 },
      );
    }

    const apiKey = process.env.SERPER_API_KEY?.trim();

    if (!apiKey) return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );

    const result = await Main({
      input,
      lastPage,
      apiKey,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Erro ao gerar leads" }, { status: 500 });
  }
}
