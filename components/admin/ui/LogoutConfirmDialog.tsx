"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

export default function LogoutConfirmDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
      <AlertDialogContent className="rounded-3xl border border-white/40 bg-white/90 shadow-xl backdrop-blur">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3 text-zinc-900">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-pink-500/10 ring-1 ring-pink-500/20">
              <LogOut className="h-4 w-4 text-pink-700" />
            </span>
            ¿Cerrar sesión?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-600">
            Vas a salir del panel admin. ¿Querés continuar?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            type="button"
            className="
              rounded-2xl border border-zinc-200 bg-white/80 text-zinc-900 shadow-sm transition
              !hover:bg-zinc-200/50 !hover:text-zinc-900 !hover:border-zinc-600
              active:scale-[0.99]
              focus-visible:ring-2 focus-visible:ring-pink-500/35 focus-visible:ring-offset-0
            "
          >
            No
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            onClick={props.onConfirm}
            className="
              rounded-2xl bg-pink-600 text-white shadow-sm transition
              !hover:bg-pink-700 !hover:text-white
              active:scale-[0.99]
              focus-visible:ring-2 focus-visible:ring-pink-500/35 focus-visible:ring-offset-0
            "
          >
            Sí, cerrar sesión
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
