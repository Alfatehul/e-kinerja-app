import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DashboardCharts from "@/components/DashboardCharts";
import {
  DashboardPanel,
  DashboardStatCard,
  EmptyDashboardState,
} from "@/components/DashboardCard";

type Indicator = {
  id: string;
  target: number;
  deadline: string | null;
  code: string;
  name: string;
};
type Assignment = {
  id: string;
  indicator_id: string;
  faculty_id: string;
  realization: number;
  status: string;
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [
    { data: indicators },
    { data: assignments },
    { data: faculties },
    { data: proposals },
    { data: revisions },
    { data: announcements },
  ] = await Promise.all([
    supabase.from("indicators").select("id, target, deadline, code, name"),
    supabase
      .from("indicator_assignments")
      .select("id, indicator_id, faculty_id, realization, status"),
    supabase.from("faculties").select("id, name, code").eq("status", "Aktif"),
    supabase
      .from("budget_proposals")
      .select("id, status, number, program, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("budget_revisions")
      .select("id, status, number, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("announcements")
      .select("id, title, publish_date")
      .order("publish_date", { ascending: false })
      .limit(4),
  ]);

  const indicatorData = (indicators ?? []) as Indicator[];
  const assignmentData = (assignments ?? []) as Assignment[];
  const pct = (realization: number, target: number) =>
    target ? Math.min(100, Math.round((realization / target) * 1000) / 10) : 0;
  const totalIndicators = indicatorData.length;
  const avgCapaian =
    assignmentData.length > 0
      ? Math.round(
          (assignmentData.reduce((total, assignment) => {
            const indicator = indicatorData.find(
              (item) => item.id === assignment.indicator_id,
            );
            return (
              total + pct(assignment.realization ?? 0, indicator?.target ?? 0)
            );
          }, 0) /
            assignmentData.length) *
            10,
        ) / 10
      : 0;
  const proposalCounts = ["Diajukan", "Disetujui", "Ditolak"].map((status) => ({
    status,
    count: (proposals ?? []).filter((proposal) => proposal.status === status)
      .length,
  }));
  const revisionWaiting = (revisions ?? []).filter(
    (revision) => revision.status === "Diajukan",
  ).length;
  const pendingProposals =
    proposalCounts.find((item) => item.status === "Diajukan")?.count ?? 0;
  const today = new Date();
  const deadlineSoon = indicatorData
    .filter((indicator) => indicator.deadline)
    .map((indicator) => ({
      ...indicator,
      days: Math.ceil(
        (new Date(indicator.deadline as string).getTime() - today.getTime()) /
          86400000,
      ),
    }))
    .filter((indicator) => indicator.days >= 0 && indicator.days <= 14)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);
  const facultyPerf = (faculties ?? []).map((faculty) => {
    const related = assignmentData.filter(
      (assignment) => assignment.faculty_id === faculty.id,
    );
    const average =
      related.length > 0
        ? Math.round(
            (related.reduce((total, assignment) => {
              const indicator = indicatorData.find(
                (item) => item.id === assignment.indicator_id,
              );
              return (
                total + pct(assignment.realization ?? 0, indicator?.target ?? 0)
              );
            }, 0) /
              related.length) *
              10,
          ) / 10
        : 0;
    return { name: faculty.code ?? faculty.name.slice(0, 8), capaian: average };
  });

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">
          Ringkasan universitas
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
          Dashboard Admin Biro
        </h1>
        <p className="text-sm text-[#64736A]">
          Pantau kesehatan kinerja, pengajuan, dan aktivitas seluruh unit kerja.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardStatCard
          label="Indikator aktif"
          value={totalIndicators}
          hint="Total indikator terdaftar"
        />
        <DashboardStatCard
          label="Capaian universitas"
          value={`${avgCapaian}%`}
          hint="Rata-rata seluruh assignment"
          accent="gold"
        />
        <DashboardStatCard
          label="Fakultas / unit"
          value={faculties?.length ?? 0}
          hint="Unit kerja aktif"
          accent="blue"
        />
        <DashboardStatCard
          label="Menunggu biro"
          value={pendingProposals}
          hint="Usulan anggaran diajukan"
          accent="red"
        />
        <DashboardStatCard
          label="Revisi masuk"
          value={revisionWaiting}
          hint="Perlu ditinjau"
          accent="gold"
        />
      </div>

      <DashboardCharts data={facultyPerf} />

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <DashboardPanel
          title="Status pengajuan"
          description="Distribusi status usulan anggaran terbaru"
          href="/admin/usulan-anggaran"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {proposalCounts.map((item) => (
              <Link
                key={item.status}
                href={`/admin/usulan-anggaran?status=${encodeURIComponent(item.status)}`}
                className="rounded-xl border border-[#E5EEE8] bg-[#F8FBF8] p-4 transition hover:border-[#B8D8C1]"
              >
                <p className="text-xs text-[#718078]">{item.status}</p>
                <p className="mt-2 text-2xl font-bold text-[#173B27]">
                  {item.count}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-[#F7F4EA] px-4 py-3 text-xs text-[#80662E]">
            {revisionWaiting > 0
              ? `${revisionWaiting} usulan revisi menunggu pemeriksaan.`
              : "Tidak ada revisi yang menunggu pemeriksaan."}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Deadline terdekat"
          description="Indikator yang perlu mendapat perhatian"
        >
          {deadlineSoon.length === 0 ? (
            <EmptyDashboardState>
              Tidak ada deadline dalam 14 hari ke depan.
            </EmptyDashboardState>
          ) : (
            <div className="flex flex-col gap-3">
              {deadlineSoon.map((indicator) => (
                <div
                  key={indicator.id}
                  className="flex items-start justify-between gap-3 border-b border-[#EDF2EE] pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#0B5B35]">{indicator.code}</p>
                    <p className="truncate text-sm text-[#44534B]">
                      {indicator.name}
                    </p>
                  </div>
                  <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${indicator.days <= 3 ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}
                  >
                    {indicator.days === 0
                      ? "Hari ini"
                      : `${indicator.days} hari`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel
        title="Aktivitas terbaru"
        description="Informasi penting untuk admin biro"
        href="/admin/pengumuman"
      >
        {announcements?.length === 0 ? (
          <EmptyDashboardState>
            Belum ada pengumuman terbaru.
          </EmptyDashboardState>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {announcements?.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-xl border border-[#EDF2EE] p-4"
              >
                <p className="text-sm font-semibold text-[#17231D]">
                  {announcement.title}
                </p>
                <p className="mt-2 text-xs text-[#849289]">
                  {announcement.publish_date}
                </p>
              </div>
            ))}
          </div>
        )}
      </DashboardPanel>
    </div>
  );
}
