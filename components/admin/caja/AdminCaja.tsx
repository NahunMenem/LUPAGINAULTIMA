//components/admin/caja/AdminCaja.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toISODate } from "@/lib/date";
import { getCaja, type CajaResp } from "@/lib/apiTurnos";

export default function AdminCaja() {
  const [fromISO, setFromISO] = useState(() => toISODate(new Date()));
  const [toISO, setToISO] = useState(() => toISODate(new Date()));
  const [data, setData] = useState<CajaResp | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCaja(fromISO, toISO);
      setData(res);
    } finally {
      setLoading(false);
    }
  }, [fromISO, toISO]);

  useEffect(() => {
    load();
  }, [load]);

  const total = useMemo(() => data?.total_general ?? 0, [data]);

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const inputBase =
    "rounded-2xl bg-white/90 text-zinc-900 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-pink-500/35 focus-visible:border-pink-400/60 dark:text-zinc-900 dark:[color-scheme:light]";

  const badgeMoney =
    "rounded-full border-zinc-300/70 bg-white text-zinc-800 shadow-sm " +
    "hover:!bg-zinc-50 hover:!text-zinc-900";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Caja"
        subtitle="Resumen real de pagos y servicios del período seleccionado."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Desde</div>
              <Input
                type="date"
                value={fromISO}
                onChange={(e) => setFromISO(e.target.value)}
                className={inputBase}
              />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold text-zinc-900">Hasta</div>
              <Input
                type="date"
                value={toISO}
                onChange={(e) => setToISO(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
              Cargando…
            </div>
          ) : !data ? (
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
              Sin datos.
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-pink-200/70 bg-pink-50/70 p-4 shadow-sm">
                  <div className="text-sm text-zinc-700">Total general</div>
                  <div className="mt-2 text-3xl font-semibold text-pink-700">
                    ${total}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 shadow-sm">
                  <div className="text-sm text-zinc-700">Turnos en período</div>
                  <div className="mt-2 text-3xl font-semibold text-emerald-700">
                    {data.total_turnos}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="grid gap-3">
                  <div className="text-sm font-semibold text-zinc-900">
                    Total por método
                  </div>

                  {data.total_por_metodo.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                      Sin pagos registrados.
                    </div>
                  ) : (
                    data.total_por_metodo.map((m) => (
                      <div
                        key={m.metodo}
                        className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm"
                      >
                        <div className="text-sm font-medium text-zinc-900 capitalize">
                          {m.metodo}
                        </div>

                        <Badge variant="outline" className={badgeMoney}>
                          ${m.total}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>

                <div className="grid gap-3">
                  <div className="text-sm font-semibold text-zinc-900">
                    Servicios más solicitados
                  </div>

                  {data.servicios_mas_solicitados.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                      Sin datos.
                    </div>
                  ) : (
                    data.servicios_mas_solicitados.map((s) => (
                      <div
                        key={s.servicio}
                        className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-zinc-900">
                            {s.servicio}
                          </div>
                          <div className="text-xs text-zinc-600">
                            {s.cantidad} turnos
                          </div>
                        </div>

                        <div className="text-sm font-semibold text-pink-700">
                          {s.porcentaje}%
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

