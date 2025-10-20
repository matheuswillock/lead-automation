import { motion } from "motion/react";
import { Card } from "../ui/card";
import { ArrowRight, CheckCircle2, Download, MapPin, Search, Zap } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Hero()  {
  return (
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
                <Zap className="w-4 h-4 text-primary fill-primary" />
              </motion.div>
              <span className="text-sm">
                Extração global de leads • Qualquer país
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
            >
              Extraia leads qualificados de{" "}
              <span className="text-primary">qualquer lugar do mundo</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground"
            >
              Plataforma completa para geração e extração de leads de forma
              rápida e consistente. Busque empresas em qualquer país, estado e
              cidade, e gere listas completas com dados de contato verificados.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/generate" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="w-full cursor-pointer">
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
                <div className="text-sm text-muted-foreground">
                  Leads gerados
                </div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Empresas ativas
                </div>
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
                    <div className="text-sm text-muted-foreground">
                      São Paulo, Brasil
                    </div>
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
                    <div className="text-sm text-muted-foreground">
                      Restaurantes, Cafés
                    </div>
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
                    <div className="text-sm text-muted-foreground">
                      150 leads encontrados
                    </div>
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
  );
}