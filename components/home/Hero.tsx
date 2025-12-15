"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
    },
  },
};

export default function Hero() {
  return (
    <section className="relative overflow-hidden font-(family-name:--font-poppins)">
      <div className="glow" />

      <div className="md:soft-grid">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="container-page relative z-10 grid gap-12 py-16 md:grid-cols-2 md:py-20"
        >
          <div className="flex flex-col justify-center">
            <motion.div variants={item}>
              <Badge
                className="
                  w-fit
                  rounded-full
                  bg-(--brand-pink-soft)
                  text-foreground
                  font-medium
                  tracking-wide
                "
              >
                Estética premium • Resultados naturales
              </Badge>
            </motion.div>

            <motion.h1
              variants={item}
              className="
                mt-5
                max-w-xl
                text-4xl
                font-semibold
                leading-tight
                tracking-tight
                md:text-5xl
              "
            >
              Realzá tu belleza con un look{" "}
              <span className="text-primary">fino, prolijo y duradero</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-4 max-w-lg text-base text-muted-foreground"
            >
              Micropigmentación, pestañas, cejas y tratamientos faciales.
              Atención personalizada y enfoque 100% natural.
            </motion.p>

            <motion.div variants={item} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full px-6">
                <Link href="/turnos">Reservar turno</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full px-6">
                <Link href="/servicios">Ver servicios</Link>
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-10 grid grid-cols-3 gap-4">
              {[
                { k: "Higiene", v: "Protocolos cuidados" },
                { k: "Técnica", v: "Detalle & precisión" },
                { k: "Calidad", v: "Productos premium" },
              ].map((it) => (
                <div
                  key={it.k}
                  className="
                    rounded-2xl
                    border
                    bg-card/70
                    p-4
                    backdrop-blur
                    transition
                    hover:bg-card
                    hover:-translate-y-0.5
                    hover:shadow-sm
                  "
                >
                  <p className="text-sm font-semibold">{it.k}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{it.v}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div variants={item} className="relative">
            <div className="absolute inset-0 -z-10 rounded-4xl bg-(--hero-bg)" />

            <div
              className="
                relative
                mx-auto
                aspect-4/5
                w-full
                max-w-md
                overflow-hidden
                rounded-4xl
                border
                bg-card
                shadow-sm
                transition
                hover:shadow-md
              "
            >
              <Image
                src="/images/hero-placeholder.jpg"
                alt="Julieta Studio"
                fill
                className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
