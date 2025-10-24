import { motion } from "motion/react";
import IconPlatform from "../IconPlatform";

export default function Footer() {
  return (
    <footer className="border-t py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <IconPlatform />
          <p className="text-muted-foreground mb-6">
            TheLeadsFy - Geração de leads B2B simplificada através de busca 
            geográfica inteligente. Leads certos, no lugar certo.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 TheLeadsFy. Todos os direitos reservados.</p>
            <p>
              Desenvolvido com 🧡 por{" "}
              <motion.a
                whileHover={{ scale: 1.05 }}
                href="https://github.com/matheuswillock"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                Willock's House
              </motion.a>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}