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
    <div className="flex min-h-screen bg-[#F6F4EF]">
      <Sidebar role={role} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userName={userName}
          roleLabel={roleLabel}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
