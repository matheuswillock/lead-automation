import { Geist, Geist_Mono } from "next/font/google";
import "../app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TheLeadsFy - Geração de Leads B2B Simplificada",
    template: "%s | TheLeadsFy"
  },
  description: "Plataforma SaaS de geração de leads B2B através de busca geográfica inteligente. Encontre leads certos, no lugar certo. Extração rápida, dados completos, exportação instantânea.",
  keywords: ["leads", "b2b", "geração de leads", "prospecção", "vendas", "marketing", "automação", "pix", "brasil"],
  authors: [{ name: "TheLeadsFy Team" }],
  creator: "TheLeadsFy",
  publisher: "TheLeadsFy",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    title: "TheLeadsFy - Leadify your business",
    description: "Geração de leads B2B simplificada. Encontre leads certos, no lugar certo. Busca geográfica inteligente com dados em tempo real.",
    siteName: "TheLeadsFy",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TheLeadsFy - Geração de Leads B2B",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TheLeadsFy - Leadify your business",
    description: "Geração de leads B2B simplificada através de busca geográfica inteligente",
    images: ["/og-image.png"],
    creator: "@theleadsfy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
