import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import ServicesGrid from "@/components/services/ServicesGrid";
import ResultsCarousel from "@/components/services/ResultsCarousel";

export const metadata: Metadata = {
  title: "Servicios de Estética | Julieta Studio",
  description:
    "Conocé nuestros servicios de estética: micropigmentación, pestañas, cejas y tratamientos faciales. Elegí el ideal para vos y reservá tu turno.",
};

export default function ServiciosPage() {
  return (
    <section className="container-page py-12">
      <SectionTitle
        eyebrow="SERVICIOS"
        title="Elegí el servicio ideal para vos"
        subtitle="Te guiamos para que encuentres la mejor opción según tu estilo y necesidad."
      />

      <ServicesGrid />
      <div className="mt-12" />
      <ResultsCarousel />
    </section>
  );
}
