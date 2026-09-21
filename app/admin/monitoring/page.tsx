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
  searchParams: Promise<{ status?: string; faculty_id?: string }>;
}) {
  const { status, faculty_id: facultyId } = await searchParams;
  const activeStatus = status || "Diajukan";
  const supabase = await createClient();

  const assignmentsQuery = supabase
    .from("indicator_assignments")
    .select("*, indicators(*), faculties(*)")
    .eq("status", activeStatus)
    .order("created_at", { ascending: true });
  if (facultyId) assignmentsQuery.eq("faculty_id", facultyId);
  const { data: assignments, error } = await assignmentsQuery;

  const allAssignmentsQuery = supabase
    .from("indicator_assignments")
    .select("status");
  if (facultyId) allAssignmentsQuery.eq("faculty_id", facultyId);
  const { data: allAssignments } = await allAssignmentsQuery;

  const { data: faculties, error: facultyError } = await supabase
    .from("faculties")
    .select("id, name")
    .order("name");

  const counts = statuses.reduce(
    (acc, s) => {
      acc[s] = allAssignments?.filter((a) => a.status === s).length ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );
  const filterParams = new URLSearchParams();
  if (facultyId) filterParams.set("faculty_id", facultyId);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Kinerja
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Monitoring &amp; Verifikasi
        </h1>
        <p className="mt-2 text-sm text-[#64736A]">
          Pantau capaian indikator dan lakukan verifikasi berdasarkan Fakultas
          atau Unit kerja.
        </p>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm"
      >
        <div className="flex min-w-60 flex-1 flex-col gap-1">
          <label
            htmlFor="faculty_id"
            className="text-xs font-semibold text-[#334A3C]"
          >
            Filter Fakultas / Unit
          </label>
          <select
            id="faculty_id"
            name="faculty_id"
            defaultValue={facultyId ?? ""}
            className="rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2.5 text-sm text-[#17231D] outline-none focus:border-[#7FB493] focus:ring-2 focus:ring-[#7FB493]/15"
          >
            <option value="">Semua Fakultas / Unit</option>
            {faculties?.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>
                {faculty.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#073B25]"
        >
          Terapkan Filter
        </button>
        {facultyId && (
          <Link
            href="/admin/monitoring"
            className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]"
          >
            Reset
          </Link>
        )}
      </form>

      {(facultyError || error) && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Error: {(facultyError ?? error)?.message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          (() => {
            const params = new URLSearchParams(filterParams);
            params.set("status", s);
            return (
              <Link
                key={s}
                href={`/admin/monitoring?${params.toString()}`}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                  activeStatus === s
                    ? "border-[#0B5B35] bg-[#0B5B35] text-white shadow-sm"
                    : "border-[#DCE6DF] bg-white text-[#64736A] hover:border-[#A9C7B2] hover:bg-[#F8FBF8]"
                }`}
              >
                {s} ({counts[s]})
              </Link>
            );
          })()
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-[#F3F8F4] text-left text-xs uppercase tracking-[0.08em] text-[#64736A]">
            <tr>
              <th className="px-5 py-4 font-bold">Indikator</th>
              <th className="px-5 py-4 font-bold">Fakultas / Unit</th>
              <th className="px-5 py-4 font-bold">Target</th>
              <th className="px-5 py-4 font-bold">Realisasi</th>
              <th className="px-5 py-4 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map((a: {
              id: string;
              indicators: { code: string; name: string; target: number; unit: string };
              faculties: { name: string };
              realization: number;
            }) => (
              <tr key={a.id} className="border-t border-[#E8EFEA] transition-colors hover:bg-[#FAFCFA]">
                <td className="px-5 py-4">
                  <span className="font-bold text-[#0B5B35]">
                    {a.indicators.code}
                  </span>{" "}
                  <span className="text-[#334A3C]">— {a.indicators.name}</span>
                </td>
                <td className="px-5 py-4 text-[#334A3C]">{a.faculties.name}</td>
                <td className="px-5 py-4 font-medium text-[#334A3C]">
                  {a.indicators.target} {a.indicators.unit}
                </td>
                <td className="px-5 py-4 font-medium text-[#334A3C]">
                  {a.realization} {a.indicators.unit}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/monitoring/${a.id}`}
                    className="inline-flex rounded-lg border border-[#B9D7C1] px-3 py-1.5 text-xs font-bold text-[#0B5B35] hover:bg-[#F0F8F2]"
                  >
                    Tinjau
                  </Link>
                </td>
              </tr>
            ))}
            {assignments?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-[#64736A]">
                  Tidak ada data berstatus &quot;{activeStatus}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
