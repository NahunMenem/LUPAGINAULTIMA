//lib/date.ts
export const WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Date → YYYY-MM-DD (para backend)
export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ISO (YYYY-MM-DD) → Date local
export function isoToLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

// HH:MM:SS → HH:MM
export function toHHMM(h?: string | null) {
  if (!h) return "";
  return h.slice(0, 5);
}

// Limpia lista de horas del backend
export function normalizeSlots(data: unknown): string[] {
  const arr = Array.isArray(data) ? data : [];
  const clean = arr
    .map((h) => toHHMM(String(h)))
    .filter(Boolean);
  return Array.from(new Set(clean)).sort();
}

// Date → "jueves 12/03"
export function formatHumanDate(d: Date) {
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });
}
