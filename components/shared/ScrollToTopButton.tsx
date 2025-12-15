"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    const onResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsShort(window.innerHeight <= 760);
    };

    onScroll();
    onResize();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const bottomOffset = isMobile
    ? `max(${isShort ? "9.5rem" : "8.5rem"}, calc(env(safe-area-inset-bottom) + ${
        isShort ? "9.5rem" : "8.5rem"
      }))`
    : "max(5rem, calc(env(safe-area-inset-bottom) + 5rem))";

  return (
    <button
      onClick={() => {
        try {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch {
          window.scrollTo(0, 0);
        }
      }}
      aria-label="Subir arriba"
      title="Subir arriba"
      className={[
        "fixed z-52 right-4 md:right-5",
        "flex h-11 w-11 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-xl hover:brightness-105",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 pointer-events-none translate-y-2",
      ].join(" ")}
      style={{ bottom: bottomOffset }}
    >
      {/* Glow rosado suave */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 rounded-full
          bg-(--brand-pink-soft)
          opacity-0 blur-md
          transition-opacity duration-200
          group-hover:opacity-60
        "
      />

      <ArrowUp className="relative h-5 w-5" />
    </button>
  );
}
