import Link from "next/link";

export function DashboardStatCard({
  label,
  value,
  hint,
  accent = "green",
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "green" | "gold" | "blue" | "red";
}) {
  const accents = {
    green: "bg-[#0B5B35] text-[#0B5B35]",
    gold: "bg-[#C49A45] text-[#A47925]",
    blue: "bg-[#6B8EAD] text-[#537493]",
    red: "bg-[#B56B6B] text-[#A05252]",
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
      <div className={`absolute inset-y-0 left-0 w-1 ${accents[accent].split(" ")[0]}`} />
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#718078]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[#17231D]">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#849289]">{hint}</p>}
    </div>
  );
}

export function DashboardPanel({
  title,
  description,
  href,
  children,
}: {
  title: string;
  description?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-[#EDF2EE] px-5 py-4">
        <div>
          <h2 className="text-base font-bold text-[#17231D]">{title}</h2>
          {description && <p className="mt-1 text-xs text-[#849289]">{description}</p>}
        </div>
        {href && (
          <Link href={href} className="whitespace-nowrap text-xs font-bold text-[#0B5B35] hover:underline">
            Lihat semua →
          </Link>
        )}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function EmptyDashboardState({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl bg-[#F5F8F5] px-4 py-5 text-center text-sm text-[#718078]">{children}</p>;
}
