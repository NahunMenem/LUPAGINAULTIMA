//components/admin/servicios/ServiciosList.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Search } from "lucide-react";
import { listServicios, type Service } from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";

export default function ServiciosList() {
  const [items, setItems] = useState<Service[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listServicios();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error cargando servicios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (x) =>
        x.nombre.toLowerCase().includes(s) ||
        (x.descripcion ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const inputBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:border-pink-400/60";

  const outlineBtn =
    "rounded-2xl border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 active:!bg-zinc-200";

  const primaryBtn =
    "rounded-2xl bg-pink-600 text-white shadow-sm " +
    "hover:!bg-pink-700 hover:shadow active:!bg-pink-800";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Servicios"
        subtitle="Creá, editá y gestioná los servicios del sistema."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar servicio…"
                className={cn(inputBase, "pl-9 placeholder:text-zinc-400")}
              />
            </div>

            <Link href="/admin/servicios/nuevo">
              <Button className={primaryBtn}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo servicio
              </Button>
            </Link>
          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-5 grid gap-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                Cargando…
              </div>
            ) : (
              filtered.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/85 p-4 shadow-sm"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-base font-semibold text-zinc-900">
                        {s.nombre}
                      </div>

                      <Badge
                        variant="outline"
                        className="rounded-full border-zinc-300/70 bg-white text-zinc-700"
                      >
                        {s.duracion_minutos} min
                      </Badge>

                      <Badge
                        variant="outline"
                        className="rounded-full border-zinc-300/70 bg-white text-zinc-700"
                      >
                        ${s.precio}
                      </Badge>
                    </div>

                    {s.descripcion && (
                      <div className="mt-1 text-sm text-zinc-600">
                        {s.descripcion}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/admin/servicios/${s.id}`}>
                      <Button variant="outline" className={outlineBtn}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}

            {!loading && filtered.length === 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
                No hay servicios para mostrar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
