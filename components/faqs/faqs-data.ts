export type FaqItem = {
  id: string;
  q: string;
  a: string;
  category: "Micropigmentación" | "Pestañas" | "Cejas" | "Faciales" | "Turnos" | "Cuidados";
};

export const FAQ_CATEGORIES: FaqItem["category"][] = [
  "Micropigmentación",
  "Pestañas",
  "Cejas",
  "Faciales",
  "Cuidados",
  "Turnos",
];

export const FAQS: FaqItem[] = [
  {
    id: "micro-duele",
    category: "Micropigmentación",
    q: "¿Duele la micropigmentación?",
    a: "La sensación suele ser leve y depende de cada persona. Trabajamos con productos adecuados para mayor comodidad y te guiamos en todo el proceso.",
  },
  {
    id: "duracion",
    category: "Micropigmentación",
    q: "¿Cuánto duran los resultados?",
    a: "Depende del servicio, tu piel y los cuidados posteriores. Lo habitual es que sea duradero y, si hace falta, se realiza un retoque para mantener el resultado prolijo.",
  },
  {
    id: "pestanas-cuidado",
    category: "Pestañas",
    q: "¿Qué cuidados debo tener con extensiones o lifting?",
    a: "Evitá vapor/agua caliente las primeras 24–48h, no frotes la zona, y usá productos suaves. Si es lifting, seguí las indicaciones para maximizar la duración.",
  },
  {
    id: "cejas-laminado",
    category: "Cejas",
    q: "¿El laminado de cejas es para mí?",
    a: "Si buscás cejas más peinadas y con forma, suele ser ideal. Te recomendamos según tu tipo de pelo, densidad y el objetivo que querés lograr.",
  },
  {
    id: "faciales-intervalo",
    category: "Faciales",
    q: "¿Cada cuánto conviene hacer un tratamiento facial?",
    a: "Varía por piel y objetivo. En general, una rutina mensual ayuda a mantener la piel limpia y luminosa. Te sugerimos frecuencia según tu caso.",
  },
  {
    id: "cuidados-post",
    category: "Cuidados",
    q: "¿Qué cuidados debo tener después del tratamiento?",
    a: "Te damos indicaciones específicas según el servicio. Lo más importante es cuidar la zona, evitar irritaciones, y respetar el tiempo de recuperación recomendado.",
  },
  {
    id: "turnos-reserva",
    category: "Turnos",
    q: "¿Cómo reservo?",
    a: "Podés reservar desde Turnos o escribirnos por WhatsApp para coordinar disponibilidad. WhatsApp suele ser lo más rápido para confirmar horario.",
  },
];
