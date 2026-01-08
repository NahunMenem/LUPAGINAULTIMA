
export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(min: number) {
  const h = String(Math.floor(min / 60)).padStart(2, "0");
  const m = String(min % 60).padStart(2, "0");
  return `${h}:${m}`;
}

export function generateSlots(from: string, to: string, durationMin: number, stepMin?: number) {
  const start = timeToMinutes(from);
  const end = timeToMinutes(to);
  const step = stepMin ?? durationMin;

  const out: string[] = [];
  for (let m = start; m + durationMin <= end; m += step) {
    out.push(minutesToTime(m));
  }
  return out;
}
