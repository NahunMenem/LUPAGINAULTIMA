import { Service } from "@/types/service";

export const servicesData: Service[] = [
  {
    id: "micropigmentacion",
    title: "Micropigmentación",
    description: "Definición sutil y duradera para un look natural.",
    duration: "90 min",
    result: "Resultado natural",
    rating: 4.9,
    items: ["Cejas", "Labios", "Delineado permanente"],
  },
  {
    id: "pestanas",
    title: "Lash Service",
    description: "Extensiones y lifting con técnica precisa.",
    duration: "60–120 min",
    result: "Mirada intensa",
    rating: 4.8,
    items: [
      "Clásicas",
      "Volumen Medio",
      "Volumen",
      "Tecnológicas",
      "Mega Volumen",
      "Lifting coreano + botox",
    ],
  },
  {
    id: "cejas",
    title: "Brows",
    description: "Diseño y cuidado para enmarcar tu mirada.",
    duration: "45–60 min",
    result: "Cejas definidas",
    rating: 4.9,
    items: ["Perfilado / Diseño", "Laminado", "Henna"],
  },
  {
    id: "faciales",
    title: "Tratamientos faciales",
    description: "Piel luminosa, limpia y renovada.",
    duration: "60 min",
    result: "Piel renovada",
    rating: 4.8,
    items: [
      "Dermaplaning + limpieza",
      "Limpieza profunda",
      "Peeling enzimático",
      "Microneedling",
    ],
  },
];
