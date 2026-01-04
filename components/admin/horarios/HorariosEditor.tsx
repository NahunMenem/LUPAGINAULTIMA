//components/admin/horarios/HorariosEditor.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { deleteRule, getRules, getService, type ScheduleRule } from "@/lib/adminStore";
import { WEEKDAYS } from "@/lib/date";
import { Trash2 } from "lucide-react";

export default function HorariosEditor({ serviceId }: { serviceId: string }) {
  const [rules, setRules] = useState<ScheduleRule[]>([]);
  const service = useMemo(() => getService(serviceId), [serviceId]);

  const load = () => setRules(getRules(serviceId).sort((a, b) => a.weekday - b.weekday || a.from.localeCompare(b.from)));

  useEffect(() => {
    load();
  }, [serviceId]);

  if (!service) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
        Servicio no encontrado.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <SectionTitle title={`Horarios · ${service.name}`} subtitle="Rangos configurados por día para este servicio." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/horarios">
              <Button variant="outline" className="rounded-2xl">
                Volver
              </Button>
            </Link>
            <Link href="/admin/horarios/nuevo">
              <Button className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">
                Nuevo horario
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {rules.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-900">{WEEKDAYS[r.weekday]}</div>
                  <div className="text-sm text-zinc-600">
                    {r.from} - {r.to}
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  onClick={() => {
                    deleteRule(r.id);
                    load();
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            ))}

            {rules.length === 0 && (
              <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                No hay horarios configurados todavía.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
