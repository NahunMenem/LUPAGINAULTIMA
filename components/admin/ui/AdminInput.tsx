"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function AdminInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      {...props}
      className={cn(
        "bg-white text-zinc-900 border-zinc-300",
        "placeholder:text-zinc-400",
        "focus-visible:ring-pink-500/50 focus-visible:border-pink-500",
        className
      )}
    />
  );
}
