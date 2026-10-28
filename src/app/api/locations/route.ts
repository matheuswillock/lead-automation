
import { NextRequest, NextResponse } from "next/server"

type BrasilApiCity = { nome?: unknown; estado?: unknown }
type Location = { label: string; value: string }

const BRASIL_API_BASE_URL = "https://brasilapi.com.br/api/cptec/v1/cidade"
const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map<string, { expiresAt: number; locations: Location[] }>()

function emptyResponse() {
  return NextResponse.json({ locations: [] satisfies Location[] })
}

function normalizeCities(payload: unknown): Location[] {
  if (!Array.isArray(payload)) return []

  const seen = new Set<string>()
  const locations: Location[] = []
  for (const item of payload as BrasilApiCity[]) {
    if (typeof item.nome !== "string" || typeof item.estado !== "string") continue

    const city = item.nome.trim()
    const state = item.estado.trim().toUpperCase()
    if (!city || !/^[A-Z]{2}$/.test(state)) continue

    const value = `${city}, ${state}, Brasil`
    if (!seen.has(value)) {
      seen.add(value)
      locations.push({ label: value, value })
    }
  }
  return locations.slice(0, 8)
}

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country")?.trim().toLowerCase()
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? ""

  if (country !== "br" || query.length < 2 || query.length > 100) return emptyResponse()

  const cacheKey = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
  const cached = cache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json({ locations: cached.locations })
  }

  try {
    const response = await fetch(`${BRASIL_API_BASE_URL}/${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(4_000),
      next: { revalidate: 300 },
    })
    if (response.status === 404) return emptyResponse()
    if (!response.ok) {
      return NextResponse.json({ error: "Não foi possível buscar cidades agora." }, { status: 502 })
    }

    const locations = normalizeCities(await response.json())
    cache.set(cacheKey, { locations, expiresAt: Date.now() + CACHE_TTL_MS })
    return NextResponse.json({ locations })
  } catch {
    return NextResponse.json({ error: "Não foi possível buscar cidades agora." }, { status: 502 })
  }
}
