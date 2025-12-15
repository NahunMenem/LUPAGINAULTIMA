import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import FaqContent from "@/components/faqs/FaqContent";

export const metadata: Metadata = {
  title: "FAQs | Julieta Studio",
  description:
    "Preguntas frecuentes sobre micropigmentación, cejas, pestañas y faciales. Cuidados, duración, turnos y recomendaciones.",
  openGraph: {
    title: "FAQs | Julieta Studio",
    description:
      "Respuestas claras sobre tratamientos, cuidados, duración y cómo reservar tu turno.",
    url: "/faqs",
    type: "website",
  },
};

export default function FaqsPage() {
  return (
    <div className="container-page py-12">
      <SectionTitle
        eyebrow="PREGUNTAS FRECUENTES"
        title="Resolvemos tus dudas"
        subtitle="Para que reserves con confianza: cuidados, duración, turnos y recomendaciones."
      />

      <FaqContent />
    </div>
  );
}
