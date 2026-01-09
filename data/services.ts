import { Service } from "@/types/service";
import { listServicios } from "@/lib/apiTurnos";

/**
 * Trae los servicios desde el backend
 * y los adapta al formato visual del frontend (/servicios)
 */
export async function getServicesData(): Promise<Service[]> {
  const backendServices = await listServicios();

  return backendServices.map((s) => ({
    id: String(s.id),
    title: s.nombre,
    description: s.descripcion ?? "",
    duration: `${s.duracion_minutos} min`,
    result: "Servicio profesional", // fijo o editable luego
    rating: 4.8, // placeholder (puede venir del back más adelante)
    items: [], // opcional: después se puede extender
  }));
}
