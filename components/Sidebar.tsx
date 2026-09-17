"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navBiro = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/indikator", label: "Indikator" },
  { href: "/admin/monitoring", label: "Monitoring & Verifikasi" },
  { href: "/admin/fakultas", label: "Fakultas / Unit" },
  { href: "/admin/pengumuman", label: "Pengumuman" },
  { href: "/admin/memo", label: "Memo" },
  { href: "/admin/laporan", label: "Laporan" },
  { href: "/admin/audit-log", label: "Audit Log" },
  { href: "/admin/users", label: "Manajemen User" },
];

const navFakultas = [
  { href: "/fakultas/dashboard", label: "Dashboard" },
  { href: "/fakultas/indikator", label: "Daftar Indikator" },
  { href: "/fakultas/pengisian", label: "Pengisian Indikator" },
  { href: "/fakultas/pengumuman", label: "Pengumuman" },
  { href: "/fakultas/memo", label: "Memo" },
  { href: "/fakultas/laporan", label: "Laporan" },
  { href: "/fakultas/profil", label: "Profil" },
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
      className={`bg-[#131F38] text-white flex flex-col shrink-0 min-h-screen transition-all duration-300 ${
        isOpen ? "w-60" : "w-0 -translate-x-full overflow-hidden"
      }`}
    >
      <div className="px-5 py-5 font-serif text-lg font-bold border-b border-white/10 whitespace-nowrap">
        E-Kinerja
      </div>
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto whitespace-nowrap">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2.5 rounded-md text-sm mb-0.5 border-l-[3px] ${
                active
                  ? "bg-[#B8862E]/20 text-[#F3E4C3] border-[#B8862E] font-semibold"
                  : "text-white/70 border-transparent hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
