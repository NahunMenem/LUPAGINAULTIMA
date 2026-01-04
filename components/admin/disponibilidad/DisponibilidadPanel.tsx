
//components/admin/disponibilidad/DisponibilidadPanel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { computeAvailability, getServices, type Service } from "@/lib/adminStore";
import { toISODate, formatHumanDate } from "@/lib/date";
import ConfirmarSlotDialog from "@/components/admin/disponibilidad/ConfirmarSlotDialog";

export default function DisponibilidadPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const list = getServices().filter((s) => s.active);
    setServices(list);
    setServiceId(list[0]?.id ?? "");
  }, []);

  const service = useMemo(() => services.find((s) => s.id === serviceId) ?? null, [services, serviceId]);

  const availability = useMemo(() => {
    if (!serviceId) return { slots: [], taken: [] };
    return computeAvailability(serviceId, dateISO);
  }, [serviceId, dateISO]);

  const human = useMemo(() => formatHumanDate(new Date(dateISO + "T00:00:00")), [dateISO]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Disponibilidad" subtitle="Seleccioná un servicio y una fecha para ver los horarios disponibles." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
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
              <div className="text-sm font-medium text-zinc-900">Fecha</div>
              <Input type="date" value={dateISO} onChange={(e) => setDateISO(e.target.value)} className="rounded-2xl" />
              <div className="text-xs text-zinc-500 capitalize">{human}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-zinc-900">Horarios disponibles</div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {availability.slots.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  className="h-20 rounded-2xl border-emerald-500/50 text-emerald-700 hover:bg-emerald-50"
                  onClick={() => setSelectedTime(t)}
                >
                  {t}
                </Button>
              ))}

              {availability.slots.length === 0 && (
                <div className="md:col-span-3 rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                  No hay disponibilidad (revisá horarios configurados en “Horarios”).
                </div>
              )}
            </div>
          </div>

          <ConfirmarSlotDialog
            open={!!selectedTime}
            onOpenChange={(v) => !v && setSelectedTime(null)}
            serviceName={service?.name ?? ""}
            dateHuman={human}
            dateISO={dateISO}
            time={selectedTime ?? ""}
            serviceId={serviceId}
            onDone={() => setSelectedTime(null)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
