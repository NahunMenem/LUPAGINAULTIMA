
export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function formatHumanDate(d: Date) {
  return d.toLocaleDateString("es-AR", { weekday: "long", day: "2-digit", month: "2-digit" });
}

export function weekdayIndexFromISO(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const js = d.getDay();
  return js === 0 ? 6 : js - 1;
}

export const WEEKDAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
