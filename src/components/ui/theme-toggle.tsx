"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
// import { SunIcon } from "./ui/sun";
// import { MoonIcon } from "./ui/moon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="outline"
      onClick={toggle}
      aria-label="Alternar tema"
      className="relative h-8 w-8 p-0 cursor-pointer transition-colors hover:bg-muted dark:hover:bg-muted"
      title={resolvedTheme === "dark" ? "Claro" : "Escuro"}
    >
      <MoonIcon className="h-4 w-4 rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
      <SunIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-300 ease-in-out  dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
