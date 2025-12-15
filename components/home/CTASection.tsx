"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  return (
    <section className="container-page pb-16 font-(family-name:--font-poppins)">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="relative overflow-hidden rounded-4xl border bg-(--hero-bg) p-8 md:p-10"
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 mask-[radial-gradient(white,transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-size-[56px_56px]" />
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-(--brand-pink-soft) blur-2xl"
          animate={{ y: [0, 10, 0], x: [0, 6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: easeOut }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-(--brand-pink-soft) blur-2xl"
          animate={{ y: [0, -10, 0], x: [0, -6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: easeOut }}
        />

        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              ⭐ 4.9 promedio
            </span>
            <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              +150 clientas felices
            </span>
            <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              Atención personalizada
            </span>
          </div>

          <h3 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
            ¿Lista para tu próximo cambio?
          </h3>

          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Reservá tu turno y elegimos juntas la mejor opción para vos. Resultados
            prolijos, naturales y con detalle.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="rounded-full px-6 transition-transform hover:-translate-y-0.5"
            >
              <Link href="/turnos">Reservar turno</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 transition-transform hover:-translate-y-0.5"
            >
              <Link href="/servicios">Ver servicios</Link>
            </Button>
          </div>

          <div className="mt-6 text-xs text-muted-foreground">
            Respondemos rápido por WhatsApp • Cupos limitados según agenda
          </div>
        </div>
      </motion.div>
    </section>
  );
}
