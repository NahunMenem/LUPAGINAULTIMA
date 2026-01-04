
//components/admin/servicios/ServicioForm.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createService, getService, updateService } from "@/lib/adminStore";

export default function ServicioForm({ mode, id }: { mode: "create" | "edit"; id?: string }) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("50");
  const [active, setActive] = useState(true);

  const title = useMemo(() => (isEdit ? "Editar servicio" : "Nuevo servicio"), [isEdit]);

  useEffect(() => {
    if (!isEdit || !id) return;
    const s = getService(id);
    if (!s) return;
    setName(s.name);
    setDesc(s.description ?? "");
    setDuration(String(s.durationMin));
    setActive(s.active);
  }, [isEdit, id]);

  return (
    <div className="grid gap-6">
      <SectionTitle title={title} subtitle="Datos básicos del servicio." />

      <Card className="rounded-3xl border bg-white/70 shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Nombre</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Descripción (opcional)</div>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-2xl" />
            </div>

            <div className="grid gap-2 md:max-w-xs">
              <div className="text-sm font-medium text-zinc-900">Duración (min)</div>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="rounded-2xl"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border bg-white p-4">
              <div>
                <div className="text-sm font-medium text-zinc-900">Activo</div>
                <div className="text-xs text-zinc-500">Si está inactivo no se ofrece en el sistema.</div>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/servicios">
                <Button variant="outline" className="rounded-2xl">
                  Volver
                </Button>
              </Link>
              <Button
                className="rounded-2xl bg-pink-600 text-white hover:bg-pink-700"
                onClick={() => {
                  const durationMin = Math.max(5, Number(duration || 0));
                  if (!name.trim()) return;

                  if (isEdit && id) {
                    updateService(id, { name: name.trim(), description: desc.trim() || undefined, durationMin, active });
                  } else {
                    createService({ name: name.trim(), description: desc.trim() || undefined, durationMin, active });
                  }

                  window.location.href = "/admin/servicios";
                }}
              >
                Guardar servicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
