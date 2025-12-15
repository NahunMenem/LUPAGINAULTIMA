import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  { n: "01", t: "Charla breve", d: "Nos contás qué querés y revisamos tu caso." },
  { n: "02", t: "Recomendación", d: "Te sugerimos el estilo más armónico para vos." },
  { n: "03", t: "Aplicación", d: "Trabajo prolijo, con técnica y protocolos." },
  { n: "04", t: "Cuidados", d: "Te llevás indicaciones claras para sostener el resultado." },
];

export default function AboutVisitFlow() {
  return (
    <section className="mt-8 font-(family-name:--font-poppins)">
      <Card className="rounded-4xl border bg-(--hero-bg)">
        <CardContent className="p-6 md:p-8">
          <p className="text-xs tracking-widest text-muted-foreground">TU EXPERIENCIA</p>
          <h3 className="mt-2 text-xl font-semibold md:text-2xl">Qué pasa cuando venís al estudio</h3>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Un proceso simple, cuidado y claro para que reserves con confianza.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-4xl border bg-background/50 p-4">
                <p className="text-xs font-semibold text-muted-foreground">{s.n}</p>
                <p className="mt-2 text-sm font-semibold">{s.t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
