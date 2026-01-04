//components/admin/auth/AdminLogin.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const unauthorized = sp.get("unauthorized") === "1";

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const disabled = useMemo(() => !email.trim() || !pass.trim() || loading, [email, pass, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ok = email === "admin@julieta.com" && pass === "admin123";

      if (!ok) {
        alert("Credenciales inválidas");
        return;
      }

      document.cookie = `js_role=admin; path=/; max-age=${60 * 60 * 24 * 7}`;
      router.replace("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-[linear-gradient(180deg,#fff,#ffe7f2)] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="text-2xl font-semibold text-zinc-900">Panel Admin</div>
          <div className="mt-1 text-sm text-zinc-600">Iniciá sesión para continuar</div>

          {unauthorized && (
            <div className="mt-3 rounded-2xl border border-pink-200 bg-white/70 p-3 text-sm text-pink-700">
              No tenés permisos. Iniciá sesión como admin.
            </div>
          )}
        </div>

        <Card className="rounded-3xl border bg-white/70 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-800">Email</div>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-2xl bg-white text-zinc-900 border-zinc-200 placeholder:text-zinc-400 focus-visible:ring-pink-500"
                />
              </div>

              <div className="grid gap-2">
                <div className="text-sm font-medium text-zinc-800">Contraseña</div>
                <Input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="rounded-2xl bg-white text-zinc-900 border-zinc-200 placeholder:text-zinc-400 focus-visible:ring-pink-500"
                />
              </div>

              <Button
                type="submit"
                className="rounded-2xl bg-pink-600 text-white hover:bg-pink-700"
                disabled={disabled}
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>

              <div className="text-center text-xs text-zinc-500">
                Demo: <span className="font-medium">admin@julieta.com</span> /{" "}
                <span className="font-medium">admin123</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
