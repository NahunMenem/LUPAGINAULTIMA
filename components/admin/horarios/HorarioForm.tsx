//components/admin/horarios/HorarioForms.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { WEEKDAYS } from "@/lib/date";
import { crearHorario, listServicios, type Service } from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";

export default function HorarioForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("0");
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("13:00");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const list = await listServicios();
      setServices(list);
      setServiceId(String(list[0]?.id ?? ""));
    };
    run();
  }, []);

  const service = useMemo(
    () => services.find((s) => String(s.id) === serviceId) ?? null,
    [services, serviceId]
  );

  const save = async () => {
    if (!serviceId || !service) return;
    if (!from.trim() || !to.trim()) return;

    setSaving(true);
    try {
      await crearHorario({
        servicio_id: Number(serviceId),
        dia_semana: Number(weekday),
        hora_inicio: from,
        hora_fin: to,
      });

      window.location.href = `/admin/horarios/${serviceId}`;
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const inputBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:border-emerald-400/60";

  // ✅ FIX outline hover
  const outlineBtn =
    "rounded-2xl border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 active:!bg-zinc-200";

  const primaryGreenBtn =
    "rounded-2xl bg-emerald-500 text-white shadow-sm " +
    "hover:!bg-emerald-600 hover:shadow active:!bg-emerald-700";

  const selectTriggerBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 " +
    "focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-400/60";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Nuevo horario"
        subtitle="Configurá un rango para un servicio y un día de la semana."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Servicio</div>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className={cn(selectTriggerBase)}>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nombre} · {s.duracion_minutos} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Día</div>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger className={cn(selectTriggerBase)}>
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
                <div className="text-sm font-medium text-zinc-900">
                  Hora inicio
                </div>
                <Input
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Hora fin</div>
                <Input
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/horarios">
                <Button variant="outline" className={outlineBtn}>
                  Volver
                </Button>
              </Link>

              <Button
                className={primaryGreenBtn}
                onClick={save}
                disabled={saving}
              >
                {saving ? "Guardando..." : "Guardar horario"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
