//components/admin/horarios/HorariosServicios.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, RefreshCw } from "lucide-react";
import { listServicios, type Service } from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";

export default function HorariosServicios() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const list = await listServicios();
      setServices(list);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudieron cargar los servicios");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    run();
  }, []);

  const subtitle = useMemo(
    () => "Elegí un servicio para ver sus horarios configurados por día.",
    []
  );

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const primaryGreenBtn =
    "rounded-2xl bg-emerald-500 text-white shadow-sm " +
    "hover:!bg-emerald-600 hover:shadow active:!bg-emerald-700";

  const outlineBtn =
    "rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 active:!bg-zinc-200";

  return (
    <div className="grid gap-6">
      <SectionTitle title="Horarios" subtitle={subtitle} />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              className={outlineBtn}
              onClick={run}
              disabled={loading}
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
              {loading ? "Cargando..." : "Reintentar"}
            </Button>

            <Link href="/admin/horarios/nuevo">
              <Button className={primaryGreenBtn}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo horario
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                Cargando…
              </div>
            ) : (
              services.map((s) => (
                <Link key={s.id} href={`/admin/horarios/${s.id}`}>
                  <div className="group flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm transition hover:bg-white hover:shadow-md">
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-zinc-900">
                        {s.nombre}
                      </div>
                      <div className="text-sm text-zinc-600">
                        Duración: {s.duracion_minutos} min
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-600" />
                  </div>
                </Link>
              ))
            )}

            {!loading && services.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                No hay servicios activos.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
