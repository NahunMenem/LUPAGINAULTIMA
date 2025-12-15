"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { MapPin } from "lucide-react";

export default function AboutInfoCards() {
  const whatsappHref = `https://wa.me/${siteConfig.whatsapp.phone}?text=${encodeURIComponent(
    siteConfig.whatsapp.message
  )}`;

  const mapsHref =
    "https://www.google.com/maps?q=Av.+Ignacio+de+la+Roza+1234,+San+Juan,+Argentina";

  return (
    <section className="mt-8 pb-10 font-(family-name:--font-poppins)">
      <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
        {/* HORARIOS */}
        <Card className="h-full rounded-4xl border bg-background/60 backdrop-blur">
          <CardContent className="p-6">
            <p className="text-sm font-semibold">Horarios</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Lunes a Sábado • 09:00 a 19:00
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Cupos limitados según agenda.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-3xl border bg-background/40 p-4">
                <p className="text-xs font-semibold">Tiempo estimado</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  La mayoría de los turnos duran entre 60 y 90 minutos.
                </p>
              </div>

              <div className="rounded-3xl border bg-background/40 p-4">
                <p className="text-xs font-semibold">Confirmación</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coordinamos y confirmamos el horario por WhatsApp.
                </p>
              </div>

              <div className="rounded-3xl border bg-background/40 p-4">
                <p className="text-xs font-semibold">Recomendación</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Vení sin maquillaje en la zona a trabajar (si aplica).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UBICACIÓN */}
        <Card className="h-full rounded-4xl border bg-background/60 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--brand-pink-soft)/20">
                <MapPin className="h-4 w-4 text-(--brand-pink-soft)" />
              </div>

              <div>
                <p className="text-sm font-semibold">Ubicación</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Av. Ignacio de la Roza 1234
                  <br />
                  San Juan Capital, Argentina
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Zona céntrica • Fácil acceso • Estacionamiento cercano
            </p>

            <Button
              asChild
              variant="outline"
              className="mt-4 w-full rounded-full"
            >
              <a href={mapsHref} target="_blank" rel="noopener noreferrer">
                Ver en Google Maps
              </a>
            </Button>

            {/* MAPA SOLO DESKTOP */}
            <div className="mt-4 hidden overflow-hidden rounded-3xl border md:block">
              <iframe
                title="Mapa Julieta Studio"
                src="https://www.google.com/maps?q=Av.+Ignacio+de+la+Roza+1234,+San+Juan,+Argentina&output=embed"
                className="h-45 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </CardContent>
        </Card>

        {/* CONTACTO */}
        <Card className="h-full rounded-4xl border bg-(--hero-bg)">
          <CardContent className="p-6">
            <p className="text-sm font-semibold">Contacto rápido</p>
            <p className="mt-2 text-sm text-muted-foreground">
              WhatsApp es la forma más directa para coordinar horarios y resolver
              dudas al instante.
            </p>

            <div className="mt-6 grid gap-3">
              <Button asChild className="rounded-full">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Hablar por WhatsApp
                </a>
              </Button>

              <Button asChild variant="outline" className="rounded-full">
                <Link href="/turnos">Reservar turno</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Respondemos rápido y sin compromiso 💬
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
