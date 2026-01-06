//components/admin/disponibilidad/DisponibilidadPanel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toISODate, formatHumanDate } from "@/lib/date";
import ConfirmarSlotDialog from "@/components/admin/disponibilidad/ConfirmarSlotDialog";
import { getDisponibilidad, listServicios, type Service } from "@/lib/apiTurnos";
import { toast } from "react-hot-toast";

export default function DisponibilidadPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState("");
  const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const list = await listServicios();
        setServices(list);
        setServiceId(String(list[0]?.id ?? ""));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudieron cargar los servicios");
        setServices([]);
        setServiceId("");
      }
    };
    run();
  }, []);

  const service = useMemo(
    () => services.find((s) => String(s.id) === serviceId) ?? null,
    [services, serviceId]
  );

  const human = useMemo(
    () => formatHumanDate(new Date(dateISO + "T00:00:00")),
    [dateISO]
  );

  const normalizeSlots = (data: string[]) => {
    const unique = Array.from(new Set((data ?? []).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b));
    return unique;
  };

  const loadAvailability = async () => {
    if (!serviceId || !dateISO) return;
    setLoading(true);
    try {
      const data = await getDisponibilidad(Number(serviceId), dateISO);
      setSlots(normalizeSlots(data));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cargar disponibilidad");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [serviceId, dateISO]);

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const inputBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:border-emerald-400/60";

  const selectTriggerBase =
    "rounded-2xl border-zinc-200/80 bg-white/90 shadow-sm " +
    "focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-400/60";

  const slotBtn =
    "h-16 rounded-2xl border-emerald-500/40 bg-white/85 text-emerald-800 shadow-sm " +
    "cursor-pointer font-semibold transition " +
    "hover:!bg-emerald-50/70 hover:!text-emerald-900 hover:shadow " +
    "active:!bg-emerald-100/70 " +
    "focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-0";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Disponibilidad"
        subtitle="Seleccioná un servicio y una fecha para ver los horarios disponibles."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Servicio</div>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className={selectTriggerBase}>
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
              <div className="text-sm font-medium text-zinc-900">Fecha</div>
              <Input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className={inputBase}
              />
              <div className="text-xs text-zinc-600 capitalize">{human}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-zinc-900">
              Horarios disponibles
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {loading ? (
                <div className="md:col-span-3 rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                  Cargando…
                </div>
              ) : (
                slots.map((t) => (
                  <Button
                    key={t}
                    variant="outline"
                    className={slotBtn}
                    onClick={() => setSelectedTime(t)}
                  >
                    {t}
                  </Button>
                ))
              )}

              {!loading && slots.length === 0 && (
                <div className="md:col-span-3 rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                  No hay disponibilidad (revisá horarios configurados en “Horarios”).
                </div>
              )}
            </div>
          </div>

          <ConfirmarSlotDialog
            open={!!selectedTime}
            onOpenChange={(v) => !v && setSelectedTime(null)}
            serviceName={service?.nombre ?? ""}
            dateHuman={human}
            dateISO={dateISO}
            time={selectedTime ?? ""}
            serviceId={serviceId}
            onDone={() => {
              setSelectedTime(null);
              loadAvailability();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
