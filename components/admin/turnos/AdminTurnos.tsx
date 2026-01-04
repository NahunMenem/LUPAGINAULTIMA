//components/admin/turnos/AdminTurnos.tsx
"use client";

import { useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquareText, Trash2, Banknote, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookings, getServices, deleteBooking, updateBooking } from "@/lib/adminStore";
import { formatHumanDate, toISODate } from "@/lib/date";

export default function AdminTurnos() {
  const [dateISO, setDateISO] = useState(() => toISODate(new Date()));
  const [query, setQuery] = useState("");

  const services = useMemo(() => getServices(), []);
  const bookings = useMemo(() => getBookings(dateISO), [dateISO]);

  const human = useMemo(() => formatHumanDate(new Date(dateISO + "T00:00:00")), [dateISO]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = bookings.filter((b) => {
      if (!q) return true;
      const s = services.find((x) => x.id === b.serviceId)?.name ?? "";
      return (
        s.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.time.includes(q)
      );
    });

    const map = new Map<string, typeof filtered>();
    for (const b of filtered) {
      const key = b.serviceId;
      map.set(key, [...(map.get(key) ?? []), b]);
    }

    return Array.from(map.entries()).map(([sid, list]) => ({
      serviceId: sid,
      serviceName: services.find((s) => s.id === sid)?.name ?? "Servicio",
      items: list.sort((a, b) => a.time.localeCompare(b.time)),
    }));
  }, [bookings, query, services]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Turnos" subtitle="Gestión de turnos por día." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-end">
            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Fecha</div>
              <Input
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
                className="rounded-2xl"
              />
              <div className="text-xs text-zinc-500 capitalize">{human}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Buscar</div>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Servicio, cliente, teléfono u hora…"
                className="rounded-2xl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {grouped.map((g) => (
        <Card key={g.serviceId} className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="text-base font-semibold text-zinc-900">{g.serviceName}</div>

            <div className="mt-4 grid gap-3">
              {g.items.map((t) => (
                <div key={t.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-pink-600" />
                        <div className="text-lg font-semibold text-zinc-900">{t.time}</div>
                      </div>

                      <div className="mt-2 text-sm text-zinc-700">
                        {t.customerName} <span className="text-zinc-400">·</span> {t.customerPhone}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full",
                            t.paid ? "border-emerald-300 text-emerald-700" : "border-zinc-300 text-zinc-600"
                          )}
                        >
                          {t.paid ? "Pagado" : "Sin pago"}
                        </Badge>

                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full",
                            t.confirmed ? "border-pink-300 text-pink-700" : "border-zinc-300 text-zinc-600"
                          )}
                        >
                          {t.confirmed ? "Confirmado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="rounded-2xl">
                        <MessageSquareText className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl"
                        onClick={() => updateBooking(t.id, { paid: !t.paid })}
                      >
                        <Banknote className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-2xl"
                        onClick={() => deleteBooking(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {g.items.length === 0 && (
                <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                  No hay turnos para este servicio.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {grouped.length === 0 && (
        <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
          No hay turnos para esta fecha.
        </div>
      )}
    </div>
  );
}
