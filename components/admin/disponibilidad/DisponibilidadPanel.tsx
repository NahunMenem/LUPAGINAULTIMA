"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  toISODate,
  formatHumanDate,
  isoToLocalDate,
  normalizeSlots,
} from "@/lib/date";
import ConfirmarSlotDialog from "@/components/admin/disponibilidad/ConfirmarSlotDialog";
import {
  getDisponibilidad,
  listServicios,
  type Service,
} from "@/lib/apiTurnos";
import { toast } from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_BASE!;

type DayStatus = {
  date: string; // YYYY-MM-DD
  total: number;
  booked: number;
};

export default function DisponibilidadPanel() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");

  const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    isoToLocalDate(new Date().toISOString().slice(0, 10))
  );

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthStatus, setMonthStatus] = useState<DayStatus[]>([]);

  /* =========================
     Servicio seguro
  ========================= */
  const safeServiceId = useMemo(() => {
    const id = Number(serviceId);
    if (!id) return null;
    return services.some((s) => s.id === id) ? id : null;
  }, [serviceId, services]);

  const service = useMemo(
    () => services.find((s) => s.id === safeServiceId) ?? null,
    [services, safeServiceId]
  );

  const human = useMemo(
    () => formatHumanDate(isoToLocalDate(dateISO)),
    [dateISO]
  );

  /* =========================
     Cargar servicios
  ========================= */
  useEffect(() => {
    const run = async () => {
      try {
        const list = await listServicios();
        setServices(list);
        if (list.length > 0) {
          setServiceId(String(list[0].id));
        }
      } catch {
        toast.error("No se pudieron cargar los servicios");
      }
    };
    run();
  }, []);

  /* =========================
     Disponibilidad diaria
  ========================= */
  const loadAvailability = async () => {
    if (!safeServiceId || !dateISO) return;

    setLoading(true);
    try {
      const data = await getDisponibilidad(safeServiceId, dateISO);
      setSlots(normalizeSlots(data));
    } catch {
      toast.error("No se pudo cargar disponibilidad");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeServiceId, dateISO]);

  /* =========================
     Disponibilidad mensual
  ========================= */
  const loadMonthStatus = async () => {
    if (!safeServiceId) {
      setMonthStatus([]);
      return;
    }

    try {
      const month = dateISO.slice(0, 7); // YYYY-MM
      const res = await fetch(
        `${API}/disponibilidad/mes?servicio_id=${safeServiceId}&month=${month}`
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Respuesta inválida");

      setMonthStatus(data);
    } catch (err) {
      console.error("Error calendario:", err);
      toast.error("No se pudo cargar el calendario");
      setMonthStatus([]);
    }
  };

  useEffect(() => {
    loadMonthStatus();
  }, [safeServiceId, dateISO]);

  /* =========================
     Helpers calendario
  ========================= */
  const isEnabledDay = (date: Date) =>
    monthStatus.some((m) => m.date === toISODate(date));

  const isAvailableDay = (date: Date) =>
    monthStatus.some(
      (m) => m.date === toISODate(date) && m.booked < m.total
    );

  const isFullDay = (date: Date) =>
    monthStatus.some(
      (m) => m.date === toISODate(date) && m.booked === m.total
    );

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const slotBtn =
    "h-16 rounded-2xl border-emerald-500/40 bg-white/85 text-emerald-800 shadow-sm " +
    "cursor-pointer font-semibold transition " +
    "hover:bg-emerald-50 hover:text-emerald-900 hover:shadow " +
    "focus-visible:ring-2 focus-visible:ring-emerald-500/30";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Disponibilidad"
        subtitle="Solo se muestran los días donde el servicio atiende."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          {/* Servicio */}
          <div className="mb-6 grid gap-2">
            <div className="text-sm font-medium text-zinc-900">Servicio</div>
            <Select
              value={safeServiceId ? String(safeServiceId) : undefined}
              onValueChange={setServiceId}
            >
              <SelectTrigger className="rounded-2xl bg-white/90">
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

          {/* Layout */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendario */}
            <Card className="rounded-2xl bg-white/90 shadow-sm">
              <CardContent className="p-4">
                <div className="mb-2 text-center text-sm font-semibold text-zinc-900">
                  {format(visibleMonth, "MMMM yyyy", { locale: es })}
                </div>

                <Calendar
                  mode="single"
                  locale={es}
                  month={visibleMonth}
                  onMonthChange={(m) => {
                    setVisibleMonth(m);
                    setDateISO(toISODate(m));
                  }}
                  selected={isoToLocalDate(dateISO)}
                  onSelect={(d) => d && setDateISO(toISODate(d))}
                  disabled={(date) => !isEnabledDay(date)}
                  modifiers={{
                    available: isAvailableDay,
                    full: isFullDay,
                  }}
                  modifiersClassNames={{
                    available:
                      "bg-emerald-500/30 text-emerald-900 font-semibold rounded-full",
                    full:
                      "bg-red-500/30 text-red-900 font-semibold rounded-full",
                    selected:
                      "bg-zinc-900 text-white font-bold rounded-full",
                    today:
                      "border border-zinc-400 rounded-full",
                  }}
                  className="
                    rounded-xl
                    [&_.rdp-nav_button]:text-zinc-900
                    [&_.rdp-nav_button:hover]:bg-zinc-100
                    [&_.rdp-day_disabled]:opacity-20
                    [&_.rdp-day_disabled]:cursor-not-allowed
                  "
                />

                {/* Leyenda */}
                <div className="mt-4 flex gap-4 text-xs text-zinc-700">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-emerald-500/70" />
                    Disponible
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    Completo
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horarios */}
            <div>
              <div className="mb-2 text-sm font-semibold text-zinc-900">
                Horarios — {human}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {loading ? (
                  <div className="rounded-2xl border bg-white/80 p-6 text-sm text-zinc-600">
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
                  <div className="rounded-2xl border bg-white/80 p-6 text-sm text-zinc-600">
                    No hay turnos disponibles este día.
                  </div>
                )}
              </div>
            </div>
          </div>

          <ConfirmarSlotDialog
            open={!!selectedTime}
            onOpenChange={(v) => !v && setSelectedTime(null)}
            serviceName={service?.nombre ?? ""}
            dateHuman={human}
            dateISO={dateISO}
            time={selectedTime ?? ""}
            serviceId={safeServiceId ? String(safeServiceId) : ""}
            onDone={() => {
              setSelectedTime(null);
              loadAvailability();
              loadMonthStatus();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
