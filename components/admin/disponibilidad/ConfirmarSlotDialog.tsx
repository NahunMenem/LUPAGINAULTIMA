//components/admin/disponibilidad/ConfirmarSlotDialog.tsx
"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reservarTurno } from "@/lib/apiTurnos";
import { cn } from "@/lib/utils";
import { toHHMM } from "@/lib/date";

export default function ConfirmarSlotDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  serviceName: string;
  dateHuman: string;
  dateISO: string;
  time: string;
  serviceId: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("ADMIN");
  const [phone, setPhone] = useState("5490000000000");
  const [saving, setSaving] = useState(false);

  const hora = useMemo(() => toHHMM(props.time), [props.time]);

  const confirm = async () => {
    if (!props.serviceId || !props.dateISO || !hora) {
      toast.error("Datos incompletos para reservar");
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      await reservarTurno({
        servicio_id: Number(props.serviceId),
        fecha: props.dateISO,
        hora,
        cliente_nombre: name.trim() || "Cliente",
        cliente_telefono: phone.trim() || "-",
      });

      toast.success("✅ Turno reservado correctamente");

      props.onDone();
      props.onOpenChange(false);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "No se pudo reservar el turno"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    "rounded-2xl bg-white/95 shadow-sm border-zinc-200/80 " +
    "focus-visible:ring-2 focus-visible:ring-emerald-500/30 " +
    "focus-visible:border-emerald-400/60";

  const outlineBtn =
    "rounded-2xl border-zinc-200 bg-white text-zinc-900 shadow-sm " +
    "hover:!bg-zinc-100 hover:!text-zinc-900 active:!bg-zinc-200";

  const primaryGreenBtn =
    "rounded-2xl bg-emerald-500 text-white shadow-sm " +
    "hover:!bg-emerald-600 hover:shadow active:!bg-emerald-700";

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Confirmar turno</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 text-sm text-zinc-700">
          <div>
            Servicio: <span className="font-semibold">{props.serviceName}</span>
          </div>
          <div className="capitalize">Fecha: {props.dateHuman}</div>
          <div>
            Hora: <span className="font-semibold">{hora}</span>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(inputBase, "placeholder:text-zinc-400")}
            placeholder="Nombre"
            disabled={saving}
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={cn(inputBase, "placeholder:text-zinc-400")}
            placeholder="Teléfono"
            disabled={saving}
          />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className={outlineBtn}
            onClick={() => props.onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button className={primaryGreenBtn} onClick={confirm} disabled={saving}>
            {saving ? "Confirmando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
