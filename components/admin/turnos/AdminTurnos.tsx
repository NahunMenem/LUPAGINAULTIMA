//components/admin/turnos/AdminTurnos.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatHumanDate, toISODate } from "@/lib/date";
import {
  hhmm,
  listServicios,
  listTurnos,
  eliminarTurno,
  confirmarTurno,
  registrarPago,
  type Service,
  type Turno,
} from "@/lib/apiTurnos";

import {
  FaWhatsapp,
  FaTrashAlt,
  FaMoneyBillWave,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

function IconBtn(props: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={props.title}
      onClick={props.disabled ? undefined : props.onClick}
      disabled={props.disabled}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 shadow-sm",
        "transition active:scale-[0.98]",
        "hover:bg-zinc-100 hover:border-zinc-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/35 focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export default function AdminTurnos() {
  const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
  const [query, setQuery] = useState("");

  const [services, setServices] = useState<Service[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const human = useMemo(
    () => formatHumanDate(new Date(dateISO + "T00:00:00")),
    [dateISO]
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sv, ts] = await Promise.all([listServicios(), listTurnos(dateISO)]);
      setServices(sv);
      setTurnos(ts);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando turnos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [dateISO]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = turnos.filter((t) => {
      if (!q) return true;
      const s =
        t.servicio || services.find((x) => x.id === t.servicio_id)?.nombre || "";
      return (
        s.toLowerCase().includes(q) ||
        (t.cliente_nombre || "").toLowerCase().includes(q) ||
        (t.cliente_telefono || "").toLowerCase().includes(q) ||
        hhmm(t.hora).includes(q)
      );
    });

    const map = new Map<number, Turno[]>();
    for (const t of filtered) {
      map.set(t.servicio_id, [...(map.get(t.servicio_id) ?? []), t]);
    }

    return Array.from(map.entries()).map(([sid, list]) => ({
      serviceId: sid,
      serviceName:
        services.find((s) => s.id === sid)?.nombre ??
        (list[0]?.servicio ?? "Servicio"),
      items: list.sort((a, b) => hhmm(a.hora).localeCompare(hhmm(b.hora))),
    }));
  }, [turnos, query, services]);

  const whatsappLink = (phone: string, t: Turno) => {
    const clean = (phone || "").replace(/[^\d]/g, "");
    const texto = encodeURIComponent(
      `Hola ${t.cliente_nombre} 👋\nTu turno es el ${t.fecha} a las ${hhmm(
        t.hora
      )} para *${t.servicio}*.\n\nGracias 💗`
    );
    return `https://wa.me/${clean}?text=${texto}`;
  };

  const onDelete = async (t: Turno) => {
    setBusyId(t.id);
    try {
      await eliminarTurno(t.id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo eliminar");
    } finally {
      setBusyId(null);
    }
  };

  const onConfirm = async (t: Turno) => {
    setBusyId(t.id);
    try {
      await confirmarTurno(t.id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo confirmar");
    } finally {
      setBusyId(null);
    }
  };

  const onPay = async (t: Turno) => {
    const servicio = services.find((s) => s.id === t.servicio_id);
    const monto = Number(servicio?.precio ?? 0) || 0;

    if ((t.total_pagado ?? 0) > 0) return;

    setBusyId(t.id);
    try {
      await registrarPago({ turno_id: t.id, metodo: "efectivo", monto });
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo registrar pago");
    } finally {
      setBusyId(null);
    }
  };

  const inputBase =
    "rounded-2xl bg-white/90 text-zinc-900 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:border-pink-400/60 dark:text-zinc-900 dark:[color-scheme:light]";

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  return (
    <div className="grid gap-6">
      <SectionTitle title="Turnos" subtitle="Gestión de turnos por día." />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4 md:grid-cols-[240px_1fr] md:items-end">
            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Fecha</div>
              <Input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className={inputBase}
              />
              <div className="text-xs text-zinc-600 capitalize">{human}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Buscar</div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Servicio, cliente, teléfono u hora…"
                className={cn(inputBase, "placeholder:text-zinc-400")}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white/80 p-4 text-sm text-zinc-600">
              Cargando…
            </div>
          )}
        </CardContent>
      </Card>

      {grouped.map((g) => (
        <Card key={g.serviceId} className={cardBase}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-base font-semibold text-zinc-900">
                {g.serviceName}
              </div>
              <Badge className="rounded-full border border-zinc-300/70 bg-white/70 text-zinc-700">
                {g.items.length} turno{g.items.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="mt-4 grid gap-3">
              {g.items.map((t) => {
                const paid = (t.total_pagado ?? 0) > 0;
                const confirmed = !!t.confirmado;
                const isBusy = busyId === t.id;

                return (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="grid h-8 w-8 place-items-center rounded-xl bg-pink-500/10 ring-1 ring-pink-500/15">
                            <FaClock className="h-4 w-4 text-pink-700" />
                          </div>
                          <div className="text-lg font-semibold text-zinc-900">
                            {hhmm(t.hora)}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-zinc-700">
                          {t.cliente_nombre}{" "}
                          <span className="text-zinc-400">·</span>{" "}
                          {t.cliente_telefono}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium",
                              paid
                                ? "border-emerald-200 text-emerald-700"
                                : "border-zinc-300 text-zinc-600"
                            )}
                          >
                            {paid ? `Pagado ($${t.total_pagado})` : "Sin pago"}
                          </span>

                          <span
                            className={cn(
                              "inline-flex items-center rounded-full border bg-white px-3 py-1 text-xs font-medium",
                              confirmed
                                ? "border-pink-200 text-pink-700"
                                : "border-zinc-300 text-zinc-600"
                            )}
                          >
                            {confirmed ? "Confirmado" : "Pendiente"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={whatsappLink(t.cliente_telefono, t)}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp"
                          className={cn("inline-flex", isBusy && "opacity-60")}
                        >
                          <IconBtn
                            title="WhatsApp"
                            className="hover:bg-emerald-50 hover:border-emerald-200"
                          >
                            <FaWhatsapp className="h-4 w-4 text-emerald-700" />
                          </IconBtn>
                        </a>

                        <IconBtn
                          title={paid ? "Ya tiene pago" : "Registrar pago (efectivo)"}
                          onClick={() => onPay(t)}
                          disabled={paid || isBusy}
                          className="hover:bg-amber-50 hover:border-amber-200"
                        >
                          <FaMoneyBillWave className="h-4 w-4 text-amber-700" />
                        </IconBtn>

                        <IconBtn
                          title={confirmed ? "Ya confirmado" : "Confirmar turno"}
                          onClick={() => onConfirm(t)}
                          disabled={confirmed || isBusy}
                          className="hover:bg-pink-50 hover:border-pink-200"
                        >
                          {/* ✅ FIX: era FaCircleCheck, ahora es FaCheckCircle */}
                          <FaCheckCircle className="h-4 w-4 text-pink-700" />
                        </IconBtn>

                        <IconBtn
                          title="Eliminar (solo si NO está confirmado)"
                          onClick={() => onDelete(t)}
                          disabled={isBusy}
                          className="hover:bg-rose-50 hover:border-rose-200"
                        >
                          <FaTrashAlt className="h-4 w-4 text-rose-700" />
                        </IconBtn>
                      </div>
                    </div>
                  </div>
                );
              })}

              {g.items.length === 0 && (
                <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                  No hay turnos para este servicio.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {!loading && grouped.length === 0 && (
        <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
          No hay turnos para esta fecha.
        </div>
      )}
    </div>
  );
}
