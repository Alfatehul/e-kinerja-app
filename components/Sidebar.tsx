"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

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
  {
    href: "/admin/usulan-anggaran",
    label: "Usulan Anggaran",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 7.5 12 4l8 3.5L12 11 4 7.5Z" />
        <path d="M6 10v5.5c0 1.7 2.7 3 6 3s6-1.3 6-3V10" />
        <path d="M20 8v6" />
      </svg>
    ),
  },
  {
    href: "/admin/usulan-revisi",
    label: "Usulan Revisi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 5h10l4 4v10H5z" />
        <path d="M14 5v5h5" />
        <path d="m9 15 5-5 2 2-5 5-3 1 1-3Z" />
      </svg>
    ),
  },
  {
    href: "/admin/tor",
    label: "TOR",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h5" />
      </svg>
    ),
  },
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

  {
    href: "/fakultas/usulan-anggaran",
    label: "Usulan Anggaran",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 7.5 12 4l8 3.5L12 11 4 7.5Z" />
        <path d="M6 10v5.5c0 1.7 2.7 3 6 3s6-1.3 6-3V10" />
        <path d="M20 8v6" />
      </svg>
    ),
  },
  {
    href: "/fakultas/usulan-revisi",
    label: "Usulan Revisi",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M5 5h10l4 4v10H5z" />
        <path d="M14 5v5h5" />
        <path d="m9 15 5-5 2 2-5 5-3 1 1-3Z" />
      </svg>
    ),
  },
  {
    href: "/fakultas/tor",
    label: "TOR",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h5" />
      </svg>
    ),
  },

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
  onNavigate?: () => void;
}

export default function Sidebar({
  role,
  isOpen = true,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const items = role === "biro" ? navBiro : navFakultas;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 overflow-hidden bg-[#EAF3ED] text-[#294438] flex flex-col shadow-2xl transition-all duration-300 md:relative md:inset-auto md:z-auto md:shadow-none md:min-h-screen ${
        isOpen
          ? "translate-x-0 md:w-64"
          : "-translate-x-full md:w-0 md:overflow-hidden"
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#B9D7C1]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-20 h-48 w-48 rounded-full bg-[#E7D6A8]/45 blur-3xl" />

      {/* BRANDING */}
      <div className="relative border-b border-[#D4E3D8] px-5 pb-5 pt-6 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F2DFA9] via-[#D7B96C] to-[#B28A3D] shadow-md shadow-[#9D7B39]/20">
            <div className="absolute inset-[3px] rounded-[13px] border border-white/55" />
            <span className="relative text-xl font-black tracking-tighter text-[#365443]">
              EK
            </span>
          </div>
          <div>
            <div className="text-[17px] font-bold leading-tight tracking-tight text-[#1F3B2D]">
              E-Kinerja
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#6E8B78]">
              UIN Ar-Raniry
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#D4E3D8] bg-white/60 px-3 py-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
            <Image src="/logo uin.svg" alt="" width={20} height={20} className="h-full w-full object-contain" />
          </div>
          <span className="text-[11px] text-[#6E8476]">Sistem kinerja universitas</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-5 whitespace-nowrap">
        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#80998A]">
          Menu utama
        </div>
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group relative mb-1 flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition-all ${
                active
                  ? "border-[#C8DED0] bg-white/85 font-semibold text-[#1F4B35] shadow-sm"
                  : "border-transparent text-[#5F796A] hover:bg-white/65 hover:text-[#294438]"
              }`}
            >
              {active && (
                <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-[#C49A45]" />
              )}
              <span className="w-5 h-5 shrink-0 flex items-center justify-center">
                {item.icon ? (
                  <span className={`transition-transform group-hover:scale-110 ${active ? "text-[#B28638]" : ""}`}>
                    {item.icon}
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                )}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ROLE */}
      <div className="relative border-t border-[#D4E3D8] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl border border-[#D4E3D8] bg-white/55 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2E8C9] text-[#A47A2D]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth="1.8">
              <path d="M12 3 4 7v5c0 4.6 3.4 7.7 8 9 4.6-1.3 8-4.4 8-9V7l-8-4Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#80998A]">Sistem</div>
            <div className="mt-0.5 text-xs text-[#5F796A]">E-Kinerja Universitas</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
