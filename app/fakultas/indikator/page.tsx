import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export default async function FakultasIndikatorPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: assignments, error } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*)")
    .eq("faculty_id", session!.profile.faculty_id);

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold mb-4">
        Daftar Indikator
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
              <th className="p-3">Capaian</th>
              <th className="p-3">Deadline</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {assignments?.map((a: any) => {
              const pct = a.indicators.target
                ? Math.min(
                    100,
                    Math.round((a.realization / a.indicators.target) * 1000) /
                      10,
                  )
                : 0;
              return (
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
                  <td className="p-3">{pct}%</td>
                  <td className="p-3">{a.indicators.deadline}</td>
                  <td className="p-3">{a.status}</td>
                </tr>
              );
            })}
            {assignments?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-[#5B5A55]">
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
