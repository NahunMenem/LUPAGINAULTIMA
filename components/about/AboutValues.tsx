import { Card, CardContent } from "@/components/ui/card";

const VALUES = [
  {
    title: "Asesoramiento real",
    desc: "Te recomendamos lo que mejor te queda según tu rostro y objetivo.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h10M4 17h16" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Técnica y precisión",
    desc: "Trabajo fino, simétrico y con enfoque natural.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 20l6-6 4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Higiene y seguridad",
    desc: "Protocolos, materiales adecuados y cuidados posteriores.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l8 4v6c0 5-3.5 8-8 8s-8-3-8-8V7l8-4z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AboutValues() {
  return (
    <section className="mt-8 font-(family-name:--font-poppins)">
      <div className="grid gap-4 md:grid-cols-3">
        {VALUES.map((v) => (
          <Card key={v.title} className="rounded-4xl border bg-background/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-3xl border bg-(--brand-pink-soft)">
                  {v.icon}
                </div>
                <p className="text-sm font-semibold">{v.title}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{v.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
