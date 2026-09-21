"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  userName: string;
  role: "biro" | "fakultas";
  roleLabel: string;
}

export default function DashboardShell({
  children,
  userName,
  role,
  roleLabel,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#F5F7F5]">
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onNavigate={() => setIsSidebarOpen(false)}
      />
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Tutup navigasi"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[2px] md:hidden"
        />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={userName}
          roleLabel={roleLabel}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
