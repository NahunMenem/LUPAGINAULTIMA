// components/admin/AdminShell.tsx
"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

const TITLES: Record<string, string> = {
  "/admin/turnos": "Turnos",
  "/admin/servicios": "Servicios",
  "/admin/horarios": "Horarios",
  "/admin/disponibilidad": "Disponibilidad",
  "/admin/caja": "Caja",
};

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const title = useMemo(() => {
    const key = Object.keys(TITLES).find((k) => pathname?.startsWith(k));
    return key ? TITLES[key] : "Admin";
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(255,105,180,0.10),transparent_60%),radial-gradient(900px_circle_at_90%_10%,rgba(255,182,193,0.10),transparent_55%)]">
      <div className="grid w-full grid-cols-1 md:grid-cols-[auto_1fr]">
        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="min-w-0">
          <AdminTopbar title={title} />
          <main className="px-4 pb-8 md:px-6">
            <div className="rounded-3xl border bg-white/70 p-4 shadow-sm backdrop-blur md:p-6 md:max-w-[1200px] md:mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
