//components/admin/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    document.cookie = "js_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.replace("/admin/login");
  };

  return (
    <Button variant="outline" className="rounded-2xl" onClick={logout}>
      Cerrar sesión
    </Button>
  );
}
