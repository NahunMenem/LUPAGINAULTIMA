//components/admin/servicios/ServicioForm.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  crearServicio,
  editarServicio,
  listServicios,
  type Service,
} from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";

export default function ServicioForm({
  mode,
  id,
}: {
  mode: "create" | "edit";
  id?: string;
}) {
  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("50");
  const [price, setPrice] = useState("0");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  const title = useMemo(
    () => (isEdit ? "Editar servicio" : "Nuevo servicio"),
    [isEdit]
  );

  useEffect(() => {
    const run = async () => {
      if (!isEdit || !id) return;
      setLoading(true);
      try {
        const list = await listServicios();
        const s = list.find((x) => String(x.id) === String(id)) as
          | Service
          | undefined;
        if (!s) return;
        setName(s.nombre);
        setDesc(s.descripcion ?? "");
        setDuration(String(s.duracion_minutos));
        setPrice(String(s.precio));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [isEdit, id]);

  const save = async () => {
    const dur = Math.max(5, Number(duration || 0));
    const pr = Math.max(0, Number(price || 0));

    if (!name.trim()) return;

    setSaving(true);
    try {
      if (isEdit && id) {
        await editarServicio(Number(id), {
          nombre: name.trim(),
          descripcion: desc.trim() || null,
          duracion_minutos: dur,
          precio: pr,
        });
      } else {
        await crearServicio({
          nombre: name.trim(),
          descripcion: desc.trim() || null,
          duracion_minutos: dur,
          precio: pr,
        });
      }

      window.location.href = "/admin/servicios";
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";
  const inputBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:border-pink-400/60";

  return (
    <div className="grid gap-6">
      <SectionTitle title={title} subtitle="Datos básicos del servicio." />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
              Cargando…
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Nombre</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(inputBase, "placeholder:text-zinc-400")}
                  placeholder="Ej: Microblading"
                />
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">
                  Descripción (opcional)
                </div>
                <Textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className={cn(
                    "min-h-[110px]",
                    inputBase,
                    "placeholder:text-zinc-400"
                  )}
                  placeholder="Descripción breve del servicio…"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2 md:max-w-xl">
                <div className="grid gap-2">
                  <div className="text-sm font-medium text-zinc-900">
                    Duración (min)
                  </div>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputBase}
                    inputMode="numeric"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="text-sm font-medium text-zinc-900">Precio</div>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputBase}
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href="/admin/servicios">
                  <Button
                    variant="outline"
                    className="rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
                  >
                    Volver
                  </Button>
                </Link>

                <Button
                  className="rounded-2xl bg-pink-600 text-white shadow-sm hover:bg-pink-700"
                  onClick={save}
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar servicio"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
