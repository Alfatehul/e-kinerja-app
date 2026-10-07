import Link from "next/link";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { createClient } from "@/lib/supabase/server";
import DeleteIndicatorButton from "@/components/DeleteIndicatorButton";
import IndicatorCreateModal from "@/components/IndicatorCreateModal";
import FormModal from "@/components/FormModal";
import AdminIndicatorFilters from "@/components/AdminIndicatorFilters";
import QuarterCardLink from "@/components/QuarterCardLink";
import TambahIndikatorPage from "./tambah/page";
import EditIndikatorPage from "./[id]/edit/page";

export default async function IndikatorListPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    quarter?: string;
    faculty?: string;
  }>;
}) {
  const { q, quarter, faculty } = await searchParams;
  const supabase = await createClient();
  const indicatorsQuery = supabase
    .from("indicators")
    .select("*")
    .order("created_at", { ascending: true });
  const facultiesQuery = supabase
    .from("faculties")
    .select("id, name, code")
    .eq("status", "Aktif")
    .order("name");
  if (q) indicatorsQuery.or(`code.ilike.%${q}%,name.ilike.%${q}%`);
  const [
    { data: indicators, error },
    { data: faculties, error: facultiesError },
  ] = await Promise.all([indicatorsQuery, facultiesQuery]);
  const quarterIndicators = (indicators ?? []).filter(
    (indicator) => quarter && indicator.quarter === quarter,
  );
  const assignmentResult = quarterIndicators.length
    ? await supabase
        .from("indicator_assignments")
        .select("indicator_id, faculty_id")
        .in(
          "indicator_id",
          quarterIndicators.map((indicator) => indicator.id),
        )
    : { data: [], error: null };
  const indicatorsByFaculty = new Map<string, Set<string>>();
  for (const assignment of assignmentResult.data ?? []) {
    const indicatorIds =
      indicatorsByFaculty.get(assignment.faculty_id) ?? new Set<string>();
    indicatorIds.add(assignment.indicator_id);
    indicatorsByFaculty.set(assignment.faculty_id, indicatorIds);
  }
  const filteredIndicators = faculty
    ? quarterIndicators.filter((indicator) =>
        indicatorsByFaculty.get(faculty)?.has(indicator.id),
      )
    : quarterIndicators;
  const selectedFaculty = (faculties ?? []).find((item) => item.id === faculty);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {quarter && (
          <Link
            href={`/admin/indikator?${new URLSearchParams({
              ...(faculty && quarter ? { quarter } : {}),
              ...(q ? { q } : {}),
            }).toString()}`}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <span aria-hidden="true">←</span>
            {faculty
              ? "Kembali ke pilih fakultas / unit"
              : "Kembali ke pilih triwulan"}
          </Link>
        )}
        <div className="ml-auto">
          <IndicatorCreateModal>
            <TambahIndikatorPage />
          </IndicatorCreateModal>
        </div>
      </div>

      {!quarter && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#334A3C]">
              Periode pelaporan
            </h2>
            <p className="mt-1 text-xs text-[#849289]">
              Pilih triwulan berdasarkan deadline indikator
            </p>
          </div>
          <div className="grid min-h-[560px] flex-1 grid-cols-2 grid-rows-2 gap-4 lg:min-h-[calc(100vh-20rem)]">
            {[
              {
                value: "1",
                label: "Triwulan I",
                months: "Januari – Maret",
                color: "bg-[#EEF5F0] text-[#527160]",
              },
              {
                value: "2",
                label: "Triwulan II",
                months: "April – Juni",
                color: "bg-[#F5F2E9] text-[#806F43]",
              },
              {
                value: "3",
                label: "Triwulan III",
                months: "Juli – September",
                color: "bg-[#EEF2F5] text-[#557083]",
              },
              {
                value: "4",
                label: "Triwulan IV",
                months: "Oktober – Desember",
                color: "bg-[#F5EEEE] text-[#86615D]",
              },
            ].map((item) => {
              const count = (indicators ?? []).filter(
                (indicator) => indicator.quarter === item.value,
              ).length;
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (faculty) params.set("faculty", faculty);
              params.set("quarter", item.value);
              return (
                <QuarterCardLink
                  key={item.value}
                  href={`/admin/indikator?${params.toString()}`}
                  className="flex min-h-0 flex-col justify-between border-2 border-[#CBD8CE] bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-[#9AB7A3] hover:shadow-lg sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold text-[#334A3C] sm:text-2xl">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs text-[#849289] sm:text-sm">
                        {item.months}
                      </p>
                    </div>
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-base font-bold sm:h-14 sm:w-14 sm:text-lg ${item.color}`}
                    >
                      Q{item.value}
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-[#17231D] sm:text-4xl">
                      {count}
                    </p>
                    <p className="mt-1 text-xs text-[#849289] sm:text-sm">
                      indikator
                    </p>
                    <p className="mt-4 text-xs font-semibold text-[#0B5B35] sm:text-sm">
                      Buka daftar <span aria-hidden="true">→</span>
                    </p>
                  </div>
                </QuarterCardLink>
              );
            })}
          </div>
        </section>
      )}

      {quarter && (
        <>
          {!faculty ? (
            <section className="flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-bold text-[#334A3C]">
                  Pilih fakultas / unit
                </h2>
                <p className="mt-1 text-xs text-[#849289]">
                  Pilih organisasi untuk melihat indikator Triwulan {quarter}.
                </p>
              </div>
              {(facultiesError || assignmentResult.error) && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Gagal memuat pilihan fakultas / unit:{" "}
                  {(facultiesError ?? assignmentResult.error)?.message}
                </p>
              )}
              <div className="grid min-h-[560px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(faculties ?? []).map((item) => {
                  const params = new URLSearchParams({
                    quarter,
                    faculty: item.id,
                  });
                  if (q) params.set("q", q);
                  const count = indicatorsByFaculty.get(item.id)?.size ?? 0;
                  return (
                    <QuarterCardLink
                      key={item.id}
                      href={`/admin/indikator?${params.toString()}`}
                      className="flex min-h-48 flex-col justify-between border-2 border-[#CBD8CE] bg-white p-5 shadow-md transition hover:-translate-y-0.5 hover:border-[#9AB7A3] hover:shadow-lg sm:p-7"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-[#EEF2F5] text-[#557083]">
                          <BuildingOffice2Icon className="h-7 w-7" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#849289]">
                            {item.code
                              ? `Fakultas / Unit · ${item.code}`
                              : "Fakultas / Unit"}
                          </p>
                          <h3 className="mt-2 text-base font-bold text-[#334A3C] sm:text-lg">
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      <div className="mt-6 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-3xl font-bold text-[#17231D]">
                            {count}
                          </p>
                          <p className="mt-1 text-xs text-[#849289]">
                            indikator ditugaskan
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#0B5B35]">
                          Buka daftar <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </QuarterCardLink>
                  );
                })}
                {(faculties ?? []).length === 0 && !facultiesError && (
                  <p className="col-span-full rounded-2xl border border-dashed border-[#DCE6DF] bg-white px-5 py-12 text-center text-sm text-[#64736A]">
                    Belum ada fakultas / unit aktif.
                  </p>
                )}
              </div>
            </section>
          ) : (
            <>
              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Gagal memuat indikator: {error.message}
                </p>
              )}
              {assignmentResult.error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  Gagal memuat penugasan indikator:{" "}
                  {assignmentResult.error.message}
                </p>
              )}

              <div className="overflow-hidden border border-[#DCE6DF] bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4">
                  <div>
                    <h2 className="text-sm font-bold text-[#334A3C]">
                      Daftar indikator{" "}
                      {selectedFaculty?.name ?? "fakultas / unit"} · Triwulan{" "}
                      {quarter}
                    </h2>
                    <p className="mt-1 text-xs text-[#849289]">
                      {filteredIndicators.length} indikator terdaftar
                    </p>
                  </div>
                </div>
                <AdminIndicatorFilters
                  quarter={quarter}
                  faculty={faculty}
                />
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[780px] table-fixed text-sm">
                    <colgroup>
                      <col className="w-[7%]" />
                      <col className="w-[13%]" />
                      <col className="w-[38%]" />
                      <col className="w-[15%]" />
                      <col className="w-[12%]" />
                      <col className="w-[15%]" />
                    </colgroup>
                    <thead className="bg-[#F3F8F4] text-left text-xs uppercase tracking-[0.08em] text-[#64736A]">
                      <tr>
                        <th className="px-3 py-3 text-center font-bold">
                          No.
                        </th>
                        <th className="px-3 py-3 font-bold">Kode</th>
                        <th className="px-3 py-3 font-bold">Nama indikator</th>
                        <th className="px-3 py-3 font-bold">Target</th>
                        <th className="px-3 py-3 font-bold">Deadline</th>
                        <th className="px-3 py-3 font-bold">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIndicators.map((ind, index) => (
                        <tr
                          key={ind.id}
                          className="border-t border-[#E8EFEA] transition-colors hover:bg-[#FAFCFA]"
                        >
                          <td className="px-3 py-3 text-center text-[#849289]">
                            {index + 1}
                          </td>
                          <td className="px-3 py-3 font-bold text-[#0B5B35]">
                            {ind.code}
                          </td>
                          <td className="break-words px-3 py-3 font-semibold text-[#334A3C]">
                            {ind.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 font-medium text-[#334A3C]">
                            {ind.target} {ind.unit}
                          </td>
                          <td className="whitespace-nowrap px-3 py-3 text-[#64736A]">
                            {ind.deadline}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex justify-start gap-2">
                              <FormModal
                                label="Edit"
                                title={`Edit indikator ${ind.name}`}
                                className="rounded-lg border border-[#B9D7C1] px-3 py-1.5 text-xs font-bold text-[#0B5B35] transition hover:bg-[#F0F8F2]"
                              >
                                <EditIndikatorPage
                                  params={Promise.resolve({ id: ind.id })}
                                />
                              </FormModal>
                              <DeleteIndicatorButton id={ind.id} />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredIndicators.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-12 text-center text-[#64736A]"
                          >
                            Belum ada indikator.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
