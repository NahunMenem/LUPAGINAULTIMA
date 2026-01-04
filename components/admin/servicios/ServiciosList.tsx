//components/admin/servicios/ServiciosList.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteService, getServices, type Service } from "@/lib/adminStore";

export default function ServiciosList() {
  const [items, setItems] = useState<Service[]>([]);
  const [q, setQ] = useState("");

  const load = () => setItems(getServices());

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((x) => x.name.toLowerCase().includes(s) || (x.description ?? "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div className="grid gap-6">
      <SectionTitle title="Servicios" subtitle="Creá, editá y gestioná los servicios del sistema." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar servicio…"
              className="max-w-xl rounded-2xl"
            />
            <Link href="/admin/servicios/nuevo">
              <Button className="rounded-2xl bg-pink-600 text-white hover:bg-pink-700">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo servicio
              </Button>
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {filtered.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-base font-semibold text-zinc-900">{s.name}</div>
                    <Badge variant="outline" className="rounded-full">
                      {s.durationMin} min
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`rounded-full ${s.active ? "border-emerald-300 text-emerald-700" : "border-zinc-300 text-zinc-600"}`}
                    >
                      {s.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  {s.description && <div className="mt-1 text-sm text-zinc-500">{s.description}</div>}
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/admin/servicios/${s.id}`}>
                    <Button variant="outline" className="rounded-2xl">
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={() => {
                      deleteService(s.id);
                      load();
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                No hay servicios para mostrar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
