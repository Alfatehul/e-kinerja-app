import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const statuses = [
  "Belum Diisi",
  "Draft",
  "Diajukan",
  "Diverifikasi",
  "Ditolak",
  "Selesai",
];

export default async function MonitoringPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status || "Diajukan";
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*), faculties(*)")
    .eq("status", activeStatus);

  const { data: allAssignments } = await supabase
    .from("indicator_assignments")
    .select("status");

  const counts = statuses.reduce(
    (acc, s) => {
      acc[s] = allAssignments?.filter((a) => a.status === s).length ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold mb-4">
        Monitoring & Verifikasi
      </h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/monitoring?status=${encodeURIComponent(s)}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${
              activeStatus === s
                ? "bg-[#1B2A4B] text-white border-[#1B2A4B]"
                : "bg-white text-[#1E2027] border-[#E1DDCF]"
            }`}
          >
            {s} ({counts[s]})
          </Link>
        ))}
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">Error: {error.message}</p>
      )}

      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">Indikator</th>
              <th className="p-3">Fakultas</th>
              <th className="p-3">Target</th>
              <th className="p-3">Realisasi</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map((a: any) => (
              <tr key={a.id} className="border-t border-[#E1DDCF]">
                <td className="p-3">
                  <span className="font-semibold text-[#1B2A4B]">
                    {a.indicators.code}
                  </span>{" "}
                  — {a.indicators.name}
                </td>
                <td className="p-3">{a.faculties.name}</td>
                <td className="p-3">
                  {a.indicators.target} {a.indicators.unit}
                </td>
                <td className="p-3">
                  {a.realization} {a.indicators.unit}
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/monitoring/${a.id}`}
                    className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                  >
                    Tinjau
                  </Link>
                </td>
              </tr>
            ))}
            {assignments?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#5B5A55]">
                  Tidak ada data berstatus "{activeStatus}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
