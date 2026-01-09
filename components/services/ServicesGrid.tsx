"use client";

import { useEffect, useState } from "react";
import ServiceCard from "./ServiceCard";
import { Service } from "@/types/service";
import { getServicesData } from "@/data/services";

export default function ServicesGrid() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getServicesData();
        setServices(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <div className="mt-10 text-center text-muted-foreground">Cargando servicios…</div>;
  }

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
