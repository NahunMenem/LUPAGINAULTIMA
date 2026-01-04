//components/admin/dashboard/AdminDashboard.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Sparkles, Wallet, Clock3, CheckCircle2, Plus } from "lucide-react";
import { getBookings, getServices } from "@/lib/adminStore";
import { toISODate, formatHumanDate } from "@/lib/date";

export default function AdminDashboard() {
  const todayISO = useMemo(() => toISODate(new Date()), []);
  const human = useMemo(() => formatHumanDate(new Date(todayISO + "T00:00:00")), [todayISO]);

  const services = useMemo(() => getServices(), []);
  const todayBookings = useMemo(() => getBookings(todayISO), [todayISO]);

  const total = todayBookings.length;
  const confirmed = todayBookings.filter((b) => b.confirmed).length;
  const pending = todayBookings.filter((b) => !b.confirmed).length;
  const paid = todayBookings.filter((b) => b.paid).length;

  const next = useMemo(() => {
    const sorted = [...todayBookings].sort((a, b) => a.time.localeCompare(b.time));
    return sorted.slice(0, 4).map((b) => ({
      ...b,
      serviceName: services.find((s) => s.id === b.serviceId)?.name ?? "Servicio",
    }));
  }, [todayBookings, services]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Dashboard" subtitle={`Resumen del día · ${human}`} />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/15">
                <CalendarDays className="h-5 w-5 text-pink-700" />
              </div>
              <Badge variant="outline" className="rounded-full">
                {todayISO}
              </Badge>
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Turnos hoy</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{total}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/15">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Confirmados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{confirmed}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-zinc-500/10 ring-1 ring-zinc-500/15">
              <Clock3 className="h-5 w-5 text-zinc-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Pendientes</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{pending}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-5">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/15">
              <Wallet className="h-5 w-5 text-pink-700" />
            </div>
            <div className="mt-4 text-sm font-medium text-zinc-700">Pagos registrados</div>
            <div className="mt-2 text-3xl font-semibold text-zinc-900">{paid}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-zinc-900">Accesos rápidos</div>
              <div className="mt-1 text-xs text-zinc-500">Ir directo a tareas comunes.</div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link href="/admin/turnos">
                <Button className="rounded-2xl">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Ver turnos
                </Button>
              </Link>

              <Link href="/admin/servicios/nuevo">
                <Button variant="outline" className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo servicio
                </Button>
              </Link>

              <Link href="/admin/caja">
                <Button variant="outline" className="rounded-2xl">
                  <Wallet className="mr-2 h-4 w-4" />
                  Ver caja
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-zinc-900">Próximos turnos (hoy)</div>
            <Link href="/admin/turnos" className="text-sm font-medium text-pink-700 hover:underline">
              Ver todo
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {next.length === 0 ? (
              <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                No hay turnos para hoy.
              </div>
            ) : (
              next.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-semibold text-zinc-900">{t.time}</div>
                      <div className="text-sm text-zinc-700">{t.serviceName}</div>
                    </div>
                    <div className="mt-1 text-sm text-zinc-600">
                      {t.customerName} <span className="text-zinc-400">·</span> {t.customerPhone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-full ${t.confirmed ? "border-pink-300 text-pink-700" : "border-zinc-300 text-zinc-600"}`}
                    >
                      {t.confirmed ? "Confirmado" : "Pendiente"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={`rounded-full ${t.paid ? "border-emerald-300 text-emerald-700" : "border-zinc-300 text-zinc-600"}`}
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
