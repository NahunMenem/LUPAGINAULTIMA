"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y, Parallax } from "swiper/modules";

import { Card, CardContent } from "@/components/ui/card";
import SectionTitle from "@/components/shared/SectionTitle";

import "swiper/css";
import "swiper/css/pagination";

type Testimonial = {
  name: string;
  text: string;
  rating?: number;
  delayMs?: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Camila",
    text: "El lifting me dejó la mirada increíble. Todo prolijo y con paciencia.",
    rating: 5,
    delayMs: 2600,
  },
  {
    name: "Valentina",
    text: "Recomiendo 100%. Se nota la calidad y el detalle en todo.",
    rating: 5,
    delayMs: 3200,
  },
  {
    name: "Martina",
    text: "Me explicaron todo y me sentí súper cómoda. El resultado quedó natural.",
    rating: 5,
    delayMs: 3200,
  },
  {
    name: "Florencia",
    text: "Excelente higiene y profesionalismo. Volvería sin dudar.",
    rating: 5,
    delayMs: 3200,
  },
  {
    name: "Lucía",
    text: "Diseño de cejas perfecto, muy natural. Me encantó.",
    rating: 5,
    delayMs: 3200,
  },
  {
    name: "Sofía",
    text: "Me encantó el resultado, súper natural. Atención impecable y cuidada.",
    rating: 5,
    delayMs: 3200,
  },
];

function Stars({ value = 5 }: { value?: number }) {
  const total = 5;
  const filled = Math.max(0, Math.min(total, value));

  return (
    <div className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} aria-hidden="true">
          {i < filled ? "★" : "☆"}
        </span>
      ))}
      <span className="sr-only">{value} de 5</span>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-14 md:py-16 font-(family-name:--font-poppins)">
      <div className="container-page">
        <SectionTitle
          eyebrow="OPINIONES"
          title="Clientes felices, resultados reales"
          subtitle="Confianza real basada en experiencias reales."
        />

        <div className="mt-10 overflow-hidden rounded-4xl">
          <Swiper
            modules={[Autoplay, Pagination, A11y, Parallax]}
            className="js-testimonials-swiper w-full pb-10"
            loop
            parallax
            speed={650}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              reverseDirection: false,
              stopOnLastSlide: false,
              waitForTransition: true,
            }}
            pagination={{ clickable: true }}
            spaceBetween={18}
            watchOverflow
            breakpoints={{
              0: { slidesPerView: 1.05 },
              640: { slidesPerView: 1.6 },
              768: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {TESTIMONIALS.map((t) => (
              <SwiperSlide
                key={`${t.name}-${t.text.slice(0, 12)}`}
                className="h-auto"
                data-swiper-autoplay={t.delayMs ?? 3200}
              >
                <Card className="h-full overflow-hidden rounded-3xl border bg-card/70 backdrop-blur">
                  <CardContent className="flex h-full min-h-48 flex-col justify-between p-6">
                    <div>
                      <div
                        className="flex items-start gap-3"
                        data-swiper-parallax="-18"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--brand-pink-soft) text-sm font-semibold text-foreground">
                          {t.name.slice(0, 1).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold leading-none">
                            {t.name}
                          </p>
                          <div className="mt-1">
                            <Stars value={t.rating ?? 5} />
                          </div>
                        </div>
                      </div>

                      <p
                        className="mt-4 max-w-full wrap-break-word text-sm text-muted-foreground"
                        data-swiper-parallax="-26"
                        data-swiper-parallax-opacity="0.25"
                      >
                        “{t.text}”
                      </p>
                    </div>

                    <div className="mt-6" data-swiper-parallax="-16">
                      <p className="text-xs text-muted-foreground">
                        Opinión verificada
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
