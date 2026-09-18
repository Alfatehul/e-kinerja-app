import { createClient } from "@/lib/supabase/server";
import DashboardCharts from "@/components/DashboardCharts";

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

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: indicators } = await supabase
    .from("indicators")
    .select("id, target, deadline, code, name");
  const { data: assignments } = await supabase
    .from("indicator_assignments")
    .select("*");
  const { data: faculties } = await supabase
    .from("faculties")
    .select("id, name, code")
    .eq("status", "Aktif");
  const { count: pendingProposals } = await supabase
    .from("budget_proposals")
    .select("*", { count: "exact", head: true })
    .eq("status", "Diajukan");
  const { count: pendingTors } = await supabase
    .from("tors")
    .select("*", { count: "exact", head: true })
    .eq("status", "Diajukan");
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("publish_date", { ascending: false })
    .limit(3);

  const pct = (real: number, target: number) =>
    target ? Math.min(100, Math.round((real / target) * 1000) / 10) : 0;

  const totalIndicators = indicators?.length ?? 0;
  const avgCapaian =
    assignments && assignments.length > 0
      ? Math.round(
          assignments.reduce((s, a: any) => {
            const ind = indicators?.find((i) => i.id === a.indicator_id);
            return s + pct(a.realization, ind?.target ?? 0);
          }, 0) / assignments.length,
        )
      : 0;

  const facultyPerf = (faculties ?? []).map((f) => {
    const rel = (assignments ?? []).filter((a: any) => a.faculty_id === f.id);
    const avg =
      rel.length > 0
        ? Math.round(
            rel.reduce((s: number, a: any) => {
              const ind = indicators?.find((i) => i.id === a.indicator_id);
              return s + pct(a.realization, ind?.target ?? 0);
            }, 0) / rel.length,
          )
        : 0;
    return { name: f.code, capaian: avg };
  });

  const today = new Date();
  const deadlineSoon = (indicators ?? [])
    .filter((i) => i.deadline)
    .map((i) => ({
      ...i,
      days: Math.ceil(
        (new Date(i.deadline as string).getTime() - today.getTime()) / 86400000,
      ),
    }))
    .filter((i) => i.days >= 0 && i.days <= 14)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 flex-wrap">
        <StatCard
          label="Total Indikator"
          value={totalIndicators}
          accent="#1B2A4B"
        />
        <StatCard
          label="Capaian Rata-Rata Universitas"
          value={`${avgCapaian}%`}
          accent="#B8862E"
        />
        <StatCard
          label="Jumlah Fakultas Aktif"
          value={faculties?.length ?? 0}
          accent="#7A2331"
        />
        <StatCard
          label="Usulan Anggaran Menunggu"
          value={pendingProposals ?? 0}
          accent="#4A6FA5"
        />
        <StatCard
          label="TOR Menunggu Verifikasi"
          value={pendingTors ?? 0}
          accent="#3F6E52"
        />
      </div>

      <DashboardCharts data={facultyPerf} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
          <div className="font-serif text-[15px] font-semibold mb-3">
            Indikator Mendekati Deadline
          </div>
          {deadlineSoon.length === 0 && (
            <p className="text-sm text-[#5B5A55]">
              Tidak ada indikator yang mendekati deadline.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {deadlineSoon.map((i: any) => (
              <div
                key={i.id}
                className="flex justify-between text-sm border-b border-[#E1DDCF] pb-2 last:border-0"
              >
                <div>
                  <span className="font-semibold text-[#1B2A4B]">{i.code}</span>{" "}
                  — {i.name}
                </div>
                <span
                  className={`font-semibold ${i.days <= 3 ? "text-red-600" : "text-amber-600"}`}
                >
                  {i.days === 0 ? "Hari ini" : `${i.days} hari lagi`}
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
