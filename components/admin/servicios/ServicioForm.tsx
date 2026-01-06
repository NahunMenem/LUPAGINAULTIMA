// components/admin/servicios/ServicioForm.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  crearServicio,
  editarServicio,
  getServicioById,
  type Service,
} from "@/lib/apiTurnos";

export default function ServicioForm({ mode }: { mode: "create" | "edit" }) {
  const params = useParams();
  const id = params?.id as string | undefined;

  const isEdit = mode === "edit";

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [duration, setDuration] = useState("50");
  const [price, setPrice] = useState("0");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(
    () => (isEdit ? "Editar servicio" : "Nuevo servicio"),
    [isEdit]
  );

  useEffect(() => {
    const run = async () => {
      if (!isEdit) return;

      if (!id) {
        setError("No se pudo obtener el ID del servicio desde la URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const s: Service = await getServicioById(Number(id));
        setName(s.nombre);
        setDesc(s.descripcion ?? "");
        setDuration(String(s.duracion_minutos));
        setPrice(String(s.precio));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error cargando servicio");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isEdit, id]);

  const save = async () => {
    const dur = Math.max(5, Number(duration || 0));
    const pr = Math.max(0, Number(price || 0));

    if (!name.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        if (!id) throw new Error("ID inválido.");

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

  // ✅ pisa el hover del variant="outline" (hover:bg-accent) y evita el blanco raro
  const outlineBtn =
    "rounded-2xl border border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 hover:!border-zinc-300 " +
    "active:!bg-zinc-200 active:!text-zinc-900";

  const primaryBtn =
    "rounded-2xl bg-pink-600 text-white shadow-sm " +
    "hover:!bg-pink-700 active:!bg-pink-800";

  const labelBase = "text-sm font-medium text-zinc-900";

  return (
    <div className="grid gap-6">
      <SectionTitle title={title} subtitle="Datos básicos del servicio." />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white/80 p-6 text-sm text-zinc-600">
              Cargando…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-rose-700">
              {error}
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className={labelBase}>Nombre</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(inputBase, "placeholder:text-zinc-400")}
                  placeholder="Ej: Micropigmentación"
                />
              </div>

              <div className="grid gap-2">
                <div className={labelBase}>Descripción</div>
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
                  <div className={labelBase}>Duración (min)</div>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputBase}
                    inputMode="numeric"
                    placeholder="Ej: 50"
                  />
                </div>

                <div className="grid gap-2">
                  <div className={labelBase}>Precio</div>
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputBase}
                    inputMode="numeric"
                    placeholder="Ej: 3000"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link href="/admin/servicios">
                  <Button variant="outline" className={outlineBtn}>
                    Volver
                  </Button>
                </Link>

                <Button className={primaryBtn} onClick={save} disabled={saving}>
                  {saving ? "Guardando…" : "Guardar servicio"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
