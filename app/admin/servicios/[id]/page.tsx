//app/admin/servicios/id/page.tsx
import ServicioForm from "@/components/admin/servicios/ServicioForm";

export default function Page({ params }: { params: { id: string } }) {
  return <ServicioForm mode="edit" id={params.id} />;
}
