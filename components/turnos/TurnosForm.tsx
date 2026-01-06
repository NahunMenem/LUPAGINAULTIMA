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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { siteConfig } from "@/lib/site";
import {
  listServicios,
  getDisponibilidad,
  reservarTurno,
  type Service,
} from "@/lib/apiTurnos";

type BookingMode = "web" | "whatsapp";
const LS_KEY = "turnos_draft";

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

function toISODate(d?: Date) {
  if (!d) return "";
  return format(d, "yyyy-MM-dd");
}

export default function TurnosForm() {
  const [mode, setMode] = useState<BookingMode>("web");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null
  );
  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId]
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const dateISO = useMemo(() => toISODate(date), [date]);

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
        setServicesError(
          e instanceof Error ? e.message : "Error cargando servicios"
        );
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
        setSlots(list);
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

  const formattedDateHuman = useMemo(() => {
    if (!date) return "";
    return format(date, "EEEE dd/MM", { locale: es });
  }, [date]);

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
    name.trim() && phone.trim() && selectedServiceId && dateISO && time && !submitting
  );

  const submitReserva = async () => {
    if (!canSubmit || !selectedServiceId || !dateISO) return;

    setSubmitting(true);
    try {
      await reservarTurno({
        servicio_id: selectedServiceId,
        fecha: dateISO,
        hora: time,
        cliente_nombre: name.trim(),
        cliente_telefono: phone.trim(),
      });

      toast.success("✅ Turno reservado. Te confirmamos a la brevedad 💗");

      setStep(1);
      setTime("");
      setName("");
      setPhone("");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo reservar el turno"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card
      className="rounded-3xl border bg-background/60 backdrop-blur"
      id="turnos-form"
    >
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground">
              RESERVA
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight md:text-xl">
              Sacá tu turno (web o WhatsApp)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              WhatsApp es lo más directo para confirmar. Si querés, también podés
              reservar por la web.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-background/40 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setMode("web")}
              className={[
                "rounded-full px-4 py-2 text-xs font-medium transition",
                mode === "web"
                  ? "bg-(--brand-pink-soft) text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Por la web
            </button>
            <button
              type="button"
              onClick={() => setMode("whatsapp")}
              className={[
                "rounded-full px-4 py-2 text-xs font-medium transition",
                mode === "whatsapp"
                  ? "bg-(--brand-pink-soft) text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {mode === "whatsapp" ? (
          <div className="mt-6 rounded-2xl border bg-(--hero-bg) p-5 md:p-6">
            <p className="text-sm text-muted-foreground">
              Te dejamos el mensaje listo con el servicio y tus datos (si los
              completás). Solo lo enviás y confirmamos disponibilidad.
            </p>

            <div className="mt-4 grid gap-3">
              <Button asChild className="rounded-full">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Escribir por WhatsApp
                </a>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setMode("web")}
              >
                Prefiero reservar por la web
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Confirmación sujeta a disponibilidad • Cupos limitados
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    step >= 1 ? "bg-(--brand-pink-soft)" : "bg-muted",
                  ].join(" ")}
                />
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    step >= 2 ? "bg-(--brand-pink-soft)" : "bg-muted",
                  ].join(" ")}
                />
                <span
                  className={[
                    "h-2 w-2 rounded-full",
                    step >= 3 ? "bg-(--brand-pink-soft)" : "bg-muted",
                  ].join(" ")}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Paso {step} de 3
              </div>
            </div>

            {step === 1 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Elegí un servicio</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Elegí el servicio y después seleccionás fecha y horario
                  disponible.
                </p>

                {servicesError && (
                  <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
                    {servicesError}
                  </div>
                )}

                {servicesLoading ? (
                  <div className="mt-4 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
                    Cargando servicios…
                  </div>
                ) : (
                  <div className="mt-4 grid gap-3">
                    {services.map((s) => {
                      const active = s.id === selectedServiceId;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedServiceId(s.id)}
                          className={[
                            "group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
                            active
                              ? "border-(--brand-pink-soft) bg-(--brand-pink-soft)/10 shadow-[0_0_0_1px_rgba(255,105,180,.25)]"
                              : "border-border bg-background/40 hover:bg-background/60",
                          ].join(" ")}
                          aria-pressed={active}
                        >
                          <div className="min-w-0">
                            <p
                              className={[
                                "text-sm font-semibold",
                                active ? "text-foreground" : "",
                              ].join(" ")}
                            >
                              {s.nombre}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Duración aprox: {s.duracion_minutos} min • $
                              {s.precio}
                            </p>
                          </div>

                          <div className="shrink-0">
                            {active ? (
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-pink-soft) text-foreground">
                                ✓
                              </span>
                            ) : (
                              <span className="text-muted-foreground group-hover:text-foreground">
                                ›
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="rounded-full"
                    onClick={() => setStep(2)}
                    disabled={!canGoStep2}
                  >
                    Continuar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setMode("whatsapp")}
                  >
                    Prefiero WhatsApp
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5">
                <div className="rounded-2xl border bg-(--hero-bg) p-4 md:p-6">
                  <p className="text-sm font-semibold text-center">
                    {selectedService?.nombre ?? "—"}
                  </p>

                  <div className="mt-4 grid gap-3">
                    <p className="text-xs text-muted-foreground text-center">
                      Elegí fecha
                    </p>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="mx-auto w-full justify-between rounded-xl bg-background/40 md:max-w-md"
                        >
                          <span className="truncate">
                            {date
                              ? format(date, "EEEE dd 'de' MMMM", { locale: es })
                              : "Seleccionar fecha"}
                          </span>
                          <CalendarIcon className="h-4 w-4 opacity-70" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3" align="center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(d) => {
                            setDate(d);
                          }}
                          disabled={(d) =>
                            d < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="mx-auto w-full md:max-w-md">
                      <div className="mt-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">
                          Horarios disponibles
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {formattedDateHuman || "—"}
                        </span>
                      </div>

                      {slotsError && (
                        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
                          {slotsError}
                        </div>
                      )}

                      {slotsLoading ? (
                        <div className="mt-3 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
                          Buscando disponibilidad…
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="mt-3 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
                          No hay horarios disponibles para esta fecha.
                        </div>
                      ) : (
                        <div className="mt-3 grid grid-cols-2 gap-3">
                          {slots.map((t) => {
                            const active = t === time;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setTime(t)}
                                className={[
                                  "rounded-2xl border px-4 py-6 text-sm font-semibold transition",
                                  "bg-background/40 hover:bg-background/60",
                                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
                                  active
                                    ? "border-(--brand-pink-soft)"
                                    : "border-border",
                                ].join(" ")}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setStep(1)}
                  >
                    Volver
                  </Button>
                  <Button
                    type="button"
                    className="rounded-full"
                    onClick={() => setStep(3)}
                    disabled={!canGoStep3}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-5">
                <div className="rounded-2xl border bg-(--hero-bg) p-4 md:p-6">
                  <p className="text-sm font-semibold text-center">
                    {summary.service}
                  </p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    {summary.date} • {summary.time} • {summary.duration}
                  </p>
                </div>

                <h3 className="mt-5 text-sm font-semibold">Confirmar turno</h3>

                <div className="mt-4 grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">
                      Nombre y apellido
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">
                      Teléfono
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 3804 123456"
                      inputMode="tel"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">
                      Detalle opcional
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Si querés, contanos algo importante (referencia, piel sensible, etc.)"
                      className="min-h-28 rounded-xl"
                    />
                  </div>

                  <div className="mt-2 grid gap-3">
                    <Button
                      type="button"
                      className="w-full rounded-full"
                      disabled={!canSubmit}
                      onClick={submitReserva}
                    >
                      {submitting ? "Reservando…" : "Confirmar turno"}
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full"
                    >
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Confirmar por WhatsApp
                      </a>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Al confirmar, el turno queda{" "}
                    <span className="font-medium text-foreground">
                      reservado
                    </span>{" "}
                    y luego se confirma desde administración.
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setStep(2)}
                  >
                    Volver
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setStep(1);
                      setTime("");
                      setName("");
                      setPhone("");
                    }}
                  >
                    Reiniciar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Tip:</span> WhatsApp
          confirma más rápido. La web deja la solicitud ordenada y te respondemos
          apenas haya disponibilidad.
        </div>
      </CardContent>
    </Card>
  );
}
