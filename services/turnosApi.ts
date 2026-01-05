// services/turnosApi.ts
import { api } from "@/lib/api";

/** ====== TIPOS (según tu backend) ====== */
export type ServicioApi = {
  id: number;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  precio: number;
  activo?: boolean;
};

export type HorarioApi = {
  id: number;
  servicio_id: number;
  dia_semana: number; // lunes=0
  hora_inicio: string; // "09:00:00" o "09:00"
  hora_fin: string;
};

export type TurnoApi = {
  id: number;
  servicio_id: number;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM:SS" o "HH:MM"
  estado: string; // "reservado" etc
  cliente_nombre: string;
  cliente_telefono: string;
  confirmado: boolean;
  servicio?: string; // viene en GET /turnos
  total_pagado?: number; // viene en GET /turnos
};

export type CajaApi = {
  desde: string;
  hasta: string;
  total_general: number;
  total_por_metodo: Array<{ metodo: string; total: number }>;
  total_por_servicio: Array<{ servicio: string; total: number }>;
  servicios_mas_solicitados: Array<{ servicio: string; cantidad: number; porcentaje: number }>;
  total_turnos: number;
};

/** ====== SERVICIOS ====== */
export const listarServicios = () => api<ServicioApi[]>("/servicios");

export const crearServicio = (body: {
  nombre: string;
  descripcion?: string | null;
  duracion_minutos: number;
  precio: number;
}) => api<ServicioApi>("/servicios", { method: "POST", body: JSON.stringify(body) });

export const editarServicio = (servicioId: number, body: {
  nombre: string;
  descripcion?: string | null;
  duracion_minutos: number;
  precio: number;
}) => api<ServicioApi>(`/servicios/${servicioId}`, { method: "PUT", body: JSON.stringify(body) });

/** (no vi delete servicio en tu backend; por ahora no lo exponemos) */


/** ====== HORARIOS ====== */
export const horariosPorServicio = (servicioId: number) =>
  api<HorarioApi[]>(`/servicios/${servicioId}/horarios`);

export const crearHorario = (body: {
  servicio_id: number;
  dia_semana: number;
  hora_inicio: string; // "09:00"
  hora_fin: string; // "13:00"
}) => api<HorarioApi>("/horarios", { method: "POST", body: JSON.stringify(body) });

/** (no vi delete horario en tu backend; por ahora no lo exponemos) */


/** ====== DISPONIBILIDAD ====== */
export const disponibilidad = (servicioId: number, fechaISO: string) =>
  api<string[]>(`/disponibilidad?servicio_id=${servicioId}&fecha=${fechaISO}`);


/** ====== TURNOS ====== */
export const listarTurnos = (fechaISO?: string) =>
  api<TurnoApi[]>(fechaISO ? `/turnos?fecha=${fechaISO}` : "/turnos");

export const reservarTurno = (body: {
  servicio_id: number;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM"
  cliente_nombre: string;
  cliente_telefono: string;
}) => api<{ ok: boolean; turno_id: number }>("/turnos/reservar", { method: "POST", body: JSON.stringify(body) });

export const eliminarTurno = (turnoId: number) =>
  api<{ ok: boolean }>(`/turnos/${turnoId}`, { method: "DELETE" });

export const confirmarTurno = (turnoId: number) =>
  api<{ ok: boolean }>(`/turnos/${turnoId}/confirmar`, { method: "POST" });


/** ====== PAGOS ====== */
export const registrarPago = (body: {
  turno_id: number;
  metodo: "efectivo" | "tarjeta" | "transferencia";
  monto: number;
}) => api<{ ok: boolean }>("/pagos", { method: "POST", body: JSON.stringify(body) });


/** ====== CAJA ====== */
export const caja = (desdeISO: string, hastaISO: string) =>
  api<CajaApi>(`/caja?desde=${desdeISO}&hasta=${hastaISO}`);
