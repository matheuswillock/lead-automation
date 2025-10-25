import { motion } from "motion/react";
import Link from "next/dist/client/link";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";

export default function Header() {
  return (
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
          <span className="text-xl font-bold">TheLeadsFy</span>
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
          <Link href="/auth">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="cursor-pointer">Entrar</Button>
            </motion.div>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}