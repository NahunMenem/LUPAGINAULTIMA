//components/admin/dashboard/AdminDashboard.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Wallet, Clock3, CheckCircle2, Plus } from "lucide-react";
import { formatHumanDate, toISODate } from "@/lib/date";
import { listServicios, listTurnos, hhmm, type Service, type Turno } from "@/lib/apiTurnos";

export default function AdminDashboard() {
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const human = useMemo(() => formatHumanDate(new Date(todayISO + "T00:00:00")), [todayISO]);

  const [services, setServices] = useState<Service[]>([]);
  const [todayTurnos, setTodayTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [sv, ts] = await Promise.all([listServicios(), listTurnos(todayISO)]);
        setServices(sv);
        setTodayTurnos(ts);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [todayISO]);

  const total = todayTurnos.length;
  const confirmed = todayTurnos.filter((t) => t.confirmado).length;
  const pending = todayTurnos.filter((t) => !t.confirmado).length;
  const paid = todayTurnos.filter((t) => (t.total_pagado ?? 0) > 0).length;

  const next = useMemo(() => {
    const sorted = [...todayTurnos].sort((a, b) => hhmm(a.hora).localeCompare(hhmm(b.hora)));
    return sorted.slice(0, 4).map((t) => ({
      ...t,
      serviceName: t.servicio || services.find((s) => s.id === t.servicio_id)?.nombre || "Servicio",
      time: hhmm(t.hora),
      paid: (t.total_pagado ?? 0) > 0,
    }));
  }, [todayTurnos, services]);

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  return (
    <div className="grid gap-6">
      <SectionTitle title="Dashboard" subtitle={`Resumen del día · ${human}`} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className={cardBase}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/15">
                <CalendarDays className="h-5 w-5 text-pink-700" />
              </div>
              <Badge variant="outline" className="rounded-full border-zinc-300/70 bg-white/70 text-zinc-700">
                {todayISO}
              </Badge>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Turnos hoy</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{loading ? "…" : total}</div>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Confirmados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{loading ? "…" : confirmed}</div>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-500/10 ring-1 ring-zinc-500/15">
              <Clock3 className="h-5 w-5 text-zinc-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Pendientes</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{loading ? "…" : pending}</div>
          </CardContent>
        </Card>

        <Card className={cardBase}>
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/15">
              <Wallet className="h-5 w-5 text-pink-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Pagos registrados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{loading ? "…" : paid}</div>
          </CardContent>
        </Card>
      </div>

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-900">Accesos rápidos</div>
              <div className="mt-1 text-xs text-zinc-600">Ir directo a tareas comunes.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/turnos">
                <Button className="rounded-2xl bg-pink-600 text-white shadow-sm hover:bg-pink-700">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver turnos
                </Button>
              </Link>

              <Link href="/admin/servicios/nuevo">
                <Button variant="outline" className="rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo servicio
                </Button>
              </Link>

              <Link href="/admin/caja">
                <Button variant="outline" className="rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50">
                  <Wallet className="mr-2 h-4 w-4" />
                  Ver caja
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">Próximos turnos (hoy)</div>
            <Link href="/admin/turnos" className="text-sm font-medium text-pink-700 hover:underline">
              Ver todo
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">Cargando…</div>
            ) : next.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                No hay turnos para hoy.
              </div>
            ) : (
              next.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold text-zinc-900">{t.time}</div>
                      <div className="text-sm text-zinc-700">{t.serviceName}</div>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {t.cliente_nombre} <span className="text-zinc-400">·</span> {t.cliente_telefono}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full bg-white ${t.confirmado ? "border-pink-200 text-pink-700" : "border-zinc-300 text-zinc-600"}`}
                    >
                      {t.confirmado ? "Confirmado" : "Pendiente"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`rounded-full bg-white ${t.paid ? "border-emerald-200 text-emerald-700" : "border-zinc-300 text-zinc-600"}`}
                    >
                      {t.paid ? "Pagado" : "Sin pago"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
