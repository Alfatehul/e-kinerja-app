import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function PengisianPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*)")
    .eq("faculty_id", session!.profile.faculty_id);

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold mb-4">
        Pengisian Indikator
      </h1>
      {error && (
        <p className="text-red-600 text-sm mb-4">Error: {error.message}</p>
      )}
      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">Kode</th>
              <th className="p-3">Indikator</th>
              <th className="p-3">Target</th>
              <th className="p-3">Realisasi</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map((a: any) => (
              <tr key={a.id} className="border-t border-[#E1DDCF]">
                <td className="p-3 font-semibold text-[#1B2A4B]">
                  {a.indicators.code}
                </td>
                <td className="p-3">{a.indicators.name}</td>
                <td className="p-3">
                  {a.indicators.target} {a.indicators.unit}
                </td>
                <td className="p-3">
                  {a.realization} {a.indicators.unit}
                </td>
                <td className="p-3">{a.status}</td>
                <td className="p-3">
                  <Link
                    href={`/fakultas/pengisian/${a.id}`}
                    className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                  >
                    Kelola Realisasi
                  </Link>
                </td>
              </tr>
            ))}
            {assignments?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#5B5A55]">
                  Belum ada indikator yang ditugaskan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
