"use client"

import { Filter, Globe, MapPin, MessageCircle, Phone, Star, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import OutputSearchLead, { Place } from "@/domain/Dto/OutputSearchLead"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { whatsappUrl } from "@/services/helpers/whatsappUrl"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const RESULTS_PER_PAGE = 3

function normalize(value?: string) {
  return (value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
}

function cleanPhoneNumber(phoneNumber?: string) {
  return phoneNumber?.replace(/\D/g, "") ?? ""
}

function ContactActions({ place, countryCode }: { place: Place; countryCode?: string }) {
  const waLink = whatsappUrl(place.phoneNumber, countryCode)
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address || place.title)}`

  return (
    <div className="flex items-center gap-1.5">
      {waLink && (
        <Button asChild type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label={`Abrir WhatsApp de ${place.title}`}>
            <MessageCircle className="size-4" />
          </a>
        </Button>
      )}
      {place.website && (
        <Button asChild type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <a href={place.website} target="_blank" rel="noopener noreferrer" aria-label={`Abrir site de ${place.title}`}>
            <Globe className="size-4" />
          </a>
        </Button>
      )}
      <Button asChild type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${place.title} no mapa`}>
          <MapPin className="size-4" />
        </a>
      </Button>
    </div>
  )
}

function Rating({ place }: { place: Place }) {
  if (typeof place.rating !== "number") return <span className="text-muted-foreground">Sem avaliação</span>

  return (
    <div className="flex items-center gap-1 text-sm">
      <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
      <span className="font-medium tabular-nums">{place.rating.toFixed(1)}</span>
      {place.ratingCount > 0 && <span className="text-xs text-muted-foreground">({place.ratingCount})</span>}
    </div>
  )
}

export default function LeadsTable({ leads }: { leads: OutputSearchLead }) {
  const places = useMemo(() => leads?.places ?? [], [leads])
  const [page, setPage] = useState(1)
  const [nameFilter, setNameFilter] = useState("")
  const [addressFilter, setAddressFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [phoneFilter, setPhoneFilter] = useState("all")
  const [siteFilter, setSiteFilter] = useState("all")

  const categories = useMemo(
    () => [...new Set(places.map((place) => place.category).filter(Boolean))].sort(),
    [places]
  )
  const filteredPlaces = useMemo(() => places.filter((place) => {
    const matchesName = normalize(place.title).includes(normalize(nameFilter))
    const matchesAddress = normalize(place.address).includes(normalize(addressFilter))
    const matchesCategory = categoryFilter === "all" || place.category === categoryFilter
    const matchesRating = ratingFilter === "all" || place.rating >= Number(ratingFilter)
    const hasPhone = Boolean(cleanPhoneNumber(place.phoneNumber))
    const matchesPhone = phoneFilter === "all" || (phoneFilter === "with" ? hasPhone : !hasPhone)
    const matchesSite = siteFilter === "all" || (siteFilter === "with" ? Boolean(place.website) : !place.website)
    return matchesName && matchesAddress && matchesCategory && matchesRating && matchesPhone && matchesSite
  }), [addressFilter, categoryFilter, nameFilter, phoneFilter, places, ratingFilter, siteFilter])
  const totalPages = Math.ceil(filteredPlaces.length / RESULTS_PER_PAGE)
  const hasActiveFilters = Boolean(nameFilter || addressFilter || categoryFilter !== "all" || ratingFilter !== "all" || phoneFilter !== "all" || siteFilter !== "all")

  useEffect(() => setPage(1), [leads, nameFilter, addressFilter, categoryFilter, ratingFilter, phoneFilter, siteFilter])

  const visiblePlaces = useMemo(
    () => filteredPlaces.slice((page - 1) * RESULTS_PER_PAGE, page * RESULTS_PER_PAGE),
    [filteredPlaces, page]
  )

  if (places.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Nenhum candidato encontrado.</div>
  }

  const firstResult = filteredPlaces.length ? (page - 1) * RESULTS_PER_PAGE + 1 : 0
  const lastResult = Math.min(page * RESULTS_PER_PAGE, filteredPlaces.length)

  const clearFilters = () => {
    setNameFilter("")
    setAddressFilter("")
    setCategoryFilter("all")
    setRatingFilter("all")
    setPhoneFilter("all")
    setSiteFilter("all")
  }

  return (
    <div className="space-y-4 lg:flex lg:h-full lg:flex-col">
      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p><span className="font-medium text-foreground">{filteredPlaces.length}</span> de {places.length} candidatos</p>
        <p className="hidden sm:block">Mostrando {firstResult}–{lastResult}</p>
      </div>

      <section aria-label="Filtrar resultados" className="shrink-0 rounded-xl border bg-muted/20 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium"><Filter className="size-4 text-primary" />Filtrar resultados</div>
          {hasActiveFilters && <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={clearFilters}><X className="size-3.5" />Limpar</Button>}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <Input value={nameFilter} onChange={(event) => setNameFilter(event.target.value)} placeholder="Nome da empresa" aria-label="Filtrar por nome" />
          <Input value={addressFilter} onChange={(event) => setAddressFilter(event.target.value)} placeholder="Endereço" aria-label="Filtrar por endereço" />
          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filtrar por categoria" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
            <option value="all">Todas as categorias</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <select value={ratingFilter} onChange={(event) => setRatingFilter(event.target.value)} aria-label="Filtrar por avaliação" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
            <option value="all">Qualquer avaliação</option>
            <option value="4.5">4,5 ou mais</option>
            <option value="4">4,0 ou mais</option>
            <option value="3">3,0 ou mais</option>
          </select>
          <select value={phoneFilter} onChange={(event) => setPhoneFilter(event.target.value)} aria-label="Filtrar por telefone" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
            <option value="all">Telefone: todos</option>
            <option value="with">Com telefone</option>
            <option value="without">Sem telefone</option>
          </select>
          <select value={siteFilter} onChange={(event) => setSiteFilter(event.target.value)} aria-label="Filtrar por site" className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
            <option value="all">Site: todos</option>
            <option value="with">Com site</option>
            <option value="without">Sem site</option>
          </select>
        </div>
      </section>

      {filteredPlaces.length === 0 ? (
        <div className="flex min-h-40 flex-1 items-center justify-center rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Nenhum candidato corresponde aos filtros atuais.</div>
      ) : <>

      <div className="hidden shrink-0 overflow-hidden rounded-xl border lg:block">
        <Table className="table-fixed">
          <TableHeader className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col" className="h-auto w-[38%] px-4 py-3 font-medium">Empresa</TableHead>
              <TableHead scope="col" className="h-auto w-[19%] px-4 py-3 font-medium">Categoria</TableHead>
              <TableHead scope="col" className="h-auto w-[17%] px-4 py-3 font-medium">Avaliação</TableHead>
              <TableHead scope="col" className="h-auto w-[15%] px-4 py-3 font-medium">Telefone</TableHead>
              <TableHead scope="col" className="h-auto w-[11%] px-4 py-3 font-medium"><span className="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePlaces.map((place, index) => (
              <TableRow key={`${place.cid ?? "place"}-${index}`} className="hover:bg-muted/35">
                <TableCell className="px-4 py-4 align-top">
                  <div className="flex gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{initials(place.title)}</div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{place.title}</p>
                      {place.address && <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{place.address}</p>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-4 align-top">{place.category ? <Badge variant="secondary" className="max-w-full truncate font-medium">{place.category}</Badge> : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="px-4 py-4 align-top"><Rating place={place} /></TableCell>
                <TableCell className="px-4 py-4 align-top">{place.phoneNumber ? <span className="inline-flex items-center gap-1.5 text-muted-foreground"><Phone className="size-3.5" />{place.phoneNumber}</span> : <span className="text-muted-foreground">—</span>}</TableCell>
                <TableCell className="px-4 py-4 align-top"><ContactActions place={place} countryCode={leads.searchParameters?.gl} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ul className="space-y-3 lg:hidden">
        {visiblePlaces.map((place, index) => (
          <li key={`${place.cid ?? "place"}-${index}`} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">{initials(place.title)}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium leading-5">{place.title}</p>
                  <Rating place={place} />
                </div>
                {place.category && <Badge variant="secondary" className="mt-2">{place.category}</Badge>}
                {place.address && <p className="mt-2 flex gap-1.5 text-sm text-muted-foreground"><MapPin className="mt-0.5 size-3.5 shrink-0" />{place.address}</p>}
                <div className="mt-3 flex items-center justify-between gap-2">
                  {place.phoneNumber ? <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="size-3.5" />{place.phoneNumber}</span> : <span />}
                  <ContactActions place={place} countryCode={leads.searchParameters?.gl} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} className="lg:mt-auto" />
      </>}
    </div>
  )
}
