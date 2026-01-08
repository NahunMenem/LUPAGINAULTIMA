export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <div className="text-lg font-semibold text-zinc-900">{title}</div>
      {subtitle && <div className="mt-1 text-sm text-zinc-500">{subtitle}</div>}
    </div>
  );
}
