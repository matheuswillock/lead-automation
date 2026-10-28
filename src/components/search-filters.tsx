"use client"

import { Crown, Loader, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CityPicker } from "@/components/ui/city-picker"
import { CountryPicker } from "@/components/ui/country-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchFiltersProps {
  idPrefix: string
  countryCode: string
  location: string
  leadType: string
  pagesToFetch: number
  maxPages: number
  isLoading: boolean
  isOnboardingLoading: boolean
  hasActiveSubscription: boolean
  isGenerateDisabled: boolean
  onCountryChange: (countryCode: string) => void
  onLocationChange: (location: string) => void
  onLeadTypeChange: (leadType: string) => void
  onPagesChange: (pages: number) => void
  onGenerate: () => void
}

export function SearchFilters({
  idPrefix,
  countryCode,
  location,
  leadType,
  pagesToFetch,
  maxPages,
  isLoading,
  isOnboardingLoading,
  hasActiveSubscription,
  isGenerateDisabled,
  onCountryChange,
  onLocationChange,
  onLeadTypeChange,
  onPagesChange,
  onGenerate,
}: SearchFiltersProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-country`}>País</Label>
        <CountryPicker
          id={`${idPrefix}-country`}
          value={countryCode}
          onValueChange={onCountryChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-location`}>Localização</Label>
        <CityPicker
          id={`${idPrefix}-location`}
          value={location}
          countryCode={countryCode}
          onValueChange={onLocationChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-lead-type`}>Nicho do lead</Label>
        <Input
          id={`${idPrefix}-lead-type`}
          placeholder="Ex.: Hamburgueria"
          value={leadType}
          onChange={(event) => onLeadTypeChange(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-pages`}>Páginas (até 10 resultados por página)</Label>
        <Input
          id={`${idPrefix}-pages`}
          type="number"
          min={1}
          max={maxPages}
          step={1}
          value={pagesToFetch}
          onChange={(event) => onPagesChange(Number(event.target.value))}
        />
        <p className="text-xs leading-5 text-muted-foreground">Cada página pode consumir 1 crédito Serper.</p>
      </div>

      <Button className="mt-auto w-full font-semibold" onClick={onGenerate} disabled={isGenerateDisabled || isLoading}>
        {isOnboardingLoading ? (
          <><Loader className="animate-spin" />Verificando assinatura...</>
        ) : !hasActiveSubscription ? (
          <><Crown />Assinatura necessária</>
        ) : (
          <><Search />Gerar leads</>
        )}
      </Button>
    </div>
  )
}
