"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function AdminTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
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
