"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Country = {
  code: string
  name: string
}

const COUNTRY_CODES = `AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW XK`.split(" ")

const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" })

const countries: Country[] = COUNTRY_CODES.map((code) => ({
  code: code.toLowerCase(),
  name: regionNames.of(code) ?? code,
})).sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))

function countryFlag(code: string) {
  return String.fromCodePoint(...code.toUpperCase().split("").map((letter) => 127397 + letter.charCodeAt(0)))
}

interface CountryPickerProps {
  id?: string
  value: string
  onValueChange: (countryCode: string) => void
  disabled?: boolean
}

export function CountryPicker({ id, value, onValueChange, disabled }: CountryPickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedCountry = countries.find((country) => country.code === value.toLowerCase())

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Selecionar país"
          disabled={disabled}
          className="w-full justify-between px-3 font-normal"
        >
          {selectedCountry ? (
            <span className="flex min-w-0 items-center gap-2">
              <span aria-hidden="true" className="text-base leading-none">{countryFlag(selectedCountry.code)}</span>
              <span className="truncate">{selectedCountry.name}</span>
              <span className="text-muted-foreground">({selectedCountry.code})</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Selecione o país</span>
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Buscar país ou código ISO..." />
          <CommandList className="max-h-64">
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            <CommandGroup heading="Países">
              {countries.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => {
                    onValueChange(country.code)
                    setOpen(false)
                  }}
                  className="py-2"
                >
                  <span aria-hidden="true" className="text-base leading-none">{countryFlag(country.code)}</span>
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                  <span className="text-muted-foreground text-xs">{country.code}</span>
                  <Check
                    className={cn(
                      "ml-1 size-4 text-primary",
                      selectedCountry?.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                    aria-hidden="true"
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
