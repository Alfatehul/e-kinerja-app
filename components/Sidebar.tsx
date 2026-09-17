"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navBiro = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  { href: "/admin/usulan-anggaran", label: "Usulan Anggaran" },
  { href: "/admin/usulan-revisi", label: "Usulan Revisi" },
  {
    href: "/admin/indikator",
    label: "Indikator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M7 16l4-5 3 2 5-7" />
      </svg>
    ),
  },
  {
    href: "/admin/monitoring",
    label: "Monitoring & Verifikasi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-5 3 3 5-7" />
      </svg>
    ),
  },
  {
    href: "/admin/fakultas",
    label: "Fakultas / Unit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-5h6v5" />
        <path d="M8 9h1" />
        <path d="M12 9h1" />
        <path d="M16 9h1" />
      </svg>
    ),
  },
  {
    href: "/admin/pengumuman",
    label: "Pengumuman",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 11a1 1 0 0 1 1-1h3l8-4v12l-8-4H5a1 1 0 0 1-1-1v-2z" />
        <path d="M16 9a4 4 0 0 1 0 6" />
      </svg>
    ),
  },
  {
    href: "/admin/memo",
    label: "Memo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h5" />
      </svg>
    ),
  },
  {
    href: "/admin/laporan",
    label: "Laporan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    ),
  },
  {
    href: "/admin/audit-log",
    label: "Audit Log",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Manajemen User",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const navFakultas = [
  {
    href: "/fakultas/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  { href: "/fakultas/usulan-anggaran", label: "Usulan Anggaran" },
  { href: "/fakultas/usulan-revisi", label: "Usulan Revisi" }, //baru ditambah
  {
    href: "/fakultas/indikator",
    label: "Daftar Indikator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M7 16l4-5 3 2 5-7" />
      </svg>
    ),
  },
  {
    href: "/fakultas/pengisian",
    label: "Pengisian Indikator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 4h16v16H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M8 17h8" />
      </svg>
    ),
  },
  {
    href: "/fakultas/pengumuman",
    label: "Pengumuman",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 11a1 1 0 0 1 1-1h3l8-4v12l-8-4H5a1 1 0 0 1-1-1v-2z" />
        <path d="M16 9a4 4 0 0 1 0 6" />
      </svg>
    ),
  },
  {
    href: "/fakultas/memo",
    label: "Memo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h5" />
      </svg>
    ),
  },
  {
    href: "/fakultas/laporan",
    label: "Laporan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </svg>
    ),
  },
  {
    href: "/fakultas/profil",
    label: "Profil",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];

interface SidebarProps {
  role: "biro" | "fakultas";
  isOpen?: boolean;
}

export default function Sidebar({ role, isOpen = true }: SidebarProps) {
  const pathname = usePathname();
  const items = role === "biro" ? navBiro : navFakultas;

  return (
    <aside
      className={`bg-[#094a26] text-white flex flex-col shrink-0 min-h-screen transition-all duration-300 ${
        isOpen ? "w-60" : "w-0 -translate-x-full overflow-hidden"
      }`}
    >
      {/* LOGO */}
      <div className="px-5 py-5 border-b border-white/10 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <img
              src="/logo uin.svg"
              alt="Logo UIN"
              className="w-10 h-10 object-contain"
            />
          </div>

          <div>
            <div className="font-serif text-lg font-bold leading-tight">
              E-Kinerja
            </div>
            <div className="text-[10px] text-white/50 tracking-wide">
              UNIVERSITAS
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto whitespace-nowrap">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm mb-0.5 border-l-[3px] transition-colors ${
                active
                  ? "bg-[#B8862E]/20 text-[#F3E4C3] border-[#B8862E] font-semibold"
                  : "text-white/70 border-transparent hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="w-5 h-5 shrink-0">{item.icon}</span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ROLE */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          Sistem
        </div>
        <div className="text-xs text-white/60 mt-1">E-Kinerja Universitas</div>
      </div>
    </aside>
  );
}
