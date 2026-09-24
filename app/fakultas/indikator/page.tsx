import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

type Assignment = {
  id: string;
  realization: number;
  status: string;
  indicators: {
    code: string;
    name: string;
    target: number;
    unit: string | null;
    deadline: string;
    quarter: string | null;
  };
};

export default async function FakultasIndikatorPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; quarter?: string }>;
}) {
  const session = await getCurrentProfile();
  const { q, status, quarter } = await searchParams;
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*)")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: true });

  const filteredAssignments = (assignments as Assignment[] | null)?.filter(
    (assignment) => {
      const search = q?.toLowerCase().trim();
      const matchesSearch =
        !search ||
        assignment.indicators.code.toLowerCase().includes(search) ||
        assignment.indicators.name.toLowerCase().includes(search);
      const matchesStatus = !status || assignment.status === status;
      const matchesQuarter = !quarter || assignment.indicators.quarter === quarter;
      return matchesSearch && matchesStatus && matchesQuarter;
    },
  );

  const statuses = Array.from(
    new Set((assignments ?? []).map((assignment) => assignment.status)),
  ).sort();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Kinerja
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Daftar Indikator
        </h1>
        <p className="mt-2 text-sm text-[#64736A]">
          Pantau target, realisasi, capaian, dan status indikator unit Anda.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#334A3C]">Periode pelaporan</h2>
            <p className="mt-1 text-xs text-[#849289]">
              Pilih triwulan berdasarkan deadline indikator
            </p>
          </div>
          {quarter && (
            <a
              href={`/fakultas/indikator${q || status ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(status ? { status } : {}) })}` : ""}`}
              className="text-xs font-semibold text-[#64736A] hover:text-[#0B5B35] hover:underline"
            >
              Semua periode
            </a>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "1", label: "Triwulan I", months: "Januari – Maret", color: "bg-[#EEF5F0] text-[#527160]" },
            { value: "2", label: "Triwulan II", months: "April – Juni", color: "bg-[#F5F2E9] text-[#806F43]" },
            { value: "3", label: "Triwulan III", months: "Juli – September", color: "bg-[#EEF2F5] text-[#557083]" },
            { value: "4", label: "Triwulan IV", months: "Oktober – Desember", color: "bg-[#F5EEEE] text-[#86615D]" },
          ].map((item) => {
            const count = (assignments ?? []).filter((assignment) => {
              return assignment.indicators?.quarter === item.value;
            }).length;
            const hrefParams = new URLSearchParams();
            if (q) hrefParams.set("q", q);
            if (status) hrefParams.set("status", status);
            hrefParams.set("quarter", item.value);
            return (
              <a
                key={item.value}
                href={`/fakultas/indikator?${hrefParams.toString()}`}
                className={`rounded-2xl border border-[#DCE6DF] p-4 transition hover:-translate-y-0.5 hover:border-[#B9D7C1] hover:shadow-sm ${quarter === item.value ? "ring-2 ring-[#8FB49A] ring-offset-2" : "bg-white"}`}
              >
                <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${item.color}`}>
                  Q{item.value}
                </div>
                <p className="text-sm font-bold text-[#334A3C]">{item.label}</p>
                <p className="mt-1 text-[11px] text-[#849289]">{item.months}</p>
                <p className="mt-3 text-2xl font-bold text-[#17231D]">{count}</p>
                <p className="text-[11px] text-[#849289]">indikator</p>
              </a>
            );
          })}
        </div>
      </div>

      <form
        method="get"
        className="grid gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_auto]"
      >
        {quarter && <input type="hidden" name="quarter" value={quarter} />}
        <div>
          <label htmlFor="q" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">
            Cari indikator
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari kode atau nama indikator..."
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">
            Status
          </label>
          <select id="status" name="status" defaultValue={status ?? ""} className="form-input">
            <option value="">Semua status</option>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">
            Filter
          </button>
          {(q || status || quarter) && (
            <a href="/fakultas/indikator" className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]">
              Reset
            </a>
          )}
        </div>
      </form>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat indikator: {error.message}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4">
          <h2 className="text-sm font-bold text-[#334A3C]">Indikator unit</h2>
          <p className="mt-1 text-xs text-[#849289]">
            {filteredAssignments?.length ?? 0} indikator ditampilkan
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-[#F3F8F4] text-left text-xs uppercase tracking-[0.08em] text-[#64736A]">
              <tr>
                <th className="w-16 px-5 py-4 text-center font-bold">No.</th>
                <th className="px-5 py-4 font-bold">Kode</th>
                <th className="px-5 py-4 font-bold">Indikator</th>
                <th className="px-5 py-4 font-bold">Target</th>
                <th className="px-5 py-4 font-bold">Realisasi</th>
                <th className="px-5 py-4 font-bold">Capaian</th>
                <th className="px-5 py-4 font-bold">Deadline</th>
                <th className="px-5 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments?.map((assignment, index) => {
                const target = assignment.indicators.target;
                const pct = target
                  ? Math.min(100, Math.round((assignment.realization / target) * 1000) / 10)
                  : 0;
                return (
                  <tr key={assignment.id} className="border-t border-[#E8EFEA] transition-colors hover:bg-[#FAFCFA]">
                    <td className="px-5 py-4 text-center text-[#849289]">{index + 1}</td>
                    <td className="px-5 py-4 font-bold text-[#0B5B35]">{assignment.indicators.code}</td>
                    <td className="max-w-xs px-5 py-4 font-semibold text-[#334A3C]">{assignment.indicators.name}</td>
                    <td className="px-5 py-4 text-[#52645A]">{target} {assignment.indicators.unit}</td>
                    <td className="px-5 py-4 text-[#52645A]">{assignment.realization} {assignment.indicators.unit}</td>
                    <td className="px-5 py-4 font-bold text-[#0B5B35]">{pct}%</td>
                    <td className="px-5 py-4 text-[#64736A]">{assignment.indicators.deadline}</td>
                    <td className="px-5 py-4"><StatusBadge status={assignment.status} /></td>
                  </tr>
                );
              })}
              {filteredAssignments?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[#64736A]">
                    Tidak ada indikator yang sesuai dengan filter.
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
