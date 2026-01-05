//components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Wallet,
  Clock3,
  Sparkles,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LogOut,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import LogoutConfirmDialog from "@/components/admin/ui/LogoutConfirmDialog";

type Props = {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

const NAV = [
  { href: "/admin/turnos", label: "Turnos", icon: CalendarDays },
  { href: "/admin/servicios", label: "Servicios", icon: Sparkles },
  { href: "/admin/horarios", label: "Horarios", icon: Clock3 },
  { href: "/admin/disponibilidad", label: "Disponibilidad", icon: LayoutGrid },
  { href: "/admin/caja", label: "Caja", icon: Wallet },
];

function NavList({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="grid gap-1">
      {NAV.map((item) => {
        const active = pathname?.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link key={item.href} href={item.href} className="block">
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition",
                "cursor-pointer select-none",
                active
                  ? "bg-pink-500/15 text-pink-700 ring-1 ring-pink-500/20"
                  : "text-zinc-700 hover:bg-zinc-900/5 hover:text-zinc-900"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  active ? "text-pink-600" : "text-zinc-500"
                )}
              />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function AdminSidebar({ collapsed, setCollapsed }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doLogout = () => {
    document.cookie = "js_role=; path=/; max-age=0";

    try {
      sessionStorage.clear();
    } catch {}

    toast.success("Sesión cerrada");
    router.replace("/");
  };

  const desktopBase =
    "sticky top-0 hidden h-dvh border-r border-white/30 bg-white/70 backdrop-blur md:block";

  const outlineNice =
    "rounded-2xl border border-zinc-200 bg-white/90 text-zinc-900 shadow-sm " +
    "hover:bg-zinc-50 hover:text-zinc-900";

  const ghostNice =
    "rounded-2xl text-zinc-700 hover:bg-zinc-900/5 hover:text-zinc-900";

  return (
    <>
      <LogoutConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={doLogout}
      />

      {/* DESKTOP */}
      <aside className={cn(desktopBase, collapsed ? "w-[92px]" : "w-[292px]")}>
        <div className="flex h-full flex-col p-3">
          <div
            className={cn(
              "flex items-center justify-between gap-3",
              collapsed && "justify-center"
            )}
          >
            <div className={cn("flex items-center gap-3", collapsed && "hidden")}>
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[linear-gradient(135deg,rgba(255,105,180,0.35),rgba(255,182,193,0.35))] ring-1 ring-pink-500/20">
                <span className="text-sm font-semibold text-pink-700">JS</span>
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-zinc-900">
                  Julieta Studio
                </div>
                <div className="text-xs text-zinc-500">Panel admin</div>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={ghostNice}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="mt-6">
            <div
              className={cn(
                "mb-3 text-xs font-medium tracking-widest text-zinc-400",
                collapsed && "text-center"
              )}
            >
              ADMIN
            </div>

            <div className={cn("mb-4", collapsed && "mb-3")}>
              <div className="h-px w-full bg-zinc-200/60" />
            </div>

            <NavList collapsed={collapsed} />
          </div>

          <div className="mt-auto grid gap-3 pb-4 pt-6">
            <Button
              variant="outline"
              className={cn(
                outlineNice,
                "justify-start",
                collapsed && "justify-center px-0"
              )}
              onClick={() => setConfirmOpen(true)}
            >
              <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
              {!collapsed && "Cerrar sesión"}
            </Button>

            {!collapsed && (
              <div className="text-center text-xs text-zinc-400">
                © {new Date().getFullYear()} Julieta Studio
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* MOBILE */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 px-4 pt-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(outlineNice, "h-10 w-10")}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[320px] p-0">
              <div className="h-full bg-white">
                <div className="flex items-center justify-between border-b border-zinc-200/60 p-4">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">
                      Julieta Studio
                    </div>
                    <div className="text-xs text-zinc-500">Panel admin</div>
                  </div>

                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(ghostNice, "h-10 w-10")}
                      aria-label="Cerrar sidebar"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                <div className="grid gap-4 p-4 pt-6">
                  <NavList collapsed={false} />

                  <div className="h-px w-full bg-zinc-200/60" />

                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className={cn(outlineNice, "justify-start")}
                      onClick={() => setConfirmOpen(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </SheetClose>

                  <div className="pt-1 text-center text-xs text-zinc-400">
                    © {new Date().getFullYear()} Julieta Studio
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="text-sm font-semibold text-zinc-900">Admin</div>
        </div>
      </div>
    </>
  );
}
