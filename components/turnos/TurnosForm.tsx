//components/turnos/TurnosForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { toast } from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { siteConfig } from "@/lib/site";
import { toISODate } from "@/lib/date";
import {
  listServicios,
  getDisponibilidad,
  reservarTurno,
  type Service,
} from "@/lib/apiTurnos";

/* =========================
   Utils locales
========================= */

type BookingMode = "web" | "whatsapp";
const LS_KEY = "turnos_draft";

function hhmm(h: string) {
  return h?.slice(0, 5) ?? "";
}

function buildWhatsappHref(payload: {
  service: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
  notes?: string;
}) {
  const base = `https://wa.me/${siteConfig.whatsapp.phone}`;
  const lines = [
    "Hola! Quiero reservar un turno 💗",
    payload.service ? `• Servicio: ${payload.service}` : null,
    payload.date ? `• Fecha: ${payload.date}` : null,
    payload.time ? `• Hora: ${payload.time}` : null,
    payload.name ? `• Nombre: ${payload.name}` : null,
    payload.phone ? `• Teléfono: ${payload.phone}` : null,
    payload.notes ? `• Detalles: ${payload.notes}` : null,
  ].filter(Boolean);

  return `${base}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export default function TurnosForm() {
  const [mode, setMode] = useState<BookingMode>("web");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId]
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const dateISO = useMemo(() => (date ? toISODate(date) : ""), [date]);

  const [time, setTime] = useState<string>("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const sv = await listServicios();
        setServices(sv);

        if (sv.length && selectedServiceId == null) {
          setSelectedServiceId(sv[0].id);
        }
      } catch (e) {
        setServicesError(e instanceof Error ? e.message : "Error cargando servicios");
      } finally {
        setServicesLoading(false);
      }
    };

    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { servicio?: string; detalle?: string };

      if (parsed?.detalle) setNotes(parsed.detalle);

      if (parsed?.servicio && services.length) {
        const q = parsed.servicio.toLowerCase();
        const match =
          services.find((s) => s.nombre.toLowerCase() === q) ||
          services.find((s) => q.includes(s.nombre.toLowerCase()));
        if (match) setSelectedServiceId(match.id);
      }
    } catch {}
  }, [services]);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedServiceId || !dateISO) return;

      setSlotsLoading(true);
      setSlotsError(null);
      setSlots([]);
      setTime("");

      try {
        const list = await getDisponibilidad(selectedServiceId, dateISO);
        const clean = Array.from(new Set(list.map((t) => hhmm(t)))).sort();
        setSlots(clean);
      } catch (e) {
        setSlotsError(
          e instanceof Error ? e.message : "Error cargando disponibilidad"
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [selectedServiceId, dateISO]);

  const summary = useMemo(() => {
    return {
      service: selectedService?.nombre ?? "—",
      date: date ? format(date, "dd/MM/yyyy", { locale: es }) : "—",
      time: time || "—",
      duration: selectedService?.duracion_minutos
        ? `${selectedService.duracion_minutos} min`
        : "—",
    };
  }, [selectedService, date, time]);

  const whatsappHref = useMemo(() => {
    return buildWhatsappHref({
      service: summary.service,
      date: summary.date,
      time,
      name,
      phone,
      notes,
    });
  }, [summary.service, summary.date, time, name, phone, notes]);

  const canGoStep2 = Boolean(selectedServiceId);
  const canGoStep3 = Boolean(date && time);
  const canSubmit = Boolean(
    name.trim() &&
      phone.trim() &&
      selectedServiceId &&
      dateISO &&
      time &&
      !submitting
  );

  const submitReserva = async () => {
    if (!canSubmit || !selectedServiceId || !dateISO) return;

    setSubmitting(true);
    try {
      await reservarTurno({
        servicio_id: selectedServiceId,
        fecha: dateISO,
        hora: hhmm(time),
        cliente_nombre: name.trim(),
        cliente_telefono: phone.trim(),
      });

      toast.success("✅ Turno reservado. Te confirmamos a la brevedad 💗");

      setStep(1);
      setTime("");
      setName("");
      setPhone("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo reservar el turno");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      id="turnos-form"
      className="rounded-3xl border bg-background/60 backdrop-blur"
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground">RESERVA</p>
            <h2 className="mt-2 text-lg font-semibold md:text-xl">
              Sacá tu turno (web o WhatsApp)
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-background/40 p-1">
            <button
              type="button"
              onClick={() => setMode("web")}
              className={`rounded-full px-4 py-2 text-xs font-medium ${
                mode === "web" ? "bg-(--brand-pink-soft)" : "text-muted-foreground"
              }`}
            >
              Web
            </button>
            <button
              type="button"
              onClick={() => setMode("whatsapp")}
              className={`rounded-full px-4 py-2 text-xs font-medium ${
                mode === "whatsapp"
                  ? "bg-(--brand-pink-soft)"
                  : "text-muted-foreground"
              }`}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {mode === "whatsapp" && (
          <div className="mt-6 rounded-2xl border p-5">
            <Button asChild className="w-full rounded-full">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        )}

        {mode === "web" && (
          <div className="mt-6">
            {step === 1 && (
              <>
                {servicesError && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {servicesError}
                  </div>
                )}

                {servicesLoading ? (
                  <div className="mt-4 rounded-2xl border p-4 text-sm">
                    Cargando servicios…
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {services.map((s) => {
                      const selected = s.id === selectedServiceId;

                      return (
                        <label
                          key={s.id}
                          className={`
                            relative flex cursor-pointer items-center justify-between gap-4
                            rounded-2xl border p-4 transition-all
                            ${selected
                              ? `
                                border-[#ec4899]
                                bg-[#ec4899]/90
                                text-white
                                shadow-[0_0_0_4px_rgba(236,72,153,0.55)]
                                scale-[1.02]
                              `
                              : `
                                bg-background/30
                                text-muted-foreground
                                hover:border-[#ec4899]
                              `
                            }
                          `}
                        >
                          {/* Radio real (accesibilidad) */}
                          <input
                            type="radio"
                            name="service"
                            value={s.id}
                            checked={selected}
                            onChange={() => setSelectedServiceId(s.id)}
                            className="sr-only"
                          />

                          {/* Info servicio */}
                          <div>
                            <p className="font-semibold text-base">
                              {s.nombre}
                            </p>
                            <p
                              className={`text-xs ${
                                selected ? "text-white/90" : "text-muted-foreground"
                              }`}
                            >
                              {s.duracion_minutos} min • ${s.precio}
                            </p>
                          </div>

                          {/* Radio visual */}
                          <span
                            className={`
                              flex h-5 w-5 items-center justify-center rounded-full border-2
                              ${selected
                                ? "border-white bg-white"
                                : "border-muted-foreground"
                              }
                            `}
                          >
                            {selected && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]" />
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                )}

                <div className="mt-5">
                  <Button
                    className="rounded-full"
                    onClick={() => setStep(2)}
                    disabled={!canGoStep2}
                  >
                    Continuar
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {slotsError && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {slotsError}
                  </div>
                )}

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      {date
                        ? format(date, "EEEE dd 'de' MMMM", { locale: es })
                        : "Seleccionar fecha"}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>

                {slotsLoading ? (
                  <div className="mt-4 rounded-2xl border p-4 text-sm">
                    Cargando horarios…
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {slots.map((t) => {
                      const selected = t === time;

                      return (
                        <label
                          key={t}
                          className={`
                            relative flex cursor-pointer items-center justify-between gap-3
                            rounded-2xl border p-4 transition-all
                            ${selected
                              ? `
                                border-[#ec4899]
                                bg-[#ec4899]/90
                                text-white
                                shadow-[0_0_0_4px_rgba(236,72,153,0.55)]
                                scale-[1.02]
                              `
                              : `
                                bg-background/30
                                text-muted-foreground
                                hover:border-[#ec4899]
                              `
                            }
                          `}
                        >
                          {/* Radio real (accesibilidad) */}
                          <input
                            type="radio"
                            name="slot"
                            value={t}
                            checked={selected}
                            onChange={() => setTime(t)}
                            className="sr-only"
                          />

                          {/* Hora */}
                          <span className="text-base font-semibold">
                            {t}
                          </span>

                          {/* Radio visual */}
                          <span
                            className={`
                              flex h-5 w-5 items-center justify-center rounded-full border-2
                              ${selected
                                ? "border-white bg-white"
                                : "border-muted-foreground"
                              }
                            `}
                          >
                            {selected && (
                              <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]" />
                            )}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                )}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => setStep(1)}
                  >
                    ← Volver
                  </Button>

                  <Button
                    className="rounded-full"
                    onClick={() => setStep(3)}
                    disabled={!canGoStep3}
                  >
                    Continuar
                  </Button>
                </div>

              </>
            )}

            {step === 3 && (
              <>
                <Input
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Textarea
                  placeholder="Detalle opcional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <Button
                  className="mt-4 w-full rounded-full"
                  onClick={submitReserva}
                  disabled={!canSubmit}
                >
                  {submitting ? "Reservando…" : "Confirmar turno"}
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
