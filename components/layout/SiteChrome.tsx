// components/layout/SiteChrome.tsx
"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppFloatingButton from "@/components/shared/WhatsAppFloatingButton";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}

      <main className="min-h-screen">{children}</main>

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloatingButton />}
      {!isAdmin && <ScrollToTopButton />}
    </>
  );
}
