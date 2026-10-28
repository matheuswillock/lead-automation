"use client"

import * as React from "react"
import { MapPin, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type City = {
  label: string
  value: string
  countryCode: string
}

const CITIES: City[] = [
  ["Buenos Aires, Argentina", "ar"], ["Santiago, Chile", "cl"], ["Bogotá, Colômbia", "co"], ["Lima, Peru", "pe"], ["Cidade do México, México", "mx"], ["Nova York, Estados Unidos", "us"], ["Miami, Estados Unidos", "us"], ["Los Angeles, Estados Unidos", "us"], ["Toronto, Canadá", "ca"], ["Lisboa, Portugal", "pt"], ["Porto, Portugal", "pt"], ["Madrid, Espanha", "es"], ["Barcelona, Espanha", "es"], ["Londres, Reino Unido", "gb"], ["Paris, França", "fr"], ["Berlim, Alemanha", "de"], ["Roma, Itália", "it"], ["Tóquio, Japão", "jp"], ["Sydney, Austrália", "au"],
].map(([label, countryCode]) => ({ label, value: label, countryCode }))

type RemoteLocation = Pick<City, "label" | "value">

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
}

interface CityPickerProps {
  id?: string
  value: string
  countryCode: string
  onValueChange: (value: string) => void
}

export function CityPicker({ id, value, countryCode, onValueChange }: CityPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [remoteLocations, setRemoteLocations] = React.useState<City[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const normalizedQuery = normalize(value.trim())
  const isBrazil = countryCode.toLowerCase() === "br"
  const localSuggestions = CITIES.filter((city) => {
    const matchesCountry = city.countryCode === countryCode.toLowerCase()
    return matchesCountry && (!normalizedQuery || normalize(city.label).includes(normalizedQuery))
  }).slice(0, 8)
  const suggestions = isBrazil ? remoteLocations : localSuggestions
  const hasExactSuggestion = suggestions.some((city) => normalize(city.value) === normalizedQuery)
  const canUseTypedValue = value.trim().length >= 3 && !hasExactSuggestion
  const options = canUseTypedValue
    ? [...suggestions, { label: `Usar “${value.trim()}”`, value: value.trim(), countryCode }]
    : suggestions

  React.useEffect(() => {
    if (!isBrazil || value.trim().length < 2) {
      setRemoteLocations([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/locations?country=br&q=${encodeURIComponent(value.trim())}`, {
          signal: controller.signal,
        })
        const data: { locations?: RemoteLocation[] } = await response.json()
        setRemoteLocations(
          response.ok && Array.isArray(data.locations)
            ? data.locations.map((location) => ({ ...location, countryCode: "br" }))
            : []
        )
      } catch (error) {
        if ((error as DOMException).name !== "AbortError") setRemoteLocations([])
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, 250)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [isBrazil, value])

  const select = (nextValue: string) => {
    onValueChange(nextValue)
    setOpen(false)
    setActiveIndex(0)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            id={id}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={`${id}-options`}
            aria-activedescendant={open && options[activeIndex] ? `${id}-option-${activeIndex}` : undefined}
            placeholder="Ex.: Jundiaí, SP, Brasil"
            value={value}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              onValueChange(event.target.value)
              setOpen(true)
              setActiveIndex(0)
            }}
            onKeyDown={(event) => {
              if (!options.length) return
              if (event.key === "ArrowDown") {
                event.preventDefault()
                setOpen(true)
                setActiveIndex((index) => (index + 1) % options.length)
              } else if (event.key === "ArrowUp") {
                event.preventDefault()
                setOpen(true)
                setActiveIndex((index) => (index - 1 + options.length) % options.length)
              } else if (event.key === "Enter" && open) {
                event.preventDefault()
                select(options[activeIndex].value)
              } else if (event.key === "Escape") {
                setOpen(false)
              }
            }}
            className="pr-9"
          />
          {value && (
            <button
              type="button"
              aria-label="Limpar localização"
              onClick={() => {
                onValueChange("")
                setOpen(true)
              }}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-1"
      >
        <div id={`${id}-options`} role="listbox" aria-label="Sugestões de cidades" className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">Buscando cidades...</p>
          ) : options.length ? options.map((city, index) => (
            <button
              key={`${city.countryCode}-${city.value}`}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => select(city.value)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-hidden",
                index === activeIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/70"
              )}
            >
              <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{city.label}</span>
            </button>
          )) : (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              Digite uma cidade para usá-la na busca.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
