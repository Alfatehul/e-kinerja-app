import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardPanel,
  DashboardStatCard,
  EmptyDashboardState,
} from "@/components/DashboardCard";
import DashboardAnnouncements, {
  type DashboardAnnouncement,
} from "@/components/DashboardAnnouncements";

type Assignment = {
  id: string;
  realization: number;
  status: string;
  indicators: {
    code: string;
    name: string;
    target: number;
    unit: string | null;
    deadline: string | null;
  } | null;
};

export default async function FakultasDashboardPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const [
    { data: assignments },
    { data: proposals },
    { data: revisions },
    { data: announcements },
  ] = await Promise.all([
    supabase
      .from("indicator_assignments")
      .select("id, realization, status, indicators(code, name, target, unit, deadline)")
      .eq("faculty_id", session!.profile.faculty_id),
    supabase
      .from("budget_proposals")
      .select("id, status, number, program, created_at")
      .eq("faculty_id", session!.profile.faculty_id)
      .order("created_at", { ascending: false }),
    supabase
      .from("budget_revisions")
      .select("id, status, number, created_at")
      .eq("faculty_id", session!.profile.faculty_id)
      .order("created_at", { ascending: false }),
    supabase.from("announcements").select("id, title, body, publish_date, pinned").order("pinned", { ascending: false }).order("publish_date", { ascending: false }).limit(4),
  ]);

  const assignmentData = (assignments ?? []).map((assignment) => ({
    ...assignment,
    indicators: Array.isArray(assignment.indicators)
      ? assignment.indicators[0] ?? null
      : assignment.indicators,
  })) as Assignment[];
  const pct = (realization: number, target: number) =>
    target ? Math.min(100, Math.round((realization / target) * 1000) / 10) : 0;
  const average =
    assignmentData.length > 0
      ? Math.round(
          (assignmentData.reduce((total, assignment) => total + pct(assignment.realization ?? 0, assignment.indicators?.target ?? 0), 0) /
            assignmentData.length) *
            10,
        ) / 10
      : 0;
  const statusCounts = ["Draft", "Diajukan", "Disetujui", "Ditolak"].map((status) => ({
    status,
    count: (proposals ?? []).filter((proposal) => proposal.status === status).length,
  }));
  const pendingRevision = (revisions ?? []).filter((revision) => revision.status === "Diajukan").length;
  const today = new Date();
  const deadlineSoon = assignmentData
    .filter((assignment) => assignment.indicators?.deadline)
    .map((assignment) => ({
      ...assignment,
      days: Math.ceil(
        (new Date(assignment.indicators!.deadline as string).getTime() - today.getTime()) /
          86400000,
      ),
    }))
    .filter((assignment) => assignment.days >= 0 && assignment.days <= 14)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);
  const completed = assignmentData.filter((assignment) => ["Selesai", "Diverifikasi"].includes(assignment.status)).length;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Ringkasan unit kerja</p>
        <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">Dashboard Fakultas / Unit</h1>
        <p className="mt-2 text-sm text-[#64736A]">Pantau progres indikator dan kelola pengajuan unit Anda dari satu tempat.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard label="Total indikator" value={assignmentData.length} hint="Indikator ditugaskan" />
        <DashboardStatCard label="Capaian rata-rata" value={`${average}%`} hint="Progres unit kerja" accent="gold" />
        <DashboardStatCard label="Sudah diverifikasi" value={completed} hint="Indikator selesai" accent="blue" />
        <DashboardStatCard label="Usulan berjalan" value={statusCounts.find((item) => item.status === "Diajukan")?.count ?? 0} hint="Menunggu proses biro" accent="red" />
        <DashboardStatCard label="Revisi berjalan" value={pendingRevision} hint="Revisi diajukan" accent="gold" />
      </div>

      <DashboardAnnouncements
        announcements={(announcements ?? []) as DashboardAnnouncement[]}
        href="/fakultas/pengumuman"
      />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <DashboardPanel title="Progres indikator" description="Ringkasan status indikator unit Anda" href="/fakultas/indikator">
          <div className="mb-5 flex items-end justify-between">
            <div><p className="text-4xl font-bold text-[#073B25]">{average}%</p><p className="mt-1 text-xs text-[#849289]">Capaian rata-rata saat ini</p></div>
            <span className="rounded-full bg-[#EAF3ED] px-3 py-1.5 text-xs font-bold text-[#0B5B35]">{completed}/{assignmentData.length} selesai</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#E8EFEA]"><div className="h-full rounded-full bg-[#C49A45] transition-all" style={{ width: `${average}%` }} /></div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Draft", "Diajukan", "Disetujui", "Ditolak"].map((status) => {
              const count = assignmentData.filter((assignment) => assignment.status === status).length;
              return <div key={status} className="rounded-xl border border-[#EDF2EE] p-3"><p className="text-[11px] text-[#849289]">{status}</p><p className="mt-1 text-xl font-bold text-[#173B27]">{count}</p></div>;
            })}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Deadline terdekat" description="Prioritas pengisian indikator">
          {deadlineSoon.length === 0 ? <EmptyDashboardState>Tidak ada deadline dalam 14 hari ke depan.</EmptyDashboardState> : (
            <div className="flex flex-col gap-3">
              {deadlineSoon.map((assignment) => (
                <Link key={assignment.id} href={`/fakultas/pengisian/${assignment.id}`} className="flex items-start justify-between gap-3 border-b border-[#EDF2EE] pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0"><p className="font-bold text-[#0B5B35]">{assignment.indicators?.code}</p><p className="truncate text-sm text-[#44534B]">{assignment.indicators?.name}</p></div>
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${assignment.days <= 3 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{assignment.days === 0 ? "Hari ini" : `${assignment.days} hari`}</span>
                </Link>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel title="Pengajuan anggaran terbaru" description="Pantau status usulan dan revisi unit" href="/fakultas/usulan-anggaran">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="space-y-3">
            {proposals?.slice(0, 3).map((proposal) => (
              <Link key={proposal.id} href={`/fakultas/usulan-anggaran/${proposal.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#EDF2EE] p-3 transition hover:border-[#B8D8C1]">
                <div><p className="text-sm font-semibold text-[#17231D]">{proposal.number}</p><p className="mt-1 text-xs text-[#849289]">{proposal.program}</p></div>
                <span className="rounded-full bg-[#F5F8F5] px-2.5 py-1 text-xs font-semibold text-[#5F796A]">{proposal.status}</span>
              </Link>
            ))}
            {(!proposals || proposals.length === 0) && <EmptyDashboardState>Belum ada usulan anggaran.</EmptyDashboardState>}
          </div>
        </div>
      </DashboardPanel>
    </div>
  );
}
