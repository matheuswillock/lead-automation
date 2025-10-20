"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/modeToggle";
import { Search, MapPin, Users, CheckCircle2, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Lead Flow</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#features"
              className="text-sm hover:text-primary transition-colors"
            >
              Recursos
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#how-it-works"
              className="text-sm hover:text-primary transition-colors"
            >
              Como Funciona
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1 }}
              href="#pricing"
              className="text-sm hover:text-primary transition-colors"
            >
              Preços
            </motion.a>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/generate">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button>Entrar</Button>
              </motion.div>
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </motion.div>
                <span className="text-sm">Geração de leads automatizada</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Encontre leads qualificados em{" "}
                <span className="text-primary">segundos</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-muted-foreground"
              >
                Automatize sua prospecção com nossa plataforma inteligente. 
                Busque empresas por localização, segmento e gere listas completas 
                com dados de contato verificados.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/generate" className="w-full sm:w-auto">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="w-full">
                      Começar Agora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-8 pt-4"
              >
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Leads gerados</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Empresas ativas</div>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Satisfação</div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl"
              />
              <Card className="relative p-8 backdrop-blur">
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <MapPin className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Busca por Localização</div>
                      <div className="text-sm text-muted-foreground">São Paulo, Brasil</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                  >
                    <Search className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Tipo de Negócio</div>
                      <div className="text-sm text-muted-foreground">Restaurantes, Cafés</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-lg bg-primary/10"
                  >
                    <Download className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Exportar Dados</div>
                      <div className="text-sm text-muted-foreground">150 leads encontrados</div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-2xl font-bold text-primary"
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Recursos <span className="text-primary">poderosos</span> para sua equipe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para encontrar, gerenciar e converter leads em clientes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Busca Inteligente</h3>
                <p className="text-muted-foreground">
                  Encontre empresas por localização, tipo de negócio e outros critérios personalizados.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Geolocalização</h3>
                <p className="text-muted-foreground">
                  Busque leads em qualquer país e cidade do mundo com precisão.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dados Verificados</h3>
                <p className="text-muted-foreground">
                  Informações atualizadas com telefone, endereço e horários de funcionamento.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Exportação Fácil</h3>
                <p className="text-muted-foreground">
                  Exporte seus leads em CSV ou Excel com um clique para usar em qualquer CRM.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Como funciona o <span className="text-primary">Lead Flow</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Um processo simples e direto para transformar buscas em leads qualificados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: 1,
                title: "Defina o Alvo",
                description: "Escolha a localização e o tipo de negócio que você quer prospectar.",
              },
              {
                number: 2,
                title: "Busque Leads",
                description: "Nossa IA busca e organiza milhares de leads qualificados automaticamente.",
              },
              {
                number: 3,
                title: "Revise os Dados",
                description: "Visualize e filtre os leads encontrados com todas as informações relevantes.",
              },
              {
                number: 4,
                title: "Exporte e Venda",
                description: "Baixe sua lista e comece a prospectar com dados atualizados e verificados.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  {step.number}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Preços <span className="text-primary">simples</span> e transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comece gratuitamente. Pague apenas pelo que usar, sem surpresas.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring" }}>
              <Card className="p-8 md:p-12 border-2 border-primary">
                <div className="text-center mb-8">
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="inline-flex px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold mb-4"
                  >
                    Plano Único
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-4">Lead Flow Professional</h3>
                  <p className="text-muted-foreground mb-6">
                    Tudo que você precisa para automatizar sua prospecção
                  </p>
                  
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="mb-6"
                  >
                    <div className="text-5xl font-bold text-primary">
                      R$ 19,90
                      <span className="text-2xl">/mês</span>
                    </div>
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    {[
                      "Leads ilimitados",
                      "Dashboard com analytics",
                      "Gestão de operadores",
                      "Suporte via email",
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      "Pipeline Kanban completo",
                      "Automações inteligentes",
                      "Relatórios personalizados",
                      "Atualizações automáticas",
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (index + 4) * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/generate">
                    <Button size="lg" className="w-full">
                      Começar Agora
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Sem contratos de fidelidade • Cancele quando quiser
                </p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
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
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-right"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Desenvolvido com 🧡 por
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://github.com/matheuswillock" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-lg"
              >
                Willock's House
              </motion.a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
