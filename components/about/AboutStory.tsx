import { Card, CardContent } from "@/components/ui/card";

export default function AboutStory() {
  return (
    <section className="mt-8 font-(family-name:--font-poppins)">
      <Card className="rounded-4xl border bg-background/60 backdrop-blur">
        <CardContent className="p-6 md:p-8">
          <p className="text-xs tracking-widest text-muted-foreground">NUESTRA FILOSOFÍA</p>
          <h2 className="mt-2 text-xl font-semibold md:text-2xl">Natural, prolijo y con criterio</h2>

          <div className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-2">
            <p>
              En Julieta Studio buscamos realzar tu belleza con resultados que se vean finos y
              armoniosos. La idea no es “cambiarte”, sino acompañar tu rostro y tu estilo.
            </p>
            <p>
              Cada servicio se adapta a vos: escuchamos lo que querés, analizamos tu caso y te
              recomendamos la mejor opción para lograr un resultado duradero y elegante.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { k: "Detalle", v: "Trabajo prolijo y simétrico" },
              { k: "Cuidado", v: "Protocolos e higiene" },
              { k: "Acompañamiento", v: "Guía antes y después" },
            ].map((it) => (
              <div key={it.k} className="rounded-3xl border bg-(--hero-bg) p-4">
                <p className="text-sm font-semibold">{it.k}</p>
                <p className="mt-1 text-sm text-muted-foreground">{it.v}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
