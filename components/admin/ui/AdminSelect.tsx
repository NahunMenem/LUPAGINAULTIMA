"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function AdminSelect({
  value,
  onValueChange,
  placeholder,
  children,
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "bg-white text-zinc-900 border-zinc-300 rounded-2xl",
          "focus:ring-pink-500/50 focus:border-pink-500"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="bg-white text-zinc-900">
        {children}
      </SelectContent>
    </Select>
  );
}

export { SelectItem };
