// components/admin/AdminTopbar.tsx
"use client";

import { Calendar } from "lucide-react";
import { formatHumanDate } from "@/lib/date";

export default function AdminTopbar({ title }: { title: string }) {
  const human = formatHumanDate(new Date());

  return (
    <header className="px-4 py-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xl font-semibold text-zinc-900">{title}</div>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-600">
            <Calendar className="h-4 w-4 text-pink-600" />
            <span className="capitalize">{human}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
