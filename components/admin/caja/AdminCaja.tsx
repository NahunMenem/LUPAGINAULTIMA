//components/admin/caja/AdminCaja.tsx
"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { computeCashRange, getServices } from "@/lib/adminStore";
import { toISODate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";

export default function AdminCaja() {
  const [fromISO, setFromISO] = useState(() => toISODate(new Date()));
  const [toISO, setToISO] = useState(() => toISODate(new Date()));

  const services = useMemo(() => getServices(), []);
  const stats = useMemo(() => computeCashRange(fromISO, toISO), [fromISO, toISO]);

  const totalPaid = useMemo(() => stats.inRange.filter((b) => b.paid).length, [stats.inRange]);
  const totalBookings = useMemo(() => stats.inRange.length, [stats.inRange]);

  const byService = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of stats.inRange) {
      map.set(b.serviceId, (map.get(b.serviceId) ?? 0) + 1);
    }
    const arr = Array.from(map.entries()).map(([sid, count]) => ({
      service: services.find((s) => s.id === sid)?.name ?? "Servicio",
      count,
      pct: totalBookings ? Math.round((count / totalBookings) * 100) : 0,
    }));
    return arr.sort((a, b) => b.count - a.count);
  }, [stats.inRange, services, totalBookings]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Caja" subtitle="Resumen de turnos confirmados/pagos del período seleccionado." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Desde</div>
              <Input type="date" value={fromISO} onChange={(e) => setFromISO(e.target.value)} className="rounded-2xl" />
            </div>
            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Hasta</div>
              <Input type="date" value={toISO} onChange={(e) => setToISO(e.target.value)} className="rounded-2xl" />
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border bg-pink-50 p-4">
              <div className="text-sm text-zinc-600">Turnos en período</div>
              <div className="mt-2 text-3xl font-semibold text-pink-700">{totalBookings}</div>
            </div>
            <div className="rounded-2xl border bg-emerald-50 p-4">
              <div className="text-sm text-zinc-600">Pagos registrados</div>
              <div className="mt-2 text-3xl font-semibold text-emerald-700">{totalPaid}</div>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            <div className="text-sm font-semibold text-zinc-900">Servicios más solicitados</div>

            {byService.length === 0 && (
              <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                No hay datos en el período.
              </div>
            )}

            {byService.map((x) => (
              <div key={x.service} className="flex items-center justify-between rounded-2xl border bg-white p-4">
                <div className="text-sm font-medium text-zinc-900">{x.service}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-full">
                    {x.count} turnos
                  </Badge>
                  <div className="text-sm font-semibold text-pink-700">{x.pct}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
