//app/admin/horarios/[serviedID]/page.tsx
import HorariosEditor from "@/components/admin/horarios/HorariosEditor";

export default function Page({ params }: { params: { serviceId: string } }) {
  return <HorariosEditor serviceId={params.serviceId} />;
}
