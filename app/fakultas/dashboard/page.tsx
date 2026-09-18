import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div
      className="bg-white border border-[#E1DDCF] rounded-lg p-4 flex-1 min-w-[180px]"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="text-xs text-[#5B5A55] mb-1">{label}</div>
      <div className="font-serif text-2xl font-bold text-[#1E2027]">
        {value}
      </div>
    </div>
  );
}

export default async function FakultasDashboardPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: assignments } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*)")
    .eq("faculty_id", session!.profile.faculty_id);

  const { count: pendingProposals } = await supabase
    .from("budget_proposals")
    .select("*", { count: "exact", head: true })
    .eq("faculty_id", session!.profile.faculty_id)
    .eq("status", "Diajukan");

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("publish_date", { ascending: false })
    .limit(3);

  const pct = (real: number, target: number) =>
    target ? Math.min(100, Math.round((real / target) * 1000) / 10) : 0;

  const total = assignments?.length ?? 0;
  const avg =
    total > 0
      ? Math.round(
          (assignments ?? []).reduce(
            (s: number, a: any) => s + pct(a.realization, a.indicators.target),
            0,
          ) / total,
        )
      : 0;

  const today = new Date();
  const deadlineSoon = (assignments ?? [])
    .filter((a: any) => a.indicators.deadline)
    .map((a: any) => ({
      ...a,
      days: Math.ceil(
        (new Date(a.indicators.deadline).getTime() - today.getTime()) /
          86400000,
      ),
    }))
    .filter((a: any) => a.days >= 0 && a.days <= 14)
    .sort((a: any, b: any) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 flex-wrap">
        <StatCard label="Total Indikator" value={total} accent="#1B2A4B" />
        <StatCard
          label="Capaian Rata-Rata Fakultas"
          value={`${avg}%`}
          accent="#B8862E"
        />
        <StatCard
          label="Usulan Anggaran Menunggu"
          value={pendingProposals ?? 0}
          accent="#4A6FA5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
          <div className="font-serif text-[15px] font-semibold mb-3">
            Deadline Terdekat
          </div>
          {deadlineSoon.length === 0 && (
            <p className="text-sm text-[#5B5A55]">
              Tidak ada indikator yang mendekati deadline.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {deadlineSoon.map((a: any) => (
              <div
                key={a.id}
                className="flex justify-between text-sm border-b border-[#E1DDCF] pb-2 last:border-0"
              >
                <div>
                  <span className="font-semibold text-[#1B2A4B]">
                    {a.indicators.code}
                  </span>{" "}
                  — {a.indicators.name}
                </div>
                <span
                  className={`font-semibold ${a.days <= 3 ? "text-red-600" : "text-amber-600"}`}
                >
                  {a.days === 0 ? "Hari ini" : `${a.days} hari lagi`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
          <div className="font-serif text-[15px] font-semibold mb-3">
            Pengumuman Terbaru
          </div>
          {announcements?.length === 0 && (
            <p className="text-sm text-[#5B5A55]">Belum ada pengumuman.</p>
          )}
          <div className="flex flex-col gap-2">
            {announcements?.map((a) => (
              <div
                key={a.id}
                className="text-sm border-b border-[#E1DDCF] pb-2 last:border-0"
              >
                <div className="font-semibold">{a.title}</div>
                <div className="text-xs text-[#5B5A55]">{a.publish_date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
