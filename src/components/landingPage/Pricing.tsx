import { motion } from "motion/react";
import { Card } from "../ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Pricing() {
  return (
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
            Apenas R$ 19,90/mês para extração ilimitada de leads em todo o
            mundo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" }}
          >
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
                <h3 className="text-3xl font-bold mb-4">
                  Lead Generator Professional
                </h3>
                <p className="text-muted-foreground mb-6">
                  Extração e geração de leads rápida e consistente
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
                    "Busca inteligente com filtros avançados",
                    "Geolocalização global (qualquer país)",
                    "Dados verificados e atualizados",
                    "Exportação fácil em CSV/Excel",
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
                    "Extração ilimitada de leads",
                    "Telefone e endereço completo",
                    "Horários de funcionamento",
                    "Suporte via email",
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/register">
                  <Button size="lg" className="w-full cursor-pointer">
                    Assinar Agora
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
  );
}