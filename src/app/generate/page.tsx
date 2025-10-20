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
import { BotMessageSquare, Loader, Search } from "lucide-react";
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
import Link from "next/link";
import { motion } from "motion/react";

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
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Header Fixo */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Lead Generator</span>
            </motion.div>
          </Link>

          <ModeToggle />
        </nav>
      </motion.header>

      {/* Conteúdo Principal */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Título da Página */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gerador de <span className="text-primary">leads</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure os parâmetros e gere sua lista de leads em segundos.
            </p>
          </motion.div>

          <main className="grid grid-col-1 lg:grid-cols-5 gap-8">
            {/* Seção de Configuração */}
            <motion.section
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 flex flex-col gap-8"
            >
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="flex items-center space-x-2">
                  <MapPinIcon />
                  <CardTitle>Defina sua busca</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>País</Label>
                    <LocationInput
                      placeholder="Select location..."
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
                      placeholder="Select location..."
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      className="cursor-pointer font-semibold w-full"
                      onClick={async () => {
                        await handleGenerateLeads();
                      }}
                      disabled={isGenerateDisabled || isLoading}
                    >
                      <SearchIcon />
                      Gerar Leads
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </motion.section>

            {/* Seção de Resultados */}
            <motion.section
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="h-full border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck2Icon />
                    <CardTitle>Resultados</CardTitle>
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary/80 font-semibold"
                      onClick={handleDownloadCsv}
                      disabled={!searchLeads || isLoading}
                    >
                      <DownloadIcon />
                      Baixar CSV
                    </Button>
                  </motion.div>
                </CardHeader>

                {searchLeads ? (
                  <CardContent>
                    <LeadsTable leads={searchLeads} />
                  </CardContent>
                ) : (
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-96">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Loader className="h-12 w-12 text-primary" />
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground p-4"
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <BotMessageSquare
                            size={48}
                            className="mb-4 text-primary"
                          />
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2">
                          Aguardando geração
                        </h3>
                        <p className="max-w-xs">
                          Os leads encontrados aparecerão aqui após você clicar em
                          "Gerar Leads".
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                )}
              </Card>
            </motion.section>
          </main>
        </div>
      </div>
    </div>
  );
}
