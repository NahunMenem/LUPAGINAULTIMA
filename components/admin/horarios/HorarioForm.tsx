//components/admin/horarios/HorarioForms.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createRule, getServices, type Service } from "@/lib/adminStore";
import { WEEKDAYS } from "@/lib/date";

export default function HorarioForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("0");
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("13:00");

  useEffect(() => {
    const list = getServices().filter((s) => s.active);
    setServices(list);
    setServiceId(list[0]?.id ?? "");
  }, []);

  const service = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Nuevo horario" subtitle="Configurá un rango para un servicio y un día de la semana." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Servicio</div>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} · {s.durationMin} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Día</div>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger className="rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Hora inicio</div>
                <Input value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-2xl" />
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Hora fin</div>
                <Input value={to} onChange={(e) => setTo(e.target.value)} className="rounded-2xl" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/horarios">
                <Button variant="outline" className="rounded-2xl">
                  Volver
                </Button>
              </Link>

              <Button
                className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => {
                  if (!serviceId) return;
                  if (!service) return;
                  if (!from.trim() || !to.trim()) return;

                  createRule({ serviceId, weekday: Number(weekday), from, to });
                  window.location.href = `/admin/horarios/${serviceId}`;
                }}
              >
                Guardar horario
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
