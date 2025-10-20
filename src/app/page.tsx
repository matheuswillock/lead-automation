"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/modeToggle";
import { Search, MapPin, Users, BarChart3, Zap, CheckCircle2, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Lead Flow</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-primary transition-colors">Recursos</a>
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">Como Funciona</a>
            <a href="#pricing" className="text-sm hover:text-primary transition-colors">Preços</a>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/generate">
              <Button>Entrar</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm">Geração de leads automatizada</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Encontre leads qualificados em{" "}
                <span className="text-primary">segundos</span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Automatize sua prospecção com nossa plataforma inteligente. 
                Busque empresas por localização, segmento e gere listas completas 
                com dados de contato verificados.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/generate">
                  <Button size="lg" className="w-full sm:w-auto">
                    Começar Agora
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver Demonstração
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Leads gerados</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Empresas ativas</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfação</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl"></div>
              <Card className="relative p-8 backdrop-blur">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <MapPin className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Busca por Localização</div>
                      <div className="text-sm text-muted-foreground">São Paulo, Brasil</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <Search className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Tipo de Negócio</div>
                      <div className="text-sm text-muted-foreground">Restaurantes, Cafés</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/10">
                    <Download className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Exportar Dados</div>
                      <div className="text-sm text-muted-foreground">150 leads encontrados</div>
                    </div>
                    <div className="text-2xl font-bold text-primary">✓</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recursos <span className="text-primary">poderosos</span> para sua equipe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para encontrar, gerenciar e converter leads em clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Busca Inteligente</h3>
              <p className="text-muted-foreground">
                Encontre empresas por localização, tipo de negócio e outros critérios personalizados.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Geolocalização</h3>
              <p className="text-muted-foreground">
                Busque leads em qualquer cidade ou região do Brasil com precisão.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dados Verificados</h3>
              <p className="text-muted-foreground">
                Informações atualizadas com telefone, endereço e horários de funcionamento.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exportação Fácil</h3>
              <p className="text-muted-foreground">
                Exporte seus leads em CSV ou Excel com um clique para usar em qualquer CRM.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics Completo</h3>
              <p className="text-muted-foreground">
                Acompanhe métricas de performance e otimize sua estratégia de prospecção.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automação Inteligente</h3>
              <p className="text-muted-foreground">
                Integre com WhatsApp e automatize o primeiro contato com seus leads.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como funciona o <span className="text-primary">Lead Flow</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e direto para transformar buscas em leads qualificados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Defina o Alvo</h3>
              <p className="text-muted-foreground">
                Escolha a localização e o tipo de negócio que você quer prospectar.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Busque Leads</h3>
              <p className="text-muted-foreground">
                Nossa IA busca e organiza milhares de leads qualificados automaticamente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Revise os Dados</h3>
              <p className="text-muted-foreground">
                Visualize e filtre os leads encontrados com todas as informações relevantes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Exporte e Venda</h3>
              <p className="text-muted-foreground">
                Baixe sua lista e comece a prospectar com dados atualizados e verificados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preços <span className="text-primary">simples</span> e transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente. Pague apenas pelo que usar, sem surpresas.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 border-2 border-primary">
              <div className="text-center mb-8">
                <div className="inline-flex px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4">
                  Plano Único
                </div>
                <h3 className="text-3xl font-bold mb-4">Lead Flow Professional</h3>
                <p className="text-muted-foreground mb-6">
                  Tudo que você precisa para gerenciar seu time de vendas
                </p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div>
                    <div className="text-sm text-muted-foreground">Assinatura Base</div>
                    <div className="text-4xl font-bold text-primary">R$ 59,90<span className="text-lg">/mês</span></div>
                  </div>
                  <div className="text-2xl text-muted-foreground">+</div>
                  <div>
                    <div className="text-sm text-muted-foreground">Por Operador</div>
                    <div className="text-4xl font-bold text-primary">R$ 19,90<span className="text-lg">/mês</span></div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-8">
                  Valor fixo mensal para acesso à plataforma + operadores adicionais
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Leads ilimitados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Dashboard com analytics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Gestão de operadores</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Suporte via email</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Pipeline Kanban completo</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Automações inteligentes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Relatórios personalizados</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Atualizações automáticas</span>
                  </div>
                </div>
              </div>

              <Button size="lg" className="w-full">
                Começar Agora
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Sem contratos de fidelidade • Cancele quando quiser
              </p>
            </Card>

            <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold mb-4">Exemplo de cálculo:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assinatura base</span>
                  <span className="font-semibold">R$ 59,90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">3 operadores × R$ 19,90</span>
                  <span className="font-semibold">R$ 59,70</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base">
                  <span className="font-semibold">Total mensal</span>
                  <span className="font-bold text-primary">R$ 119,60</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Escale sua equipe sem limites de leads. Adicione ou remova operadores a qualquer momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para acelerar suas vendas?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de empresas que já automatizaram sua prospecção com o Lead Flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg">
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Falar com Vendas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">Lead Flow</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Plataforma de automação de prospecção e gestão de leads para equipes de vendas modernas.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>© 2025 Lead Flow. Todos os direitos reservados.</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">
                Desenvolvido com 🧡 por
              </p>
              <a 
                href="https://github.com/matheuswillock" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-lg"
              >
                Willock's House
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
