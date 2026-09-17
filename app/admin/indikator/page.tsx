import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteIndicatorButton from "@/components/DeleteIndicatorButton";

export default async function IndikatorListPage() {
  const supabase = await createClient();
  const { data: indicators, error } = await supabase
    .from("indicators")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-xl font-semibold">
          Manajemen Indikator
        </h1>
        <Link
          href="/admin/indikator/tambah"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
        >
          + Tambah Indikator
        </Link>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4">Error: {error.message}</p>
      )}

      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">Kode</th>
              <th className="p-3">Nama</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Target</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {indicators?.map((ind) => (
              <tr key={ind.id} className="border-t border-[#E1DDCF]">
                <td className="p-3 font-semibold text-[#1B2A4B]">{ind.code}</td>
                <td className="p-3">{ind.name}</td>
                <td className="p-3">{ind.category}</td>
                <td className="p-3">
                  {ind.target} {ind.unit}
                </td>
                <td className="p-3">{ind.deadline}</td>
                <td className="p-3">{ind.status}</td>
                <td className="p-3">
                  <div className="flex gap-3">
                    <Link
                      href={`/admin/indikator/${ind.id}/edit`}
                      className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteIndicatorButton id={ind.id} />
                  </div>
                </td>
              </tr>
            ))}
            {indicators?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#5B5A55]">
                  Belum ada indikator.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
