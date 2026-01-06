//components/admin/horarios/HorarioForms.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import SectionTitle from "@/components/admin/ui/SectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { WEEKDAYS } from "@/lib/date";
import { crearHorario, listServicios, type Service } from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HorarioForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string>("");
  const [weekday, setWeekday] = useState<string>("0");
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("13:00");
  const [saving, setSaving] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const list = await listServicios();
        setServices(list);
        setServiceId(String(list[0]?.id ?? ""));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "No se pudieron cargar servicios");
      }
    };
    run();
  }, []);

  const service = useMemo(
    () => services.find((s) => String(s.id) === serviceId) ?? null,
    [services, serviceId]
  );

  const openConfirm = () => {
    if (!serviceId || !service) {
      toast.error("⚠️ Seleccioná un servicio");
      return;
    }
    if (!from.trim() || !to.trim()) {
      toast.error("⚠️ Completá hora inicio y fin");
      return;
    }
    setConfirmOpen(true);
  };

  const save = async () => {
    if (!serviceId || !service) return;
    if (!from.trim() || !to.trim()) return;

    setSaving(true);
    try {
      await crearHorario({
        servicio_id: Number(serviceId),
        dia_semana: Number(weekday),
        hora_inicio: from,
        hora_fin: to,
      });

      toast.success("✅ Horario guardado");
      window.location.href = `/admin/horarios/${serviceId}`;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  const cardBase =
    "rounded-3xl border border-white/40 bg-white/65 shadow-[0_10px_30px_-18px_rgba(0,0,0,.35)] backdrop-blur";

  const inputBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 focus-visible:ring-2 focus-visible:ring-emerald-500/35 focus-visible:border-emerald-400/60";

  const outlineBtn =
    "rounded-2xl border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 active:!bg-zinc-200";

  const primaryGreenBtn =
    "rounded-2xl bg-emerald-500 text-white shadow-sm " +
    "hover:!bg-emerald-600 hover:shadow active:!bg-emerald-700";

  const selectTriggerBase =
    "rounded-2xl bg-white/90 shadow-sm border-zinc-200/80 " +
    "focus:ring-2 focus:ring-emerald-500/35 focus:border-emerald-400/60";

  return (
    <div className="grid gap-6">
      <SectionTitle
        title="Nuevo horario"
        subtitle="Configurá un rango para un servicio y un día de la semana."
      />

      <Card className={cardBase}>
        <CardContent className="p-4 md:p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Servicio</div>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger className={cn(selectTriggerBase)}>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.nombre} · {s.duracion_minutos} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-medium text-zinc-900">Día</div>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger className={cn(selectTriggerBase)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((d, i) => (
                    <SelectItem key={d} value={String(i)}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Hora inicio</div>
                <Input
                  type="time"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-900">Hora fin</div>
                <Input
                  type="time"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/admin/horarios">
                <Button variant="outline" className={outlineBtn}>
                  Volver
                </Button>
              </Link>

              <Button className={primaryGreenBtn} onClick={openConfirm} disabled={saving}>
                {saving ? "Guardando..." : "Guardar horario"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar horario</AlertDialogTitle>
            <AlertDialogDescription>
              Vas a crear un horario para este servicio. ¿Querés continuar?
              <div className="mt-3 rounded-2xl border bg-white/70 p-3 text-sm text-zinc-700">
                <div className="font-semibold text-zinc-900">{service?.nombre ?? "Servicio"}</div>
                <div className="mt-1">
                  {WEEKDAYS[Number(weekday)]} • {from} - {to}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-full" disabled={saving}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction className={cn("rounded-full", primaryGreenBtn)} onClick={save} disabled={saving}>
              {saving ? "Guardando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
