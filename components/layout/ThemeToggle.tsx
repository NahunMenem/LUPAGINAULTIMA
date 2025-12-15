"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const isClient = useIsClient();

  if (!isClient) return null;

  const current = theme === "system" ? systemTheme : theme;
  const isDark = current === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-border bg-background/60 backdrop-blur hover:bg-accent"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Cambiar tema"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
