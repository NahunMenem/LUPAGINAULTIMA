//componests/admin/horarios/HorariosEditor.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { WEEKDAYS, toISODate } from "@/lib/date";
import {
  horariosServicio,
  listServicios,
  listTurnos,
  eliminarHorario,
  crearHorario,
  type Horario,
  type Service,
  type Turno,
  hhmm,
} from "@/lib/apiTurnos";

export default function HorariosEditor({ serviceId }: { serviceId: string }) {
  const [service, setService] = useState<Service | null>(null);
  const [rules, setRules] = useState<Horario[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);

  const todayISO = toISODate(new Date());

  const load = async () => {
    setLoading(true);
    try {
      const [sv, hs, ts] = await Promise.all([
        listServicios(),
        horariosServicio(Number(serviceId)),
        listTurnos(),
      ]);

      setService(sv.find((x) => String(x.id) === String(serviceId)) ?? null);
      setTurnos(ts);

      setRules(
        hs.sort(
          (a, b) =>
            a.dia_semana - b.dia_semana ||
            hhmm(a.hora_inicio).localeCompare(hhmm(b.hora_inicio))
        )
      );
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudieron cargar los horarios"
      );
      setRules([]);
      setTurnos([]);
      setService(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId]);

  // 🔒 Bloquea borrar si hay turnos futuros dentro del rango del horario
  const horarioTieneTurnosFuturos = (h: Horario) => {
    const inicio = hhmm(h.hora_inicio);
    const fin = hhmm(h.hora_fin);

    return turnos.some((t) => {
      if (Number(t.servicio_id) !== Number(h.servicio_id)) return false;
      if (t.fecha < todayISO) return false;

      const th = hhmm(t.hora);
      return th >= inicio && th < fin;
    });
  };

  // 🗑️ Delete + optimistic + rollback + undo
  const onDelete = async (h: Horario) => {
    const prev = rules;

    setRules((r) => r.filter((x) => x.id !== h.id));

    try {
      await eliminarHorario(h.id);

      toast.custom(
        (t) => (
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg">
            <span className="text-sm font-medium text-zinc-900">
              🗑️ Horario eliminado
            </span>

            <button
              className="text-sm font-semibold text-emerald-700 hover:underline"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const restored = await crearHorario({
                    servicio_id: h.servicio_id,
                    dia_semana: h.dia_semana,
                    hora_inicio: hhmm(h.hora_inicio),
                    hora_fin: hhmm(h.hora_fin),
                  });

                  setRules((r) =>
                    [...r, restored].sort(
                      (a, b) =>
                        a.dia_semana - b.dia_semana ||
                        hhmm(a.hora_inicio).localeCompare(hhmm(b.hora_inicio))
                    )
                  );

                  toast.success("✅ Horario restaurado");
                } catch {
                  toast.error("No se pudo restaurar el horario");
                }
              }}
            >
              Deshacer
            </button>
          </div>
        ),
        { duration: 10000 }
      );
    } catch (e) {
      setRules(prev); // rollback
      toast.error(
        e instanceof Error ? e.message : "No se pudo eliminar el horario"
      );
    }
  };

  const title = useMemo(
    () => `Horarios · ${service?.nombre ?? "Servicio"}`,
    [service?.nombre]
  );

  // ✅ Estilos “admin” (fijos, no dependen de foreground/dark)
  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const outlineBtn =
    "rounded-2xl border-zinc-200 bg-white text-zinc-900 shadow-sm hover:bg-zinc-100 hover:text-zinc-900";

  const primaryGreenBtn =
    "rounded-2xl bg-emerald-500 text-white shadow-sm hover:bg-emerald-600";

  const rowBase =
    "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/90 p-4 shadow-sm";

  const dayText = "text-sm font-semibold text-zinc-900";
  const metaText = "text-xs text-zinc-600";

  const rangeBadge =
    "rounded-full border border-zinc-300/70 bg-white text-zinc-800";

  const lockedBadge =
    "rounded-full bg-zinc-200 text-zinc-800 border border-zinc-300/60";

  const trashBtn =
    "rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title={title}
        subtitle="Rangos configurados por día para este servicio."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/horarios">
              <Button variant="outline" className={outlineBtn}>
                Volver
              </Button>
            </Link>

            <Link href="/admin/horarios/nuevo">
              <Button className={primaryGreenBtn}>Nuevo horario</Button>
            </Link>
          </div>

          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 text-sm text-zinc-700">
                Cargando…
              </div>
            ) : rules.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 text-sm text-zinc-700">
                No hay horarios configurados.
              </div>
            ) : (
              rules.map((r) => {
                const blocked = horarioTieneTurnosFuturos(r);

                return (
                  <div key={r.id} className={rowBase}>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={dayText}>{WEEKDAYS[r.dia_semana]}</div>

                      <Badge variant="outline" className={rangeBadge}>
                        {hhmm(r.hora_inicio)} – {hhmm(r.hora_fin)}
                      </Badge>

                      {blocked && (
                        <Badge className={lockedBadge}>🔒 Tiene turnos</Badge>
                      )}

                      {!blocked && (
                        <span className={metaText}>Se puede eliminar</span>
                      )}
                    </div>

                    {!blocked && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(r)}
                        className={trashBtn}
                        title="Eliminar horario"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
