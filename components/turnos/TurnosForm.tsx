//components/turnos/TurnosForm.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { siteConfig } from "@/lib/site";

type BookingMode = "web" | "whatsapp";

type Service = {
  id: string;
  name: string;
  durationMin: number;
  category?: string;
};

const SERVICES: Service[] = [
  { id: "unas", name: "Uñas", durationMin: 30, category: "Manos" },
  { id: "crio", name: "Criolipólisis", durationMin: 50, category: "Corporal" },
  { id: "micro", name: "Micropigmentación", durationMin: 50, category: "Micro" },
  { id: "lash", name: "Lash Service", durationMin: 35, category: "Pestañas" },
  { id: "faciales", name: "Tratamientos faciales", durationMin: 60, category: "Facial" },
  { id: "brows", name: "Brows (Perfilado / Diseño)", durationMin: 30, category: "Cejas" },
  { id: "laminado", name: "Brows (Laminado)", durationMin: 45, category: "Cejas" },
  { id: "henna", name: "Brows (Henna)", durationMin: 45, category: "Cejas" },
  { id: "ext_clas", name: "Extensiones (Clásicas)", durationMin: 90, category: "Pestañas" },
  { id: "ext_vol", name: "Extensiones (Volumen medio)", durationMin: 110, category: "Pestañas" },
  { id: "mega", name: "Mega volumen", durationMin: 120, category: "Pestañas" },
  { id: "limpieza", name: "Facial (Limpieza profunda)", durationMin: 60, category: "Facial" },
  { id: "derma", name: "Facial (Dermaplaning + limpieza)", durationMin: 70, category: "Facial" },
  { id: "peeling", name: "Facial (Peeling enzimático)", durationMin: 60, category: "Facial" },
  { id: "micro_needling", name: "Facial (Microneedling)", durationMin: 75, category: "Facial" },
  { id: "delineado", name: "Delineado permanente", durationMin: 60, category: "Micro" },
  { id: "labios", name: "Micropigmentación (Labios)", durationMin: 60, category: "Micro" },
];

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

export default function TurnosForm() {
  const [mode, setMode] = useState<BookingMode>("web");
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0]?.id ?? "");
  const selectedService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) ?? SERVICES[0],
    [selectedServiceId]
  );

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { servicio?: string; detalle?: string };
      if (parsed?.servicio) {
        const match =
          SERVICES.find((s) => s.name.toLowerCase() === parsed.servicio.toLowerCase()) ??
          SERVICES.find((s) => parsed.servicio?.toLowerCase().includes(s.name.toLowerCase()));
        if (match) setSelectedServiceId(match.id);
      }
      if (parsed?.detalle) setNotes(parsed.detalle);
    } catch {}
  }, []);

  const daySlots = useMemo(() => {
    const base = ["09:00", "09:50", "10:40", "11:30"];
    return base;
  }, []);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    return format(date, "EEEE dd/MM", { locale: es });
  }, [date]);

  const summary = useMemo(() => {
    return {
      service: selectedService?.name ?? "—",
      date: date ? format(date, "dd/MM/yyyy", { locale: es }) : "—",
      time: time || "—",
      duration: selectedService?.durationMin ? `${selectedService.durationMin} min` : "—",
    };
  }, [selectedService, date, time]);

  const whatsappHref = useMemo(() => {
    return buildWhatsappHref({
      service: selectedService?.name ?? "",
      date: summary.date,
      time,
      name,
      phone,
      notes,
    });
  }, [selectedService, summary.date, time, name, phone, notes]);

  const canGoStep2 = Boolean(selectedServiceId);
  const canGoStep3 = Boolean(date && time);
  const canSubmit = Boolean(name.trim() && phone.trim() && selectedService?.name && date && time);

  return (
    <Card className="rounded-3xl border bg-background/60 backdrop-blur" id="turnos-form">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs tracking-widest text-muted-foreground">RESERVA</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight md:text-xl">
              Sacá tu turno (web o WhatsApp)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              WhatsApp es lo más directo para confirmar. Si querés, también podés reservar por la web.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border bg-background/40 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setMode("web")}
              className={[
                "rounded-full px-4 py-2 text-xs font-medium transition",
                mode === "web" ? "bg-(--brand-pink-soft) text-foreground" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Por la web
            </button>
            <button
              type="button"
              onClick={() => setMode("whatsapp")}
              className={[
                "rounded-full px-4 py-2 text-xs font-medium transition",
                mode === "whatsapp" ? "bg-(--brand-pink-soft) text-foreground" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              WhatsApp
            </button>
          </div>
        </div>

        {mode === "whatsapp" ? (
          <div className="mt-6 rounded-2xl border bg-(--hero-bg) p-5 md:p-6">
            <p className="text-sm text-muted-foreground">
              Te dejamos el mensaje listo con el servicio y tus datos (si los completás).
              Solo lo enviás y confirmamos disponibilidad.
            </p>

            <div className="mt-4 grid gap-3">
              <Button asChild className="rounded-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>

              <Button type="button" variant="outline" className="rounded-full" onClick={() => setMode("web")}>
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
                <span className={["h-2 w-2 rounded-full", step >= 1 ? "bg-(--brand-pink-soft)" : "bg-muted"].join(" ")} />
                <span className={["h-2 w-2 rounded-full", step >= 2 ? "bg-(--brand-pink-soft)" : "bg-muted"].join(" ")} />
                <span className={["h-2 w-2 rounded-full", step >= 3 ? "bg-(--brand-pink-soft)" : "bg-muted"].join(" ")} />
              </div>
              <div className="text-xs text-muted-foreground">Paso {step} de 3</div>
            </div>

            {step === 1 && (
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Elegí un servicio</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Elegí el servicio y después seleccionás fecha y horario disponible.
                </p>

                <div className="mt-4 grid gap-3">
                  {SERVICES.map((s) => {
                    const active = s.id === selectedServiceId;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedServiceId(s.id)}
                        className={[
                          "group flex items-center justify-between gap-4 rounded-2xl border p-4 text-left transition",
                          "bg-background/40 hover:bg-background/60",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
                          active ? "border-(--brand-pink-soft)" : "border-border",
                        ].join(" ")}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{s.name}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Duración aproximada: {s.durationMin} minutos
                          </p>
                        </div>
                        <div className="shrink-0 text-muted-foreground group-hover:text-foreground">›</div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" className="rounded-full" onClick={() => setStep(2)} disabled={!canGoStep2}>
                    Continuar
                  </Button>
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => setMode("whatsapp")}>
                    Prefiero WhatsApp
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5">
                <div className="rounded-2xl border bg-(--hero-bg) p-4 md:p-6">
                  <p className="text-sm font-semibold text-center">{selectedService?.name ?? "—"}</p>

                  <div className="mt-4 grid gap-3">
                    <p className="text-xs text-muted-foreground text-center">Elegí fecha</p>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="mx-auto w-full justify-between rounded-xl bg-background/40 md:max-w-md"
                        >
                          <span className="truncate">
                            {date ? format(date, "EEEE dd 'de' MMMM", { locale: es }) : "Seleccionar fecha"}
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
                            setTime("");
                          }}
                          disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="mx-auto w-full md:max-w-md">
                      <div className="mt-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Horarios disponibles</h3>
                        <span className="text-xs text-muted-foreground">{formattedDate || "—"}</span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        {daySlots.map((t) => {
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
                                active ? "border-(--brand-pink-soft)" : "border-border",
                              ].join(" ")}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(1)}>
                    Volver
                  </Button>
                  <Button type="button" className="rounded-full" onClick={() => setStep(3)} disabled={!canGoStep3}>
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-5">
                <div className="rounded-2xl border bg-(--hero-bg) p-4 md:p-6">
                  <p className="text-sm font-semibold text-center">{summary.service}</p>
                  <p className="mt-1 text-center text-xs text-muted-foreground">
                    {summary.date} • {summary.time} • {summary.duration}
                  </p>
                </div>

                <h3 className="mt-5 text-sm font-semibold">Confirmar turno</h3>

                <div className="mt-4 grid gap-3">
                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Nombre y apellido</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className="rounded-xl" />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Teléfono</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 3804 123456"
                      inputMode="tel"
                      className="rounded-xl"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-xs text-muted-foreground">Detalle opcional</label>
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
                      onClick={() => {
                        if (!canSubmit) return;
                        alert("Listo: en el próximo paso lo conectamos al backend para crear el turno (estado: pendiente).");
                      }}
                    >
                      Confirmar turno
                    </Button>

                    <Button asChild variant="outline" className="w-full rounded-full">
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                        Confirmar por WhatsApp
                      </a>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Al confirmar, el turno queda <span className="font-medium text-foreground">pendiente</span> hasta que lo validemos.
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="rounded-full" onClick={() => setStep(2)}>
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
          <span className="font-medium text-foreground">Tip:</span> WhatsApp confirma más rápido. La web deja la solicitud ordenada y te respondemos apenas haya disponibilidad.
        </div>
      </CardContent>
    </Card>
  );
}
