import { motion } from "motion/react";

export default function HowItWorks() {
  return (
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
            Como funciona o <span className="text-primary">Lead Generator</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um processo simples e rápido para extrair leads qualificados de
            qualquer lugar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              number: 1,
              title: "Defina sua Busca",
              description:
                "Escolha o país, estado, cidade e tipo de negócio que você quer extrair.",
            },
            {
              number: 2,
              title: "Extraia os Leads",
              description:
                "Nossa plataforma gera e extrai milhares de leads de forma rápida e consistente.",
            },
            {
              number: 3,
              title: "Revise os Dados",
              description:
                "Visualize e filtre os leads extraídos com todas as informações verificadas.",
            },
            {
              number: 4,
              title: "Exporte e Use",
              description:
                "Baixe sua lista e comece a prospectar com dados atualizados do mundo todo.",
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
  );
}