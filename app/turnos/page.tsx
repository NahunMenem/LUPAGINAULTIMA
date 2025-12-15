
import type { Metadata } from "next";
import SectionTitle from "@/components/shared/SectionTitle";
import TurnosWizard from "@/components/turnos/TurnosWizard";
import TurnosForm from "@/components/turnos/TurnosForm";
import TurnosQuickActions from "@/components/turnos/TurnosQuickActions";

export const metadata: Metadata = {
  title: "Turnos | Julieta Studio",
  description:
    "Reservá tu turno en Julieta Studio. Elegí tu objetivo y te sugerimos el servicio ideal. Coordiná rápido por WhatsApp o dejá tu solicitud.",
  openGraph: {
    title: "Turnos | Julieta Studio",
    description:
      "Reservá tu turno. Selector guiado + WhatsApp recomendado para coordinar rápido.",
    url: "/turnos",
    type: "website",
  },
};

export default function TurnosPage() {
  return (
    <div className="container-page py-12 font-(family-name:--font-poppins)">
      <SectionTitle
        eyebrow="TURNOS"
        title="Reservá tu turno"
        subtitle="Elegí lo que buscás lograr y te sugerimos el servicio. WhatsApp es lo más directo para confirmar."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-6">
          <TurnosWizard />
          <TurnosForm />
        </div>

        <TurnosQuickActions />
      </div>
    </div>
  );
}
