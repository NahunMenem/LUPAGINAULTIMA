"use client";

import Image from "next/image";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, A11y } from "swiper/modules";

import "swiper/css";
import "./results-carousel.css";

type Slide = {
  src: string;
  alt: string;
  tag?: string;
  delay?: number;
};

const SLIDES: Slide[] = [
  { src: "/images/resultados/r1.jpg", alt: "Resultado cejas", tag: "Cejas" },
  { src: "/images/resultados/r2.jpg", alt: "Resultado pestañas", tag: "Pestañas" },
  { src: "/images/resultados/r3.jpg", alt: "Resultado facial", tag: "Facial" },
  { src: "/images/resultados/r4.jpg", alt: "Resultado micro", tag: "Micropigmentación" },
  { src: "/images/resultados/r5.jpg", alt: "Resultado cejas 2", tag: "Cejas" },
  { src: "/images/resultados/r6.jpg", alt: "Resultado pestañas 2", tag: "Pestañas" },
];

export default function ResultsCarousel() {
  const progressRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="container-page pb-16 font-(family-name:--font-poppins)">
      <div className="relative overflow-hidden rounded-4xl border bg-(--hero-bg) p-6 md:p-8">
        <div>
          <p className="text-xs tracking-widest text-muted-foreground">RESULTADOS</p>
          <h3 className="mt-2 text-xl font-semibold md:text-2xl">
            Trabajos reales, detalle real
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Un vistazo rápido a resultados de tratamientos realizados.
          </p>
        </div>

        <div className="mt-6">
          <Swiper
            modules={[Autoplay, A11y]}
            loop
            speed={800}
            slidesPerView={1.1}
            spaceBetween={14}
            breakpoints={{
              640: { slidesPerView: 2.1, spaceBetween: 16 },
              1024: { slidesPerView: 3.2, spaceBetween: 18 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onAutoplayTimeLeft={(_, __, progress) => {
              if (!progressRef.current) return;
              progressRef.current.style.setProperty("--progress", String(progress));
            }}
            className="results-swiper"
          >
            {SLIDES.map((s) => (
              <SwiperSlide key={s.src}>
                <article className="group relative h-80 overflow-hidden rounded-4xl border bg-background/30 backdrop-blur">
                  <Image
                    src={s.src}
                    alt={s.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
                  />

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.55),transparent_55%)]" />

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {s.tag ?? "Tratamiento"}
                      </p>
                      <p className="mt-1 truncate text-xs text-white/80">
                        Resultado realizado en Julieta Studio
                      </p>
                    </div>

                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur">
                      Ver
                    </span>
                  </div>
                </article>
              </SwiperSlide>
            ))}

            {/* Spinner de progreso REAL */}
            <div
              className="results-progress"
              ref={progressRef}
              slot="container-end"
              aria-hidden="true"
            >
              <svg viewBox="0 0 48 48">
                <circle className="track" cx="24" cy="24" r="20" />
                <circle className="bar" cx="24" cy="24" r="20" />
              </svg>
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  );
}
