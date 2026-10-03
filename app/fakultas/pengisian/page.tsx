import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import FormModal from "@/components/FormModal";
import PengisianFilters from "@/components/PengisianFilters";
import PengisianDetailPage from "./[id]/page";

type Assignment = {
  id: string;
  realization: number;
  realization_unit: string | null;
  status: string;
  document_link: string | null;
  indicators: {
    code: string;
    name: string;
    description: string | null;
    target: number | null;
    unit: string | null;
    quarter: string | null;
  } | null;
};

export default async function PengisianPage({
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

  const rows = (assignments as Assignment[] | null)?.filter((assignment) => {
    const search = q?.toLowerCase().trim();
    const matchesSearch =
      !search ||
      assignment.indicators?.code.toLowerCase().includes(search) ||
      assignment.indicators?.name.toLowerCase().includes(search);
    return (
      matchesSearch &&
      (!status || assignment.status === status) &&
      (!quarter || assignment.indicators?.quarter === quarter)
    );
  });
  const statuses = Array.from(
    new Set((assignments ?? []).map((item) => item.status)),
  ).sort();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {quarter && (
          <Link
            href="/fakultas/pengisian"
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <span aria-hidden="true">←</span>
            Kembali ke pilih triwulan
          </Link>
        )}
      </div>
      {!quarter && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#334A3C]">
              Periode pelaporan
            </h2>
            <p className="mt-1 text-xs text-[#849289]">
              Pilih salah satu triwulan untuk membuka daftar pengisian.
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
              const count = (assignments ?? []).filter(
                (assignment) => assignment.indicators?.quarter === item.value,
              ).length;
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (status) params.set("status", status);
              params.set("quarter", item.value);
              return (
                <Link
                  key={item.value}
                  href={`/fakultas/pengisian?${params.toString()}`}
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
                </Link>
              );
            })}
          </div>
        </section>
      )}
      {quarter && (
        <>
          <PengisianFilters quarter={quarter} statuses={statuses} />
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Gagal memuat indikator: {error.message}
            </p>
          )}
          <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
            <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4">
              <h2 className="text-sm font-bold text-[#334A3C]">
                Daftar pengisian Triwulan {quarter}
              </h2>
              <p className="mt-1 text-xs text-[#849289]">
                {rows?.length ?? 0} indikator ditampilkan
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] border-collapse text-sm">
                <thead className="bg-[#F3F8F4] text-left text-xs uppercase tracking-[0.08em] text-[#64736A]">
                  <tr>
                    <th className="w-16 px-5 py-4 text-center font-bold">
                      No.
                    </th>
                    <th className="px-5 py-4 font-bold">Nama indikator</th>
                    <th className="px-5 py-4 font-bold">Deskripsi</th>
                    <th className="px-5 py-4 font-bold">Target</th>
                    <th className="px-5 py-4 font-bold">Realisasi</th>
                    <th className="px-5 py-4 font-bold">Status</th>
                    <th className="px-5 py-4 font-bold">Dokumen</th>
                    <th className="px-5 py-4 font-bold">Capaian</th>
                    <th className="px-5 py-4 text-right font-bold text-red-600">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CBD8CE]">
                  {rows?.map((assignment, index) => {
                    const target = assignment.indicators?.target;
                    const realization = assignment.realization ?? 0;
                    const achievement = !assignment.indicators
                      ? null
                      : target == null
                        ? realization > 0
                          ? 100
                          : 0
                        : target > 0
                          ? Math.min(
                              100,
                              Math.round((realization / target) * 1000) / 10,
                            )
                          : 0;

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b border-[#CBD8CE] transition-colors hover:bg-[#FAFCFA]"
                      >
                        <td className="px-5 py-4 text-center text-[#849289]">
                          {index + 1}
                        </td>
                        <td className="max-w-xs px-5 py-4 font-semibold text-[#334A3C]">
                          {assignment.indicators?.name ?? "-"}
                        </td>
                        <td className="max-w-sm whitespace-normal px-5 py-4 text-[#52645A]">
                          {assignment.indicators?.description?.trim() || "-"}
                        </td>
                        <td className="px-5 py-4 text-[#52645A]">
                          {assignment.indicators
                            ? `${assignment.indicators.target} ${assignment.indicators.unit ?? ""}`
                            : "-"}
                        </td>
                        <td className="px-5 py-4 font-medium text-[#52645A]">
                          {assignment.indicators
                            ? `${assignment.realization ?? 0} ${assignment.realization_unit ?? assignment.indicators.unit ?? ""}`
                            : "-"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={assignment.status ?? "Draft"} />
                        </td>
                        <td className="px-5 py-4">
                          {assignment.document_link ? (
                            <a
                              href={assignment.document_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-bold text-[#0B5B35] hover:underline"
                            >
                              Buka link
                            </a>
                          ) : (
                            <span className="text-xs text-[#849289]">
                              Belum ada
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-medium text-[#52645A]">
                          {achievement == null ? "-" : `${achievement}%`}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <FormModal
                            label="Isi realisasi"
                            title="Kelola realisasi"
                            modalId={`pengisian-${assignment.id}`}
                            className="inline-flex rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-blue-700"
                            dialogClassName="max-w-3xl"
                            showTitle
                          >
                            <PengisianDetailPage
                              params={Promise.resolve({ id: assignment.id })}
                              returnTo={`/fakultas/pengisian?quarter=${quarter}`}
                              modalId={`pengisian-${assignment.id}`}
                            />
                          </FormModal>
                        </td>
                      </tr>
                    );
                  })}
                  {rows?.length === 0 && (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-5 py-12 text-center text-[#64736A]"
                      >
                        Tidak ada indikator yang sesuai dengan filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
