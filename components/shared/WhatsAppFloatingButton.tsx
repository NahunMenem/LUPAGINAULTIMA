"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/lib/site";

export default function WhatsAppFloatingButton() {
  const href = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={[
        "fixed bottom-5 right-5 z-50",
        "group inline-flex h-12 w-12 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lg",
        "transition-transform duration-200",
        "hover:scale-105 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40",
      ].join(" ")}
    >
      {/* Latido permanente */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 rounded-full
          bg-[#25D366]/40
          animate-[ping_2.2s_cubic-bezier(0.22,1,0.36,1)_infinite]
        "
      />

      {/* Glow suave */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute -inset-2 rounded-full
          bg-[#25D366]/20 blur-xl
          opacity-0 transition-opacity duration-200
          group-hover:opacity-100
        "
      />

      <FaWhatsapp className="relative h-6 w-6" />
    </Link>
  );
}
