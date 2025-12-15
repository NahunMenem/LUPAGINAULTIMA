
import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/shared/WhatsAppFloatingButton";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";

import { ThemeProvider } from "next-themes";
import {
  Playfair_Display,
  Pinyon_Script,
  Poppins,
} from "next/font/google";

/* Serif elegante (opcional, textos editoriales) */
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

/* Script exacta del logo */
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

/* Sans moderna para UI / Nav */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Julieta Studio | Estética",
  description:
    "Micropigmentación, pestañas, cejas y tratamientos faciales. Reservá tu turno.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${pinyon.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <Navbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
          <WhatsAppFloatingButton />
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
