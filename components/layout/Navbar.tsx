//compnents/layout/Navbar.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, UserRound, LogOut } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const nav = useMemo(() => siteConfig.nav, []);

  const isAdminRoute = pathname?.startsWith("/admin");
  const role = getCookie("js_role");
  const isAdmin = role === "admin";

  const handleLogout = () => {
    deleteCookie("js_role");
    setOpen(false);
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="relative h-9 w-9 overflow-hidden rounded-xl border bg-white">
            <Image
              src="/logo.jpg"
              alt="Julieta Studio"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>

          <div className="leading-tight">
            <p className="font-(family-name:--font-pinyon) text-[20px] leading-none">Julieta Studio</p>
            <p className="text-xs tracking-wide text-muted-foreground">Estética • Beauty</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex font-(family-name:--font-poppins)">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 font-(family-name:--font-poppins)">
          <Button asChild className="hidden rounded-full md:inline-flex font-medium">
            <Link href="/turnos">Reservar turno</Link>
          </Button>

          {/* Admin/Salir (solo desktop, oculto dentro del panel admin) */}
          {!isAdminRoute && (
            <>
              {isAdmin ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/40 text-muted-foreground transition hover:bg-background/70 hover:text-foreground"
                  aria-label="Cerrar sesión admin"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  href="/admin/login"
                  className="hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/40 text-muted-foreground transition hover:bg-background/70 hover:text-foreground"
                  aria-label="Panel admin"
                  title="Admin"
                >
                  <UserRound className="h-5 w-5" />
                </Link>
              )}
            </>
          )}

          <ThemeToggle />

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={[
              "md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border",
              "bg-background/70 backdrop-blur transition",
              "hover:bg-background/90",
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
            ].join(" ")}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden border-t bg-background/80 backdrop-blur">
          <div className="container-page py-4 font-(family-name:--font-poppins)">
            <div className="grid gap-1">
              {nav.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "rounded-2xl px-3 py-3 text-sm font-medium transition",
                      active
                        ? "bg-(--hero-bg) text-foreground"
                        : "text-muted-foreground hover:bg-(--hero-bg) hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4">
              <Button asChild className="w-full rounded-full font-medium">
                <Link href="/turnos" onClick={() => setOpen(false)}>
                  Reservar turno
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
