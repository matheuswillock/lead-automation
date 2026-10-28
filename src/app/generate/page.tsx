"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { BotMessageSquare, Loader, Search, AlertCircle, Crown, SlidersHorizontal } from "lucide-react";
import { DownloadIcon } from "@/components/ui/download";
import { FileCheck2Icon } from "@/components/ui/file-check-2";
import { MapPinIcon } from "@/components/ui/map-pin";
import { MainProps } from "@/app/api/useCases/generateLeads";
import { InputSerper, MAX_SERPER_PAGES } from "@/services/SerperService/Serper";
import { GenerateCsvContent } from "@/services/CsvService/CsvCore";
import { Output } from "@/domain/Output";
import OutputSearchLead from "@/domain/Dto/OutputSearchLead";
import LeadsTable from "@/components/leads-table";
import Link from "next/link";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { useOnboarding } from "@/hooks/useOnboarding";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { NavUser } from '../../components/nav-user';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchFilters } from "@/components/search-filters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  
  // Hook de onboarding
  const { 
    data,
    loading: onboardingLoading, 
    error: onboardingError,
    hasActiveSubscription,
    isNewUser,
    refreshProfile
  } = useOnboarding(user);

  // Redirecionar para checkout se subscription está PENDING
  useEffect(() => {
    if (data?.subscription && data.subscription.status === 'PENDING') {
      router.push('/checkout');
    }
  }, [data, router]);

  const [countryCode, setCountryCode] = useState<string>("br");
  const [location, setLocation] = useState<string>("");
  const [leadType, setLeadType] = useState<string>("");
  const [pagesToFetch, setPagesToFetch] = useState<number>(1);
  const [searchLeads, setSearchLeads] = useState<OutputSearchLead | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);



  // Verificar autenticação
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkAuth();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Verificar se veio do checkout (pagamento recente)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromCheckout = urlParams.get('from_checkout');
    
    if (fromCheckout === 'true' && hasActiveSubscription) {
      setShowSuccessBanner(true);
      
      // Esconder o banner após 10 segundos
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
        // Limpar o parâmetro da URL
        window.history.replaceState({}, '', window.location.pathname);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [hasActiveSubscription]);

  const isGenerateDisabled =
  !location ||
  !leadType ||
  !/^[a-z]{2}$/i.test(countryCode) ||
  location.trim().length <= 3 ||
  leadType.trim().length <= 3 ||
  !Number.isInteger(pagesToFetch) ||
  pagesToFetch < 1 ||
  pagesToFetch > MAX_SERPER_PAGES ||
  !hasActiveSubscription ||
  onboardingLoading;

  const input: InputSerper = {
    query: leadType,
    location: location,
    country: countryCode.toLocaleLowerCase(),
    language: "pt-br",
    page: 1,
  };

  const mainProps: MainProps = {
    input,
    lastPage: pagesToFetch,
  };

  const handleGenerateLeads = async () => {
    // Verificar se tem assinatura ativa
    if (!hasActiveSubscription) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mainProps),
      });
      const data: Output | any = await res.json();
      if (!res.ok || !data?.isValid || !data.result?.leads) {
        console.error("Erro ao gerar leads:", data?.errorMessages ?? data?.error);
        setSearchLeads(null);
        return;
      }
      setSearchLeads(data.result.leads);
    } catch (err) {
      console.error("Erro ao gerar leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (searchLeads) {
      GenerateCsvContent(searchLeads);
    }
  };

  const handleCountryChange = (nextCountryCode: string) => {
    setCountryCode(nextCountryCode);
    setLocation("");
  };

  const searchFiltersProps = {
    countryCode,
    location,
    leadType,
    pagesToFetch,
    maxPages: MAX_SERPER_PAGES,
    isLoading,
    isOnboardingLoading: onboardingLoading,
    hasActiveSubscription,
    isGenerateDisabled,
    onCountryChange: handleCountryChange,
    onLocationChange: setLocation,
    onLeadTypeChange: setLeadType,
    onPagesChange: setPagesToFetch,
    onGenerate: handleGenerateLeads,
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      {/* Header Fixo */}
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">TheLeadsFy</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-2">
            <NavUser
              user={
                user
                  ? {
                      name:
                        user.user_metadata?.full_name ||
                        user.email?.split("@")[0] ||
                        "Usuário",
                      email: user.email || "",
                      avatar: user.user_metadata?.avatar_url || "",
                    }
                  : null
              }
              onAvatarUpdate={async () => {
                // Recarregar dados do usuário após atualização do avatar
                const { data: { user: updatedUser } } = await supabase.auth.getUser()
                setUser(updatedUser)
              }}
            />
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-80 flex-col border-r bg-card/70 px-6 py-7 backdrop-blur lg:flex xl:w-96">
        <div className="mb-7 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MapPinIcon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Nova busca</p>
            <h2 className="font-semibold">Defina sua busca</h2>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <SearchFilters idPrefix="desktop" {...searchFiltersProps} />
        </div>
      </aside>

      <div className="px-4 pb-10 pt-24 sm:px-6 lg:ml-80 lg:h-dvh lg:overflow-hidden lg:px-8 lg:pb-6 lg:pt-20 xl:ml-96">
        <div className="mx-auto max-w-7xl lg:flex lg:h-full lg:flex-col">
          {/* Alertas de Status */}
          
          {/* Erro de onboarding */}
          {onboardingError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{onboardingError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Usuário não autenticado */}
          {!user && !onboardingLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Faça login para continuar</AlertTitle>
                <AlertDescription>
                  Você precisa estar autenticado para gerar leads.
                  <Link href="/" className="ml-2 underline font-medium">
                    Voltar para a página inicial
                  </Link>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Assinatura inativa ou expirada */}
          {user && !hasActiveSubscription && !onboardingLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <Crown className="h-4 w-4" />
                <AlertTitle>Assinatura expirada ou inativa</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>
                    Sua assinatura não está ativa. Renove para continuar gerando
                    leads por apenas R$ 19,90/mês.
                  </span>
                  <Button variant="default" size="sm" className="ml-4" asChild>
                    <Link href="/checkout">Renovar agora</Link>
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Sucesso: Assinatura recém ativada (vindo do checkout) */}
          {user && hasActiveSubscription && showSuccessBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30">
                <Crown className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-200">
                  🎉 Assinatura ativada com sucesso!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Bem-vindo ao TheLeadsFy! Sua assinatura Professional está ativa até{" "}
                  {data?.subscription?.currentPeriodEnd && 
                    new Date(data.subscription.currentPeriodEnd).toLocaleDateString("pt-BR")
                  }. Comece a gerar seus leads agora mesmo!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Título e filtros de busca no mobile */}
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gerador de <span className="text-primary">leads</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure os parâmetros e gere sua lista de leads em segundos.
            </p>
          </div>

          <div className="mb-5 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" className="w-full justify-center gap-2">
                  <SlidersHorizontal className="size-4" />
                  Filtros da busca
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filtros da busca</SheetTitle>
                </SheetHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
                  <SearchFilters idPrefix="mobile" {...searchFiltersProps} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <main className="min-h-0 lg:flex lg:flex-1">
            <section className="min-h-0 w-full lg:flex lg:flex-1">
              <Card className="w-full border-2 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                <CardHeader className="shrink-0 flex flex-row items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck2Icon />
                    <CardTitle>Resultados</CardTitle>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  <CardContent className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden">
                    <LeadsTable leads={searchLeads} />
                  </CardContent>
                ) : (
                  <CardContent>
                    {isLoading ? (
                      <div className="flex items-center justify-center h-96">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Loader className="h-12 w-12 text-primary" />
                        </motion.div>
                      </div>
                    ) : (
                      <div className="flex h-96 flex-col items-center justify-center p-4 text-center text-muted-foreground">
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
                          Os leads encontrados aparecerão aqui após você clicar
                          em "Gerar Leads".
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
    </div>
  );
}
