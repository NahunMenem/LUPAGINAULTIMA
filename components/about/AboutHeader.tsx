"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const easeOut = [0.22, 1, 0.36, 1] as const;

export default function AboutHeader() {
  return (
    <section className="relative overflow-hidden rounded-4xl border bg-(--hero-bg) p-6 md:p-10 font-(family-name:--font-poppins)">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-(--brand-pink-soft) blur-2xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-(--brand-pink-soft) blur-2xl opacity-70" />

      <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.6, ease: easeOut }}
        >
          <p className="text-xs tracking-widest text-muted-foreground">SOBRE NOSOTROS</p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Un espacio pensado para que te sientas
            <span className="text-primary"> segura</span>, cómoda y feliz con tu resultado
          </h1>

          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Trabajamos con técnica, higiene y detalle. Nuestra prioridad es un resultado natural,
            prolijo y alineado a tu rostro.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full px-6 transition-transform hover:-translate-y-0.5">
              <Link href="/turnos">Reservar turno</Link>
            </Button>

            <Button asChild variant="outline" className="rounded-full px-6 transition-transform hover:-translate-y-0.5">
              <Link href="/servicios">Ver servicios</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Atención personalizada", "Higiene y protocolos", "Resultado natural"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-4xl border bg-background/40"
        >
          <Image
            src="/images/about-placeholder.jpg"
            alt="Sobre Julieta Studio"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 92vw, 420px"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.45),transparent_60%)]" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur">
              Julieta Studio • Estética & Beauty
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
