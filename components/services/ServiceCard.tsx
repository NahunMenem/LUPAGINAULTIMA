import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Service } from "@/types/service";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  return (
    <Card className="rounded-4xl">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold">{service.title}</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          {service.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span>⏱ {service.duration}</span>
          <span>⭐ {service.rating}</span>
          <span>🎯 {service.result}</span>
        </div>

        <ul className="mt-4 space-y-1 text-sm">
          {service.items.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>

        <div className="mt-6 flex gap-2">
          <Button asChild className="rounded-full px-5">
            <Link href="/turnos">Reservar</Link>
          </Button>


        </div>
      </CardContent>
    </Card>
  );
}
