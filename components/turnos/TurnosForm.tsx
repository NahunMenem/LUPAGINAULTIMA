"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SERVICES = [
  "Micropigmentación (Cejas)",
  "Micropigmentación (Labios)",
  "Delineado permanente",
  "Extensiones (Clásicas)",
  "Extensiones (Volumen medio)",
  "Extensiones (Volumen)",
  "Mega volumen",
  "Lifting coreano + botox",
  "Brows (Perfilado / Diseño)",
  "Brows (Laminado)",
  "Brows (Henna)",
  "Facial (Limpieza profunda)",
  "Facial (Dermaplaning + limpieza)",
  "Facial (Peeling enzimático)",
  "Facial (Microneedling)",
];

export default function TurnosForm() {
  const [service, setService] = useState(SERVICES[0] ?? "");

  const helpText = useMemo(() => {
    return "Este formulario por ahora es visual. Después lo conectamos a Flask + Postgres para disponibilidad, estados y validaciones.";
  }, []);

  return (
    <Card className="rounded-3xl border bg-background/60 backdrop-blur">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            ✅ Confirmación por WhatsApp
          </span>
          <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            ⏱️ Respuesta rápida
          </span>
          <span className="inline-flex items-center rounded-full border bg-background/40 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            💗 Atención personalizada
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold tracking-tight md:text-xl">
          1) Contanos qué querés hacer
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Elegí el servicio y dejá una referencia de fecha/horario. Con eso ya
          podemos coordinar.
        </p>

        <form className="mt-6 grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Nombre</label>
              <Input placeholder="Tu nombre" />
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">WhatsApp</label>
              <Input placeholder="Ej: 3804 123456" inputMode="tel" />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">Servicio</label>

              <div className="relative">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)"
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-xs text-muted-foreground">
                Fecha preferida
              </label>
              <Input placeholder="Ej: 20/01 por la tarde" />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-xs text-muted-foreground">Detalles</label>
            <Textarea
              placeholder="Contanos qué te gustaría lograr, si ya te hiciste algo antes, o cualquier detalle útil…"
              className="min-h-28"
            />
          </div>

          <div className="pt-2">
            <Button className="w-full rounded-full">Enviar solicitud</Button>
            <p className="mt-3 text-xs text-muted-foreground">{helpText}</p>
          </div>
        </form>

        <div className="mt-6 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> Si querés
          coordinar más rápido, mandanos directamente por WhatsApp y te guiamos
          con disponibilidad y preparación previa.
        </div>
      </CardContent>
    </Card>
  );
}
