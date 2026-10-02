import { DashboardPanel, EmptyDashboardState } from "@/components/DashboardCard";

export type FacultyAchievement = {
  faculty_id: string;
  faculty_name: string;
  assignment_count: number;
  average_capaian: number;
};

export default function FacultyAchievementRanking({
  achievements,
}: {
  achievements: FacultyAchievement[];
}) {
  return (
    <DashboardPanel
      title="Capaian setiap fakultas dan unit"
      description="Perbandingan rata-rata capaian indikator seluruh unit kerja aktif"
    >
      {achievements.length === 0 ? (
        <EmptyDashboardState>Belum ada data capaian fakultas atau unit.</EmptyDashboardState>
      ) : (
        <ol className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {achievements.map((faculty, index) => {
            const achievement = Number(faculty.average_capaian);
            const barColor =
              achievement >= 80
                ? "bg-[#3F6E52]"
                : achievement >= 50
                  ? "bg-[#B8862E]"
                  : "bg-[#A6323A]";

            return (
              <li key={faculty.faculty_id} className="min-w-0">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3F8F4] text-xs font-bold text-[#64736A]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#334A3C]">
                        {faculty.faculty_name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#849289]">
                        {faculty.assignment_count} indikator
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-[#17231D]">
                    {achievement}%
                  </span>
                </div>
                <div
                  className="h-2.5 overflow-hidden rounded-full bg-[#E8EFEA]"
                  role="progressbar"
                  aria-label={`Capaian ${faculty.faculty_name}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={achievement}
                >
                  <div
                    className={`achievement-bar h-full rounded-full ${barColor}`}
                    style={{
                      width: `${Math.min(100, Math.max(0, achievement))}%`,
                      animationDelay: `${Math.min(index, 8) * 40}ms`,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardPanel>
  );
}
