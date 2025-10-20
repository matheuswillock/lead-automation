"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { BotMessageSquare, Loader } from "lucide-react";
import { ModeToggle } from "@/components/ui/modeToggle";
import { LocationInput } from "@/components/ui/LocationInput";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more";
import { DownloadIcon } from "@/components/ui/download";
import { SearchIcon } from "@/components/ui/search";
import { FileCheck2Icon } from "@/components/ui/file-check-2";
import { MapPinIcon } from "@/components/ui/map-pin";
import { MapPinHouseIcon } from "@/components/ui/map-pin-house";
import { MainProps } from "@/app/api/useCases/generateLeads";
import { InputSerper } from "@/services/SerperService/Serper";
import { GenerateCsvContent } from "@/services/CsvService/CsvCore";
import { Output } from "@/domain/Output";
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import LeadsTable from "@/components/leads-table";

export default function Home() {
  const [country, setCountry] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("BR");
  const [location, setLocation] = useState<string>("");
  const [leadType, setLeadType] = useState<string>("");
  const [sendToWhatsApp, setSendToWhatsApp] = useState<boolean>(true);
  const [searchLeads, setSearchLeads] = useState<OutputSearchLead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = useState<boolean>(false);
  const [whatsappMessage, setWhatsappMessage] = useState<string>(
    `Olá! Tudo bem? 😊\n\nAqui é o Cheffia — uma solução moderna para gestão de pedidos e pagamentos em restaurantes!\n\nVocê consegue automatizar pedidos, integrar pagamentos via QR Code e muito mais.\n\nGostaria de saber mais? É só responder aqui. 🚀`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isGenerateDisabled =
  !country ||
  !location ||
  !leadType ||
  country.trim().length <= 3 ||
  location.trim().length <= 3 ||
  leadType.trim().length <= 3;

  const input: InputSerper = {
    query: leadType,
    location: location,
    country: countryCode.toLocaleLowerCase(),
    language: "pt-br",
    page: 1,
  };

  const mainProps: MainProps = {
    input,
    lastPage: 10,
  };

  const handleGenerateLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mainProps),
      });
      const data: Output | any = await res.json();
      if ((!res.ok || !data.isValid)) {
        console.error("Erro ao gerar leads:", data.error);
      }
      console.log("Leads generated successfully:", data);
      setSearchLeads(data.result.leads);
    } catch (err) {
      // Trate o erro
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (searchLeads) {
      GenerateCsvContent(searchLeads);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Gerador de leads
            </h1>
            <ModeToggle />
          </div>
          <p className="text-muted-foreground mt-4">
            Configure os parâmetros e gere sua lista de leads em segundos.
          </p>
        </header>

        <main className="grid grid-col-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2 flex flex-col gap-8">
            <Card className=" ">
              <CardHeader className="flex items-center space-x-2">
                <MapPinIcon />
                <CardTitle>Defina sua busca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>País</Label>
                  <LocationInput
                    placeholder="Ex: Brazil"
                    onLocationSelect={(location) => {
                      setCountry(location.canonicalName ?? "");
                      setCountryCode(location.countryCode ?? "");
                    }}
                    initialValue={country}
                    filterType="Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <LocationInput
                    placeholder="Ex: Sao Paulo"
                    onLocationSelect={(location) => {
                      setLocation(location.canonicalName ?? "");
                      setCountryCode(location.countryCode ?? "");
                    }}
                    initialValue={location}
                    filterType="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Lead</Label>
                  <Input
                    placeholder="Ex: Pizzaria"
                    value={leadType}
                    onChange={(e) => setLeadType(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="hover:cursor-pointer font-semibold hover:bg-primary/80 w-[100%]"
                  onClick={async () => {
                    // TODO: Implementar o handler que faz a requisição para gerar os leads
                    await handleGenerateLeads();
                  }}
                  disabled={isGenerateDisabled || isLoading}
                >
                  <SearchIcon />
                  Gerar Leads
                </Button>
              </CardFooter>
            </Card>

            {/* TODO: Implementar a configuração da mensagem */}
            {/* <Card>
              <CardHeader className="flex items-center space-x-2">
                <MessageCircleMoreIcon />
                <CardTitle>Configure a Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Switch
                    className="hover:cursor-pointer"
                    checked={isWhatsAppEnabled}
                    onCheckedChange={setIsWhatsAppEnabled}
                    disabled
                  />
                  <Label className="">
                    Disparar para o
                    <span className="font-semibold transition-all duration-200 hover:underline hover:text-primary-foreground decoration-primary hover:underline-offset-4">
                      WhatsApp
                    </span>
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea
                    placeholder="Digite a mensagem que será enviada para os leads!"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    className="h-60"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="hover:cursor-pointer font-semibold hover:bg-primary/80"
                  onClick={async () => {
                    // TODO: Implementar o handler que faz a requisição para gerar os leads
                    await handleGenerateLeads();
                  }}
                  disabled={isGenerateDisabled || isLoading}
                >
                  <SearchIcon />
                  Gerar Leads
                </Button>
              </CardFooter>
            </Card> */}
          </section>

          <section className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileCheck2Icon />
                  <CardTitle>Resultados</CardTitle>
                </div>
                <Button
                  variant="secondary"
                  className="hover:cursor-pointer hover:bg-primary/80 font-semibold"
                  onClick={handleDownloadCsv}
                  disabled={!searchLeads || isLoading}
                >
                  <DownloadIcon />
                  Baixar CSV
                </Button>

                {/* TODO: Implementar Upload de CSV */}
                {/* <Button
                  variant="secondary"
                  className="hover:cursor-pointer font-semibold"
                  // onClick={handleImportCsvClick}
                >
                  Importar CSV
                </Button>
                <input
                  type="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  // ref={fileInputRef}
                  style={{ display: "none" }}
                  // onChange={handleFileChange}
                /> */}
              </CardHeader>

              {searchLeads ? (
                <CardContent>
                  <LeadsTable leads={searchLeads} />
                </CardContent>
              ) : (
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <Loader className="animate-spin h-12 w-12" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground p-4">
                      <BotMessageSquare
                        size={48}
                        className="mb-4 text-gray-400"
                      />
                      <h3 className="text-lg font-semibold mb-2">
                        Aguardando geração
                      </h3>
                      <p className="max-w-xs">
                        Os leads encontrados aparecerão aqui após você clicar em
                        "Gerar Leads".
                      </p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
