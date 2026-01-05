
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      className={cn(
        "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100",
        className
      )}
    />
  );
}
