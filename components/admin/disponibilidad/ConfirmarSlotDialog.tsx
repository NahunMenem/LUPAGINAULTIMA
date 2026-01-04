//components/admin/disponibilidad/ConfirmarSlotDialog.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/lib/adminStore";

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
  const [phone, setPhone] = useState("ADMIN");

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Confirmar turno</DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 text-sm text-zinc-700">
          <div>Servicio: {props.serviceName}</div>
          <div className="capitalize">Fecha: {props.dateHuman}</div>
          <div>Hora: {props.time}</div>
        </div>

        <div className="mt-4 grid gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl" placeholder="Nombre" />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-2xl" placeholder="Teléfono" />
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="ghost" className="rounded-2xl" onClick={() => props.onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600"
            onClick={() => {
              if (!props.serviceId) return;
              if (!props.dateISO) return;
              if (!props.time) return;

              createBooking({
                serviceId: props.serviceId,
                dateISO: props.dateISO,
                time: props.time,
                customerName: name.trim() || "Cliente",
                customerPhone: phone.trim() || "-",
                confirmed: true,
                paid: false,
              });

              props.onDone();
              props.onOpenChange(false);
            }}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
