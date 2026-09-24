import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteIndicatorButton from "@/components/DeleteIndicatorButton";

export default async function IndikatorListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; status?: string; quarter?: string }>;
}) {
  const { q, category, status, quarter } = await searchParams;
  const supabase = await createClient();
  const indicatorsQuery = supabase
    .from("indicators")
    .select("*")
    .order("created_at", { ascending: true });
  const categoriesQuery = supabase.from("indicators").select("category").order("category");
  if (q) indicatorsQuery.or(`code.ilike.%${q}%,name.ilike.%${q}%`);
  if (category) indicatorsQuery.eq("category", category);
  if (status) indicatorsQuery.eq("status", status);
  const [{ data: indicators, error }, { data: categoryRows }] = await Promise.all([
    indicatorsQuery,
    categoriesQuery,
  ]);

  const categories = Array.from(
    new Set((categoryRows ?? []).map((row) => row.category).filter(Boolean)),
  ).sort();
  const filteredIndicators = (indicators ?? []).filter((indicator) =>
    !quarter || indicator.quarter === quarter,
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
            Kinerja
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
            Manajemen Indikator
          </h1>
          <p className="mt-2 text-sm text-[#64736A]">
            Kelola indikator kinerja, target capaian, dan periode pelaporan.
          </p>
        </div>
        <Link
          href="/admin/indikator/tambah"
          className="inline-flex items-center justify-center rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
        >
          + Tambah Indikator
        </Link>
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
            <Link
              href={`/admin/indikator${q || category || status ? `?${new URLSearchParams({ ...(q ? { q } : {}), ...(category ? { category } : {}), ...(status ? { status } : {}) })}` : ""}`}
              className="text-xs font-semibold text-[#64736A] hover:text-[#0B5B35] hover:underline"
            >
              Semua periode
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { value: "1", label: "Triwulan I", months: "Januari – Maret", color: "bg-[#EEF5F0] text-[#527160]" },
            { value: "2", label: "Triwulan II", months: "April – Juni", color: "bg-[#F5F2E9] text-[#806F43]" },
            { value: "3", label: "Triwulan III", months: "Juli – September", color: "bg-[#EEF2F5] text-[#557083]" },
            { value: "4", label: "Triwulan IV", months: "Oktober – Desember", color: "bg-[#F5EEEE] text-[#86615D]" },
          ].map((item) => {
            const count = (indicators ?? []).filter((indicator) => {
              return indicator.quarter === item.value;
            }).length;
            const params = new URLSearchParams();
            if (q) params.set("q", q);
            if (category) params.set("category", category);
            if (status) params.set("status", status);
            params.set("quarter", item.value);
            return (
              <Link
                key={item.value}
                href={`/admin/indikator?${params.toString()}`}
                className={`rounded-2xl border border-[#DCE6DF] p-4 transition hover:-translate-y-0.5 hover:border-[#B9D7C1] hover:shadow-sm ${quarter === item.value ? "ring-2 ring-[#8FB49A] ring-offset-2" : "bg-white"}`}
              >
                <div className={`mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${item.color}`}>
                  Q{item.value}
                </div>
                <p className="text-sm font-bold text-[#334A3C]">{item.label}</p>
                <p className="mt-1 text-[11px] text-[#849289]">{item.months}</p>
                <p className="mt-3 text-2xl font-bold text-[#17231D]">{count}</p>
                <p className="text-[11px] text-[#849289]">indikator</p>
              </Link>
            );
          })}
        </div>
      </div>

      <form
        method="get"
        className="grid gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_auto]"
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
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2.5 text-sm text-[#17231D] outline-none focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
        </div>
        <div>
          <label htmlFor="category" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category ?? ""}
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2.5 text-sm text-[#17231D] outline-none focus:border-[#7FB493] focus:ring-2 focus:ring-[#7FB493]/15"
          >
            <option value="">Semua kategori</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={status ?? ""}
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2.5 text-sm text-[#17231D] outline-none focus:border-[#7FB493] focus:ring-2 focus:ring-[#7FB493]/15"
          >
            <option value="">Semua status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]"
          >
            Filter
          </button>
          {(q || category || status || quarter) && (
            <Link
              href="/admin/indikator"
              className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat indikator: {error.message}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4">
          <div>
            <h2 className="text-sm font-bold text-[#334A3C]">Daftar indikator</h2>
            <p className="mt-1 text-xs text-[#849289]">
              {filteredIndicators.length} indikator terdaftar
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-[#F3F8F4] text-left text-xs uppercase tracking-[0.08em] text-[#64736A]">
            <tr>
              <th className="w-16 px-5 py-4 text-center font-bold">No.</th>
              <th className="px-5 py-4 font-bold">Kode</th>
              <th className="px-5 py-4 font-bold">Nama indikator</th>
              <th className="px-5 py-4 font-bold">Kategori</th>
              <th className="px-5 py-4 font-bold">Target</th>
              <th className="px-5 py-4 font-bold">Deadline</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndicators.map((ind, index) => (
              <tr key={ind.id} className="border-t border-[#E8EFEA] transition-colors hover:bg-[#FAFCFA]">
                <td className="px-5 py-4 text-center text-[#849289]">{index + 1}</td>
                <td className="px-5 py-4 font-bold text-[#0B5B35]">{ind.code}</td>
                <td className="max-w-xs px-5 py-4 font-semibold text-[#334A3C]">{ind.name}</td>
                <td className="px-5 py-4 text-[#64736A]">{ind.category}</td>
                <td className="px-5 py-4 font-medium text-[#334A3C]">
                  {ind.target} {ind.unit}
                </td>
                <td className="px-5 py-4 text-[#64736A]">{ind.deadline}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#EAF3ED] px-2.5 py-1 text-xs font-bold text-[#0B5B35]">
                    {ind.status ?? "Aktif"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/indikator/${ind.id}/edit`}
                      className="rounded-lg border border-[#B9D7C1] px-3 py-1.5 text-xs font-bold text-[#0B5B35] transition hover:bg-[#F0F8F2]"
                    >
                      Edit
                    </Link>
                    <DeleteIndicatorButton id={ind.id} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredIndicators.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-[#64736A]">
                  Belum ada indikator.
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
