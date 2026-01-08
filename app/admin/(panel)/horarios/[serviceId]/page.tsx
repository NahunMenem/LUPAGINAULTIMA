//app/admin/(panel)/horarios/[serviceId]/page.tsx
import HorariosEditor from "@/components/admin/horarios/HorariosEditor";

export default async function Page({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <HorariosEditor serviceId={serviceId} />;
}
