//app/layout.tsx

import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "next-themes";
import SiteChrome from "@/components/layout/SiteChrome";

import { Toaster } from "react-hot-toast";

import { Playfair_Display, Pinyon_Script, Poppins } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-playfair",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${playfair.variable} ${pinyon.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Toaster global (para todo el sitio, incluido admin) */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
            }}
          />

          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
