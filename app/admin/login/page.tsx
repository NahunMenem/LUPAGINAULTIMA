// app/admin/login/page.tsx
import { Suspense } from "react";
import AdminLogin from "@/components/admin/auth/AdminLogin";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[linear-gradient(180deg,#fff,#ffe7f2)]" />}>
      <AdminLogin />
    </Suspense>
  );
}
