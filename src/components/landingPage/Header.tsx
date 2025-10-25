'use client'

import { motion } from "motion/react";
import Link from "next/dist/client/link";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Se já está logado, vai para /generate
      router.push('/generate');
    } else {
      // Se não está logado, vai para /auth
      router.push('/auth');
    }
  };

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
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleAuthClick}
          >
            <Button className="cursor-pointer">
              {isLoggedIn ? 'Ir para Plataforma' : 'Entrar'}
            </Button>
          </motion.div>
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}