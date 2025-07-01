"use client";

import { LocationData } from "@/domain/Dto/OutputLocations";
import { useCallback, useEffect, useState } from "react";
import { Input } from "./input";
import { GetLocations } from "@/services/SerperService/Serper";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "./command";
import { cn } from "@/lib/utils";

interface LocationInputProps {
  placeholder: string;
  onLocationSelect: (location: LocationData) => void;
  initialValue?: string;
  filterType: "All" | "Country" | "State" | "Province" | "City";
}

interface LocationsToSelect {
  name: string;
  canonicalName: string;
  countryCode: string;
  CountryFlag: string;
}

export function LocationInput({
  placeholder,
  onLocationSelect,
  initialValue = "",
  filterType,
}: LocationInputProps) {
  const [query, setQuery] = useState(initialValue);
  const [debouncedQuery, setDebouncedQuery] = useState(initialValue);
  const [selectedLocations, setSelectedLocations] = useState<LocationsToSelect[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getCountryFlagUrl = (countryCode: string) => {
    return `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;
  };

  const handleSelectLocation = (locations: LocationData[]) => {
    let filtered = locations;

    if (filterType === "Country") {
      filtered = locations.filter((location) => location.targetType === "Country");
    } else {
      filtered = locations.filter((location) => location.targetType !== "Country");
    }

    const locationsToSelect = filtered.map((location) => ({
      name: location.name ?? "",
      canonicalName: location.canonicalName ?? "",
      CountryFlag: location.countryCode ? getCountryFlagUrl(location.countryCode) : "",
      countryCode: location.countryCode ?? "",
    }));

    setSelectedLocations(locationsToSelect);
  };

  const fetchLocations = useCallback(
    async (q: string): Promise<void> => {
      try {
        setIsLoading(true);
        const result = await GetLocations(q, 25);
        if (result.locations && result.locations.length > 0) {
          handleSelectLocation(result.locations);
        } else {
          handleSelectLocation([]);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        handleSelectLocation([]);
      } finally {
        setIsLoading(false);
      }
    }, []
  );

  // Busca inicial ao montar
  useEffect(() => {
    fetchLocations("");
  }, [fetchLocations]);

  // Busca ao alterar debouncedQuery
  useEffect(() => {
    fetchLocations(debouncedQuery);
  }, [debouncedQuery, fetchLocations]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // 500ms de debounce
    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <div className="relative w-full">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between pr-10"
            >
              {value
                ? (() => {
                    const selected = selectedLocations.find(
                      (location) => location.name === value
                    );
                    return selected ? (
                      <span className="flex items-center gap-2">
                        {selected.CountryFlag && (
                          <img
                            src={selected.CountryFlag}
                            alt={selected.countryCode}
                            width={20}
                            height={15}
                            className="rounded-sm object-contain"
                          />
                        )}
                        {selected.canonicalName} ({selected.countryCode})
                      </span>
                    ) : (
                      "Select location..."
                    );
                  })()
                : "Select location..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={placeholder}
              className="h-9 w-full"
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {isLoading && (
                  <div className="flex items-center justify-center py-4 w-full">
                    <LoaderCircle className="animate-spin" />
                  </div>
                )}

                {selectedLocations.map((location, index) => (
                  <CommandItem
                    key={index}
                    value={location.canonicalName || ""}
                    onSelect={() => {
                      setValue(location.name);
                      setQuery(location.canonicalName || "");
                      setOpen(false);
                      onLocationSelect && onLocationSelect(location as any);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {location.CountryFlag && (
                        <img
                          src={location.CountryFlag}
                          alt={location.countryCode}
                          width={20}
                          height={15}
                          className="rounded-sm object-contain"
                        />
                      )}
                      {location.canonicalName} ({location.countryCode})
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === location.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
