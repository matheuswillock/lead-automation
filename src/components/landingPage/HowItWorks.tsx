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
            Como funciona o <span className="text-primary">TheLeadsFy</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Processo simples e rápido para encontrar leads qualificados. 
            Do seu mapa de oportunidades ao fechamento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              number: 1,
              title: "Defina sua Busca",
              description:
                "Escolha localização e tipo de negócio. Foque no seu mercado ideal.",
            },
            {
              number: 2,
              title: "Gere os Leads",
              description:
                "Nossa plataforma busca e extrai leads em tempo real com dados completos.",
            },
            {
              number: 3,
              title: "Revise e Filtre",
              description:
                "Visualize resultados com telefone, endereço e todas as informações necessárias.",
            },
            {
              number: 4,
              title: "Exporte e Venda",
              description:
                "Baixe em CSV/Excel e comece a prospectar. Find leads, close deals.",
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