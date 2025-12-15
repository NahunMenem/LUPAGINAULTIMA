"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Objetivo =
  | "cejas"
  | "pestanas"
  | "facial"
  | "micro"
  | "consulta";

type Preferencia =
  | "natural"
  | "definido"
  | "intenso";

type Draft = {
  servicio: string;
  detalle: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;
const LS_KEY = "turnos_draft";

function buildSuggestion(o: Objetivo, p: Preferencia | null): Draft {
  if (o === "consulta") {
    return {
      servicio: "Consulta / Asesoramiento",
      detalle:
        "Quiero una recomendación según mi caso. Me gustaría que me sugieras el servicio ideal y duración estimada.",
    };
  }

  if (o === "cejas") {
    if (p === "natural") {
      return {
        servicio: "Brows (Perfilado / Diseño)",
        detalle:
          "Busco cejas naturales y prolijas. Quiero un diseño que enmarque la mirada sin exagerar.",
      };
    }
    if (p === "definido") {
      return {
        servicio: "Brows (Laminado)",
        detalle:
          "Quiero cejas más ordenadas y definidas, con efecto peinado y forma más marcada.",
      };
    }
    return {
      servicio: "Micropigmentación (Cejas)",
      detalle:
        "Quiero mejorar forma y relleno para un resultado duradero. Busco una definición más marcada.",
    };
  }

  if (o === "pestanas") {
    if (p === "natural") {
      return {
        servicio: "Extensiones (Clásicas)",
        detalle:
          "Busco un efecto natural, prolijo y elegante. Quiero levantar la mirada sin que se note exagerado.",
      };
    }
    if (p === "definido") {
      return {
        servicio: "Extensiones (Volumen medio)",
        detalle:
          "Quiero más volumen pero manteniendo prolijidad. Un look definido sin llegar a mega volumen.",
      };
    }
    return {
      servicio: "Mega volumen",
      detalle:
        "Quiero un look bien intenso y con volumen destacado. Prefiero un resultado más notorio.",
    };
  }

  if (o === "facial") {
    if (p === "natural") {
      return {
        servicio: "Facial (Limpieza profunda)",
        detalle:
          "Quiero piel más limpia y luminosa. Busco una limpieza profunda y recomendación de cuidado.",
      };
    }
    if (p === "definido") {
      return {
        servicio: "Facial (Dermaplaning + limpieza)",
        detalle:
          "Quiero textura más suave y glow. Me interesa dermaplaning y limpieza para un resultado visible.",
      };
    }
    return {
      servicio: "Facial (Microneedling)",
      detalle:
        "Quiero trabajar marcas/textura y mejorar calidad de piel. Busco un tratamiento más potente.",
    };
  }

  // micro
  if (p === "natural") {
    return {
      servicio: "Micropigmentación (Labios)",
      detalle:
        "Quiero realzar el tono y definición de labios de forma natural, sin que quede cargado.",
    };
  }
  if (p === "definido") {
    return {
      servicio: "Delineado permanente",
      detalle:
        "Quiero definir la mirada con un delineado prolijo y duradero, de estilo elegante.",
    };
  }
  return {
    servicio: "Micropigmentación (Labios)",
    detalle:
      "Quiero un resultado más marcado y duradero. Busco mejorar color y forma con buena definición.",
  };
}

export default function TurnosWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [preferencia, setPreferencia] = useState<Preferencia | null>(null);

  const suggestion = useMemo(() => {
    if (!objetivo) return null;
    const pref = objetivo === "consulta" ? null : preferencia;
    if (objetivo !== "consulta" && !pref) return null;
    return buildSuggestion(objetivo, pref);
  }, [objetivo, preferencia]);

  useEffect(() => {
    if (!suggestion) return;
    localStorage.setItem(LS_KEY, JSON.stringify(suggestion));
  }, [suggestion]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, ease: easeOut }}
    >
      <Card className="rounded-3xl border bg-(--hero-bg)">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-widest text-muted-foreground">
                DECISIÓN GUIADA
              </p>
              <h2 className="mt-2 text-lg font-semibold md:text-xl">
                Te ayudamos a elegir en 20 segundos
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Elegí tu objetivo y te sugerimos el servicio ideal para tu caso.
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  step >= 1 ? "bg-(--brand-pink-soft)" : "bg-muted",
                ].join(" ")}
              />
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  step >= 2 ? "bg-(--brand-pink-soft)" : "bg-muted",
                ].join(" ")}
              />
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  step >= 3 ? "bg-(--brand-pink-soft)" : "bg-muted",
                ].join(" ")}
              />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <WizardOption
                title="Cejas"
                desc="Diseño, laminado o micro"
                active={objetivo === "cejas"}
                onClick={() => {
                  setObjetivo("cejas");
                  setPreferencia(null);
                  setStep(2);
                }}
              />
              <WizardOption
                title="Pestañas"
                desc="Extensiones o lifting"
                active={objetivo === "pestanas"}
                onClick={() => {
                  setObjetivo("pestanas");
                  setPreferencia(null);
                  setStep(2);
                }}
              />
              <WizardOption
                title="Facial"
                desc="Glow, limpieza, renovación"
                active={objetivo === "facial"}
                onClick={() => {
                  setObjetivo("facial");
                  setPreferencia(null);
                  setStep(2);
                }}
              />
              <WizardOption
                title="Micro"
                desc="Labios o delineado"
                active={objetivo === "micro"}
                onClick={() => {
                  setObjetivo("micro");
                  setPreferencia(null);
                  setStep(2);
                }}
              />
              <WizardOption
                title="No sé / Asesoramiento"
                desc="Te orientamos según tu caso"
                active={objetivo === "consulta"}
                onClick={() => {
                  setObjetivo("consulta");
                  setPreferencia(null);
                  setStep(3);
                }}
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                ¿Qué estilo preferís?
              </p>

              <div className="mt-3 grid gap-3 md:grid-cols-3">
                <WizardOption
                  title="Natural"
                  desc="Sutil y elegante"
                  active={preferencia === "natural"}
                  onClick={() => {
                    setPreferencia("natural");
                    setStep(3);
                  }}
                />
                <WizardOption
                  title="Definido"
                  desc="Marcado pero prolijo"
                  active={preferencia === "definido"}
                  onClick={() => {
                    setPreferencia("definido");
                    setStep(3);
                  }}
                />
                <WizardOption
                  title="Intenso"
                  desc="Más notorio y con impacto"
                  active={preferencia === "intenso"}
                  onClick={() => {
                    setPreferencia("intenso");
                    setStep(3);
                  }}
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => setStep(1)}
                >
                  Volver
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="mt-6">
              <div className="rounded-2xl border bg-background/40 p-4 backdrop-blur">
                <p className="text-xs tracking-widest text-muted-foreground">
                  SUGERENCIA
                </p>
                <p className="mt-2 text-base font-semibold">
                  {suggestion?.servicio ?? "—"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {suggestion?.detalle ??
                    "Elegí un objetivo y preferencia para sugerirte un servicio."}
                </p>

                <div className="mt-4 text-xs text-muted-foreground">
                  Listo: ya te dejamos el formulario abajo con estos datos.
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => {
                    setStep(1);
                    setObjetivo(null);
                    setPreferencia(null);
                    localStorage.removeItem(LS_KEY);
                  }}
                >
                  Reiniciar
                </Button>

                <Button
                  type="button"
                  className="rounded-full"
                  onClick={() => {
                    const el = document.getElementById("turnos-form");
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Completar solicitud
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function WizardOption(props: {
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={[
        "rounded-2xl border p-4 text-left transition",
        "bg-background/40 hover:bg-background/60",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-pink-soft)",
        props.active ? "border-(--brand-pink-soft)" : "border-border",
      ].join(" ")}
    >
      <p className="text-sm font-semibold">{props.title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{props.desc}</p>
    </button>
  );
}
