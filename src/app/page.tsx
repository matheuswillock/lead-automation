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
import Image from "next/image";
import { useState, useEffect } from "react";
import { Download, BotMessageSquare, Search, Sun, Moon } from "lucide-react";

export default function Home() {
  const [country, setCountry] = useState<string>("Brasil");
  const [location, setLocation] = useState<string>("Cajamar, SP");
  const [leadType, setLeadType] = useState<string>("Pizzaria");
  const [sendToWhatsApp, setSendToWhatsApp] = useState<boolean>(true);
  const [whatsappMessage, setWhatsappMessage] = useState<string>(
    `Olá! Tudo bem? 😊\n\nAqui é o Cheffia — uma solução moderna para gestão de pedidos e pagamentos em pizzarias!\n\nVocê consegue automatizar pedidos, integrar pagamentos via QR Code e muito mais.\n\nGostaria de saber mais? É só responder aqui. 🚀`
  );

  // const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  // TODO: Implementar a lógica de busca de leads usando o SerperService
  useEffect(() => {}, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // TODO: Imeplementar método para baixar o CVS no CsvCore
  // Função para baixar os leads como CSV
  // const handleDownloadCsv = () => {
  //   if (leads.length === 0) return;

  //   const headers = [
  //     "Nome do Estabelecimento",
  //     "Endereço",
  //     "Telefone",
  //     "Website",
  //   ];
  //   const csvContent = [
  //     headers.join(","),
  //     ...leads.map((lead) =>
  //       [lead.name, lead.address, lead.phone, lead.website].join(",")
  //     ),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  //   const link = document.createElement("a");
  //   if (link.href) {
  //     URL.revokeObjectURL(link.href);
  //   }
  //   const url = URL.createObjectURL(blob);
  //   link.href = url;
  //   link.setAttribute("download", "leads.csv");
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  return (
    <div className="min-h-screen w-full bg-background text-foreground font-sans p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Gerador de lads
            </h1>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Alternar tema"
              className="hover:cursor-pointer"
              onClick={() => setIsDark((prev) => !prev)}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>
          <p className="text-muted-foreground mt-4">
            Configure os parâmetros e gere sua lista de leads em segundos.
          </p>
        </header>

        <main className="grid grid-col-1 lg:grid-cols-5 gap-8">
          <section className="lg:col-span-2 flex flex-col gap-8">
            <Card className=" ">
              <CardHeader>
                <CardTitle>1. Defina sua busca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>País</Label>
                  <Input placeholder="Ex: Brazil"></Input>
                </div>
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input placeholder="Ex: Barueri"></Input>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Lead</Label>
                  <Input placeholder="Ex: Pizzaria"></Input>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Configure a Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch />
                  <Label className="ml-2">Disparar para o WhatsApp</Label>
                </div>
                <div className="space-y-2">
                  <Label>Mensagem</Label>
                  <Textarea placeholder="Digite a mensagem que será enviada para os leads!" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="hover:cursor-pointer">Gerar Leads</Button>
              </CardFooter>
            </Card>
          </section>

          <section className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>3. Resultados</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:cursor-pointer"
                >
                  <Download />
                  Baixar CSV
                </Button>
              </CardHeader>

              <CardContent>
                <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground p-4">
                  <BotMessageSquare size={48} className="mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">
                    Aguardando geração
                  </h3>
                  <p className="max-w-xs">
                    Os leads encontrados aparecerão aqui após você clicar em
                    "Gerar Leads".
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
