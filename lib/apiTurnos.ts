export const API_BASE =
  process.env.NEXT_PUBLIC_TURNOS_API_BASE || "https://turnoslu-production.up.railway.app";

type ApiError = { detail?: string };

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `Error ${res.status}`;
    try {
      const data = (await res.json()) as ApiError;
      if (data?.detail) msg = data.detail;
    } catch {}
    throw new Error(msg);
  }

  return (await res.json()) as T;
}

// ======================
// Tipos (adaptados a tu UI)
// ======================
export type Service = {
  id: number;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: number;
  activo?: boolean;
};

export type Turno = {
  id: number;
  servicio_id: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM:SS o HH:MM
  estado: string;
  cliente_nombre: string;
  cliente_telefono: string;
  confirmado: boolean;
  servicio: string;
  total_pagado: number;
};

export type Horario = {
  id: number;
  servicio_id: number;
  dia_semana: number; // 0-6
  hora_inicio: string; // HH:MM:SS
  hora_fin: string; // HH:MM:SS
};

export type CajaResp = {
  desde: string;
  hasta: string;
  total_general: number;
  total_por_metodo: { metodo: string; total: number }[];
  total_por_servicio: { servicio: string; total: number }[];
  servicios_mas_solicitados: { servicio: string; cantidad: number; porcentaje: number }[];
  total_turnos: number;
};

// ======================
// Servicios
// ======================
export function listServicios() {
  return apiFetch<Service[]>("/servicios");
}

export function crearServicio(body: {
  nombre: string;
  descripcion?: string | null;
  duracion_minutos: number;
  precio: number;
}) {
  return apiFetch<Service>("/servicios", { method: "POST", body: JSON.stringify(body) });
}

export function editarServicio(
  id: number,
  body: { nombre: string; descripcion?: string | null; duracion_minutos: number; precio: number }
) {
  return apiFetch<Service>(`/servicios/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

// ======================
// Horarios
// ======================
export function horariosServicio(servicio_id: number) {
  return apiFetch<Horario[]>(`/servicios/${servicio_id}/horarios`);
}

export function crearHorario(body: {
  servicio_id: number;
  dia_semana: number;
  hora_inicio: string; // "09:00"
  hora_fin: string; // "13:00"
}) {
  return apiFetch<Horario>("/horarios", { method: "POST", body: JSON.stringify(body) });
}

// ======================
// Disponibilidad
// ======================
export function getDisponibilidad(servicio_id: number, fecha: string) {
  return apiFetch<string[]>(`/disponibilidad?servicio_id=${servicio_id}&fecha=${fecha}`);
}

// ======================
// Turnos
// ======================
export function listTurnos(fecha?: string) {
  const q = fecha ? `?fecha=${fecha}` : "";
  return apiFetch<Turno[]>(`/turnos${q}`);
}

export function reservarTurno(body: {
  servicio_id: number;
  fecha: string; // YYYY-MM-DD
  hora: string; // "HH:MM"
  cliente_nombre: string;
  cliente_telefono: string;
}) {
  return apiFetch<{ ok: boolean; turno_id: number }>("/turnos/reservar", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function eliminarTurno(turno_id: number) {
  return apiFetch<{ ok: boolean }>(`/turnos/${turno_id}`, { method: "DELETE" });
}

export function confirmarTurno(turno_id: number) {
  return apiFetch<{ ok: boolean }>(`/turnos/${turno_id}/confirmar`, { method: "POST" });
}

export function registrarPago(body: { turno_id: number; metodo: "efectivo" | "tarjeta" | "transferencia"; monto: number }) {
  return apiFetch<{ ok: boolean }>("/pagos", { method: "POST", body: JSON.stringify(body) });
}

// ======================
// Caja
// ======================
export function getCaja(desde: string, hasta: string) {
  return apiFetch<CajaResp>(`/caja?desde=${desde}&hasta=${hasta}`);
}

// Helpers UI
export function hhmm(h: string) {
  // "10:00:00" -> "10:00"
  return h?.slice(0, 5) ?? "";
}
