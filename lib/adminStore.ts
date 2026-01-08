//lib/adminStore.ts
// lib/adminStore.ts
import { toISODate } from "@/lib/date";
import { generateSlots } from "@/lib/slots";

export type Service = {
  id: string;
  name: string;
  description?: string;
  durationMin: number;
  active: boolean;
};

export type ScheduleRule = {
  id: string;
  serviceId: string;
  weekday: number; // Backend/JS: 0=Domingo ... 6=Sábado
  from: string;
  to: string;
};

export type Booking = {
  id: string;
  serviceId: string;
  dateISO: string;
  time: string;
  customerName: string;
  customerPhone: string;
  confirmed: boolean;
  paid: boolean;
  notes?: string;
  createdAt: number;
};

type DB = {
  services: Service[];
  rules: ScheduleRule[];
  bookings: Booking[];
};

const KEY = "js_admin_db_v1";

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

/**
 * ISO (YYYY-MM-DD) -> weekday estilo JS / backend común:
 * 0=Domingo ... 6=Sábado
 */
function weekdayFromISO_Backend(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.getDay();
}

function seed(): DB {
  const s1: Service = {
    id: uid(),
    name: "Uñas",
    description: "Servicio de uñas",
    durationMin: 30,
    active: true,
  };
  const s2: Service = {
    id: uid(),
    name: "Criolipólisis",
    durationMin: 50,
    active: true,
  };
  const s3: Service = {
    id: uid(),
    name: "Micropigmentación",
    durationMin: 50,
    active: true,
  };

  const today = toISODate(new Date());

  // ⚠️ Estos weekdays ahora son JS-style:
  // 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
  // Ajustalos si querés que el seed caiga en días específicos.
  const rules: ScheduleRule[] = [
    { id: uid(), serviceId: s3.id, weekday: 1, from: "09:00", to: "13:00" }, // Lunes
    { id: uid(), serviceId: s3.id, weekday: 3, from: "09:00", to: "13:00" }, // Miércoles
  ];

  const bookings: Booking[] = [
    {
      id: uid(),
      serviceId: s3.id,
      dateISO: today,
      time: "09:00",
      customerName: "Pepe",
      customerPhone: "3863456987",
      confirmed: true,
      paid: false,
      createdAt: Date.now(),
    },
  ];

  return { services: [s1, s2, s3], rules, bookings };
}

function readDB(): DB {
  if (typeof window === "undefined") return seed();

  const raw = localStorage.getItem(KEY);
  if (!raw) {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }

  try {
    return JSON.parse(raw) as DB;
  } catch {
    const s = seed();
    localStorage.setItem(KEY, JSON.stringify(s));
    return s;
  }
}

function writeDB(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function getServices() {
  const db = readDB();
  return db.services;
}

export function getService(id: string) {
  const db = readDB();
  return db.services.find((s) => s.id === id) ?? null;
}

export function createService(data: Omit<Service, "id">) {
  const db = readDB();
  const s: Service = { ...data, id: uid() };
  db.services.unshift(s);
  writeDB(db);
  return s;
}

export function updateService(id: string, patch: Partial<Omit<Service, "id">>) {
  const db = readDB();
  db.services = db.services.map((s) => (s.id === id ? { ...s, ...patch } : s));
  writeDB(db);
}

export function deleteService(id: string) {
  const db = readDB();
  db.services = db.services.filter((s) => s.id !== id);
  db.rules = db.rules.filter((r) => r.serviceId !== id);
  db.bookings = db.bookings.filter((b) => b.serviceId !== id);
  writeDB(db);
}

export function getRules(serviceId?: string) {
  const db = readDB();
  return serviceId ? db.rules.filter((r) => r.serviceId === serviceId) : db.rules;
}

export function createRule(data: Omit<ScheduleRule, "id">) {
  const db = readDB();
  const r: ScheduleRule = { ...data, id: uid() };
  db.rules.unshift(r);
  writeDB(db);
  return r;
}

export function deleteRule(id: string) {
  const db = readDB();
  db.rules = db.rules.filter((r) => r.id !== id);
  writeDB(db);
}

export function getBookings(dateISO?: string) {
  const db = readDB();
  const list = dateISO ? db.bookings.filter((b) => b.dateISO === dateISO) : db.bookings;
  return list.sort((a, b) => a.time.localeCompare(b.time));
}

export function createBooking(data: Omit<Booking, "id" | "createdAt">) {
  const db = readDB();
  const b: Booking = { ...data, id: uid(), createdAt: Date.now() };
  db.bookings.unshift(b);
  writeDB(db);
  return b;
}

export function updateBooking(id: string, patch: Partial<Omit<Booking, "id">>) {
  const db = readDB();
  db.bookings = db.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b));
  writeDB(db);
}

export function deleteBooking(id: string) {
  const db = readDB();
  db.bookings = db.bookings.filter((b) => b.id !== id);
  writeDB(db);
}

export function computeAvailability(serviceId: string, dateISO: string) {
  const db = readDB();
  const service = db.services.find((s) => s.id === serviceId);
  if (!service) return { slots: [] as string[], taken: [] as string[] };

  // ✅ Backend/JS weekday (0=Domingo..6=Sábado)
  const w = weekdayFromISO_Backend(dateISO);

  const rules = db.rules.filter((r) => r.serviceId === serviceId && r.weekday === w);

  const allSlots = rules.flatMap((r) =>
    generateSlots(r.from, r.to, service.durationMin, service.durationMin)
  );

  const taken = db.bookings
    .filter((b) => b.serviceId === serviceId && b.dateISO === dateISO)
    .map((b) => b.time);

  const slots = allSlots.filter((s) => !taken.includes(s));
  return { slots, taken };
}

export function computeCashRange(fromISO: string, toISO: string) {
  const db = readDB();
  const from = new Date(fromISO + "T00:00:00").getTime();
  const to = new Date(toISO + "T23:59:59").getTime();

  const inRange = db.bookings.filter((b) => {
    const t = new Date(b.dateISO + "T00:00:00").getTime();
    return t >= from && t <= to;
  });

  const attended = inRange.filter((b) => b.confirmed).length;

  return { inRange, attended };
}
