"use client";

import { motion } from "framer-motion";
import {
  FaHandsHelping,
  FaCog,
  FaShieldAlt,
} from "react-icons/fa";

import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/shared/SectionTitle";

const BENEFITS = [
  {
    title: "Asesoramiento real",
    desc: "Te recomendamos lo que mejor te queda según tu rostro.",
    Icon: FaHandsHelping,
  },
  {
    title: "Técnica y precisión",
    desc: "Trabajo fino, simétrico y cuidado.",
    Icon: FaCog,
  },
  {
    title: "Higiene y seguridad",
    desc: "Protocolos de limpieza y materiales adecuados.",
    Icon: FaShieldAlt,
  },
];

export default function Benefits() {
  return (
    <section className="container-page py-14 font-(family-name:--font-poppins) md:py-16">
      <SectionTitle
        eyebrow="POR QUÉ ELEGIRNOS"
        title="Detalles que marcan la diferencia"
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {BENEFITS.map((b, idx) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.45,
              ease: "easeOut",
              delay: idx * 0.08,
            }}
          >
            <Card
              className="
                group relative h-full overflow-hidden rounded-3xl
                border-border/70 bg-card/60 backdrop-blur
                transition
                hover:-translate-y-0.5 hover:shadow-lg
              "
            >
              <CardContent className="p-7">
                {/* ICONO */}
                <div
                  className="
                    mb-4 flex h-12 w-12 items-center justify-center
                    rounded-2xl
                    bg-(--brand-pink-soft)
                  "
                >
                  <b.Icon className="text-lg text-foreground/80" />
                </div>

                <h3 className="text-base font-semibold tracking-tight">
                  {b.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

