//components/admin/horarios/HorariosEditor.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WEEKDAYS } from "@/lib/date";
import {
  horariosServicio,
  listServicios,
  type Horario,
  type Service,
  hhmm,
} from "@/lib/apiTurnos";
import { Badge } from "@/components/ui/badge";

export default function HorariosEditor({ serviceId }: { serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [rules, setRules] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [sv, hs] = await Promise.all([
        listServicios(),
        horariosServicio(Number(serviceId)),
      ]);
      setService(sv.find((x) => String(x.id) === String(serviceId)) ?? null);
      setRules(
        hs.sort(
          (a, b) =>
            a.dia_semana - b.dia_semana ||
            hhmm(a.hora_inicio).localeCompare(hhmm(b.hora_inicio))
        )
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [serviceId]);

  const title = useMemo(
    () => `Horarios · ${service?.nombre ?? "Servicio"}`,
    [service?.nombre]
  );

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title={title}
        subtitle="Rangos configurados por día para este servicio."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/horarios">
              <Button
                variant="outline"
                className="rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
              >
                Volver
              </Button>
            </Link>
            <Link href="/admin/horarios/nuevo">
              <Button className="rounded-2xl bg-emerald-500 text-white shadow-sm hover:bg-emerald-600">
                Nuevo horario
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                Cargando…
              </div>
            ) : rules.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                No hay horarios configurados todavía.
              </div>
            ) : (
              rules.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-zinc-900">
                        {WEEKDAYS[r.dia_semana]}
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full border-zinc-300/70 bg-white text-zinc-700"
                      >
                        {hhmm(r.hora_inicio)} - {hhmm(r.hora_fin)}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-500">
                    (Por ahora el backend no tiene endpoint para eliminar horarios)
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
