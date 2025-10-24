import { motion } from "motion/react";
import { Card } from "../ui/card";
import { Download, MapPin, Search, Users } from "lucide-react";

export default function Features() {
  return (
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
            Recursos que <span className="text-primary">transformam</span> seu negócio
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas essenciais para encontrar e conquistar os leads certos
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
              <h3 className="text-xl font-semibold mb-2">Busca Geográfica</h3>
              <p className="text-muted-foreground">
                Encontre leads por localização precisa. Cidade, bairro ou região - 
                você escolhe onde prospectar.
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
              <h3 className="text-xl font-semibold mb-2">
                Segmentação Inteligente
              </h3>
              <p className="text-muted-foreground">
                Filtre por tipo de negócio e encontre exatamente o perfil de cliente 
                que você precisa.
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
              <h3 className="text-xl font-semibold mb-2">Dados Completos</h3>
              <p className="text-muted-foreground">
                Nome, telefone, endereço, avaliações e horários de funcionamento. 
                Tudo que você precisa para contatar.
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
              <h3 className="text-xl font-semibold mb-2">Exportação Instantânea</h3>
              <p className="text-muted-foreground">
                Baixe seus leads em CSV/Excel com um clique. Pronto para usar 
                em qualquer ferramenta ou CRM.
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}