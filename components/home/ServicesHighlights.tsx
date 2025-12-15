"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Eye,
  Brush,
  Wand2,
  ChevronRight,
  Calendar,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/shared/SectionTitle";

type Service = {
  title: string;
  items: string[];
  Icon: React.ElementType;
};

const SERVICES: Service[] = [
  {
    title: "Micropigmentación",
    items: ["Cejas", "Labios", "Delineado permanente"],
    Icon: Wand2,
  },
  {
    title: "Pestañas",
    items: [
      "Clásicas",
      "Volumen",
      "Tecnológicas",
      "Mega volumen",
      "Lifting coreano + botox",
    ],
    Icon: Eye,
  },
  {
    title: "Cejas",
    items: ["Perfilado / Diseño", "Laminado", "Henna"],
    Icon: Brush,
  },
  {
    title: "Faciales",
    items: [
      "Dermaplaning + limpieza",
      "Limpieza profunda",
      "Peeling enzimático",
      "Microneedling",
    ],
    Icon: Sparkles,
  },
];

export default function ServicesHighlights() {
  return (
    <section className="container-page py-14 font-(family-name:--font-poppins) md:py-16">
      <SectionTitle
        eyebrow="SERVICIOS"
        title="Todo lo que hacemos, con detalle y estilo"
        subtitle="Elegí tu servicio y reservá turno."
      />

      {/* ✅ auto-rows-fr + h-full => todas las cards quedan iguales */}
      <div className="mt-10 grid auto-rows-fr gap-6 md:grid-cols-2">
        {SERVICES.map((s, idx) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
            className="h-full"
          >
            <Card
              className="
                group relative h-full overflow-hidden rounded-3xl
                border-border/70 bg-card/60 backdrop-blur
                transition
                hover:-translate-y-0.5 hover:shadow-lg
              "
            >
              {/* Glow suave al hover */}
              <div
                className="
                  pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full opacity-0 blur-2xl
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklch, oklch(0.78 0.11 350) 30%, transparent), transparent 60%)",
                }}
              />

              <CardContent className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold tracking-tight">
                      {s.title}
                    </h3>

                    <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      {s.items.map((it) => (
                        <li key={it} className="flex items-center gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/80" />
                          <span className="truncate">{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ✅ zona marcada en azul: ícono/logo */}
                  <div
                    className="
                      relative grid h-12 w-12 place-items-center
                      rounded-2xl border border-border/60
                      bg-(--brand-pink-soft)
                      shadow-sm
                    "
                  >
                    <s.Icon className="h-5 w-5 text-foreground/80" />
                    {/* brillo diagonal */}
                    <div
                      className="
                        pointer-events-none absolute inset-0
                        rounded-2xl opacity-0 transition-opacity duration-300
                        group-hover:opacity-100
                      "
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.18), transparent 55%)",
                      }}
                    />
                  </div>
                </div>

                {/* Empuja los botones al fondo para mantener simetría */}
                <div className="mt-auto pt-7">
                  <div className="flex flex-wrap gap-2">
                    <Button asChild className="rounded-full">
                      <Link href="/turnos">
                        <Calendar className="mr-2 h-4 w-4" />
                        Reservar
                      </Link>
                    </Button>

                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/servicios" className="flex items-center">
                        Ver más
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
