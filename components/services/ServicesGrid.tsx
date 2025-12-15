import { servicesData } from "@/data/services";
import ServiceCard from "./ServiceCard";

export default function ServicesGrid() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2">
      {servicesData.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
