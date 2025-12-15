import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import AboutHeader from "@/components/about/AboutHeader";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutVisitFlow from "@/components/about/AboutVisitFlow";
import AboutInfoCards from "@/components/about/AboutInfoCards";

export const metadata: Metadata = {
  title: "Sobre nosotros | Julieta Studio",
  description:
    "Conocé Julieta Studio: estética premium con enfoque natural. Técnica, higiene y atención personalizada para resultados prolijos y duraderos.",
  openGraph: {
    title: "Sobre nosotros | Julieta Studio",
    description:
      "Un espacio pensado para vos: cuidado, técnica y estética. Reservá con confianza.",
    url: "/sobre-nosotros",
    type: "website",
  },
};

export default function SobreNosotrosPage() {
  return (
    <div className="container-page py-12">
      <SectionTitle
        eyebrow="SOBRE NOSOTROS"
        title="Un espacio pensado para vos"
        subtitle="Cuidado, técnica y estética. Nuestra prioridad: que te sientas segura y feliz con tu resultado."
      />

      <div className="mt-8">
        <AboutHeader />
        <AboutStory />
        <AboutValues />
        <AboutVisitFlow />
        <AboutInfoCards />
      </div>
    </div>
  );
}
