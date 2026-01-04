//components/admin/horarios/HorariosServicios.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServices, type Service } from "@/lib/adminStore";
import { ChevronRight, Plus } from "lucide-react";

export default function HorariosServicios() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getServices().filter((s) => s.active));
  }, []);

  const subtitle = useMemo(
    () => "Elegí un servicio para ver/editar sus horarios configurados por día.",
    []
  );

  return (
    <div className="grid gap-6">
      <SectionTitle title="Horarios" subtitle={subtitle} />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex justify-end">
            <Link href="/admin/horarios/nuevo">
              <Button className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo horario
              </Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {services.map((s) => (
              <Link key={s.id} href={`/admin/horarios/${s.id}`}>
                <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
                  <div>
                    <div className="text-base font-semibold text-zinc-900">{s.name}</div>
                    <div className="text-sm text-zinc-500">Duración: {s.durationMin} min</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-400" />
                </div>
              </Link>
            ))}

            {services.length === 0 && (
              <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-600">
                No hay servicios activos.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
