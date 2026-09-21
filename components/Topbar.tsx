"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

const pageNames: Record<string, string> = {
  dashboard: "Dashboard",
  indikator: "Indikator",
  pengisian: "Pengisian Indikator",
  "usulan-anggaran": "Usulan Anggaran",
  "usulan-revisi": "Usulan Revisi",
  tor: "TOR",
  monitoring: "Monitoring & Verifikasi",
  fakultas: "Fakultas / Unit",
  pengumuman: "Pengumuman",
  memo: "Memo",
  laporan: "Laporan",
  "audit-log": "Audit Log",
  users: "Manajemen User",
  profil: "Profil",
};

function Icon({
  children,
  className = "h-5 w-5",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export default function Topbar({
  userName,
  roleLabel,
  onToggleSidebar,
}: {
  userName: string;
  roleLabel: string;
  onToggleSidebar?: () => void;
}) {
  const pathname = usePathname();
  const isFaculty = pathname.startsWith("/fakultas");
  const dashboardHref = isFaculty ? "/fakultas/dashboard" : "/admin/dashboard";
  const announcementHref = isFaculty ? "/fakultas/pengumuman" : "/admin/pengumuman";
  const segments = pathname.split("/").filter(Boolean);
  const currentSegment = segments[segments.length - 1] ?? "dashboard";
  const currentPage = pageNames[currentSegment] ?? roleLabel;
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-[#DCE6DF] bg-white/95 backdrop-blur">
      <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-xl p-2.5 text-[#496056] transition hover:bg-[#EAF3ED] hover:text-[#0B5B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5B35]"
            aria-label="Buka atau tutup navigasi"
          >
            <Icon>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </Icon>
          </button>

          <div className="hidden h-8 w-px bg-[#E5EEE8] sm:block" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#849289]">
              <Link href={dashboardHref} className="hidden transition hover:text-[#0B5B35] sm:inline">
                Beranda
              </Link>
              <span className="hidden sm:inline">/</span>
              <span className="truncate">{currentPage}</span>
            </div>
            <p className="mt-0.5 truncate text-sm font-bold text-[#17231D]">{currentPage}</p>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Navigasi cepat">
          <Link
            href={dashboardHref}
            className="hidden items-center gap-2 rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2 text-xs font-bold text-[#496056] transition hover:border-[#B8D8C1] hover:bg-[#EAF3ED] hover:text-[#0B5B35] lg:flex"
          >
            <Icon className="h-4 w-4"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></Icon>
            Dashboard
          </Link>
          <Link
            href={announcementHref}
            aria-label="Buka pengumuman"
            title="Pengumuman"
            className="relative rounded-xl p-2.5 text-[#496056] transition hover:bg-[#EAF3ED] hover:text-[#0B5B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5B35]"
          >
            <Icon><path d="M4 11a1 1 0 0 1 1-1h3l8-4v12l-8-4H5a1 1 0 0 1-1-1v-2Z" /><path d="M16 9a4 4 0 0 1 0 6" /></Icon>
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C49A45]" />
          </Link>
          <div className="mx-1 hidden h-8 w-px bg-[#E5EEE8] sm:block" />
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#DCEDE1] text-xs font-bold text-[#0B5B35] shadow-sm">
              {initials || "U"}
            </div>
            <div className="hidden min-w-0 md:block">
              <div className="max-w-[150px] truncate text-sm font-bold text-[#17231D]">{userName}</div>
              <div className="max-w-[150px] truncate text-[11px] text-[#718078]">{roleLabel}</div>
            </div>
          </div>
          <div className="hidden sm:block"><LogoutButton /></div>
        </nav>
      </div>
    </header>
  );
}
