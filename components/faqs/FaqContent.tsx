"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FAQS, FAQ_CATEGORIES, type FaqItem } from "@/components/faqs/faqs-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function FaqContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FaqItem["category"] | "Todas">("Todas");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return FAQS.filter((f) => {
      const inCategory = category === "Todas" ? true : f.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return `${f.q} ${f.a} ${f.category}`.toLowerCase().includes(q);
    });
  }, [query, category]);

  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_.8fr] font-(family-name:--font-poppins)">
      <div>
        <div className="rounded-4xl border bg-background/60 p-4 backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs tracking-widest text-muted-foreground">BUSCÁ TU DUDA</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Escribí una palabra clave (ej: “retoque”, “duración”, “cuidados”).
              </p>
            </div>

            <div className="w-full md:max-w-sm">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en FAQs…"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant={category === "Todas" ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setCategory("Todas")}
            >
              Todas
            </Button>

            {FAQ_CATEGORIES.map((c) => (
              <Button
                key={c}
                type="button"
                variant={category === c ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setCategory(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-4xl border bg-(--hero-bg) p-2">
          <Accordion type="single" collapsible className="w-full">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-sm text-muted-foreground">
                No encontramos resultados. Probá con otra palabra o cambiá la categoría.
              </div>
            ) : (
              filtered.map((f) => (
                <AccordionItem key={f.id} value={f.id} className="px-2">
                  <AccordionTrigger className="text-left">
                    <span className="text-sm font-medium">{f.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-4xl border bg-background/60 backdrop-blur">
          <CardContent className="p-6">
            <p className="text-xs tracking-widest text-muted-foreground">GUÍA RÁPIDA</p>
            <h3 className="mt-2 text-lg font-semibold">Para reservar sin vueltas</h3>

            <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>1) Elegí el servicio que querés.</li>
              <li>2) Decinos tu fecha/horario preferido.</li>
              <li>3) Te confirmamos disponibilidad y duración estimada.</li>
              <li>4) Te mandamos recomendaciones previas (si aplica).</li>
            </ol>

            <div className="mt-5 grid gap-3">
              <Button asChild className="rounded-full">
                <Link href="/turnos">Ir a Turnos</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Consultar por WhatsApp
                </a>
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              WhatsApp suele ser lo más rápido para coordinar.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-4xl border bg-(--hero-bg)">
          <CardContent className="p-6">
            <p className="text-xs tracking-widest text-muted-foreground">ANTES / DESPUÉS</p>
            <h3 className="mt-2 text-lg font-semibold">Cuidados que mejoran el resultado</h3>

            <div className="mt-4 grid gap-4">
              <div className="rounded-3xl border bg-background/50 p-4">
                <p className="text-sm font-semibold">Antes</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Vení sin apuro (para trabajar cómodo y prolijo).</li>
                  <li>• Si usás productos específicos, comentanos.</li>
                  <li>• Traé una referencia del estilo que te gusta.</li>
                </ul>
              </div>

              <div className="rounded-3xl border bg-background/50 p-4">
                <p className="text-sm font-semibold">Después</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Evitá irritar la zona y seguí las indicaciones.</li>
                  <li>• No frotes ni uses productos agresivos.</li>
                  <li>• Si hay retoque, coordinamos fecha ideal.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 text-xs text-muted-foreground">
              Te damos instrucciones específicas según el tratamiento.
            </div>
          </CardContent>
        </Card>

        <div className="rounded-4xl border bg-background/60 p-6 backdrop-blur">
          <p className="text-sm font-semibold">¿No encontraste tu duda?</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Escribinos y te respondemos rápido. Preferimos WhatsApp para coordinar en el momento.
          </p>

          <div className="mt-4 grid gap-3">
            <Button asChild className="rounded-full">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Hablar por WhatsApp
              </a>
            </Button>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/servicios">Ver Servicios</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
