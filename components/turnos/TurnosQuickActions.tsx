//components/turnos/TurnosQuickActions.tsx
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function TurnosQuickActions() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  return (
    <div className="grid gap-6">
      <Card className="rounded-3xl border bg-(--hero-bg)">
        <CardContent className="p-6 md:p-8">
          <p className="text-xs tracking-widest text-muted-foreground">
            RECOMENDADO
          </p>
          <h3 className="mt-2 text-lg font-semibold md:text-xl">
            Coordiná tu turno por WhatsApp
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Es lo más directo para confirmar disponibilidad y ajustar el horario
            según tu agenda. Si tenés una consulta rápida, por ahí es ideal.
          </p>

          <div className="mt-5 grid gap-3">
            <Button asChild className="rounded-full">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>

            <Button asChild variant="outline" className="rounded-full">
              <Link href="/servicios">Ver servicios antes</Link>
            </Button>
          </div>

          <div className="mt-5 text-xs text-muted-foreground">
            Respondemos lo antes posible • Cupos limitados según agenda
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border bg-background/60 backdrop-blur">
        <CardContent className="p-6 md:p-8">
          <h4 className="text-base font-semibold">¿Qué pasa después?</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Te confirmamos disponibilidad y duración estimada.</li>
            <li>• Si hace falta, te pedimos una referencia/foto para guiarte.</li>
            <li>• Te damos recomendaciones previas para un mejor resultado.</li>
          </ul>

          <div className="mt-6 rounded-2xl border bg-background/40 p-4">
            <p className="text-sm text-muted-foreground">
              ¿Preferís email? También podés escribirnos y te respondemos.
            </p>

            <Button asChild variant="outline" className="mt-3 w-full rounded-full">
              <a href="mailto:info@julietastudio.com?subject=Consulta%20de%20turno">
                Enviar email
              </a>
            </Button>

            <p className="mt-2 text-xs text-muted-foreground">
              (Cuando tengas el email real lo reemplazamos.)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
