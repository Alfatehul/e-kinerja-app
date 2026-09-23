"use client";

import Link from "next/link";
import { useState } from "react";
import type { AnnouncementSummary } from "./AnnouncementTicker";
import { dismissNotification } from "@/app/actions/notifications";
type AppNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  createdAt: string;
};

export default function AnnouncementNotifications({
  announcements,
  notifications,
  href,
}: {
  announcements: AnnouncementSummary[];
  notifications: AppNotification[];
  href: string;
}) {
  const [open, setOpen] = useState(false);
  const [visibleNotifications, setVisibleNotifications] = useState(notifications);

  async function handleDismiss(notificationId: string) {
    setVisibleNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId),
    );
    try {
      await dismissNotification(notificationId);
    } catch (error) {
      setVisibleNotifications(notifications);
      alert(error instanceof Error ? error.message : "Gagal menghapus notifikasi.");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifikasi penting, ${visibleNotifications.length} notifikasi`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-xl p-2.5 text-[#496056] transition hover:bg-[#EAF3ED] hover:text-[#0B5B35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5B35]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
        </svg>
        {(visibleNotifications.length > 0 || announcements.length > 0) && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C49A45] px-1 text-[9px] font-bold text-white">
            {visibleNotifications.length > 9 ? "9+" : visibleNotifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#EDF2EE] bg-[#F8FBF8] px-4 py-3">
            <p className="text-sm font-bold text-[#17231D]">Notifikasi penting</p>
            <Link href={href} onClick={() => setOpen(false)} className="text-xs font-bold text-[#0B5B35] hover:underline">
              Lihat semua
            </Link>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {visibleNotifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-[#849289]">Belum ada notifikasi.</p>
            ) : (
              visibleNotifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 border-b border-[#EDF2EE] px-4 py-3 last:border-0 hover:bg-[#F8FBF8]">
                  <Link href={notification.href} onClick={() => setOpen(false)} className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#334A3C]">{notification.title}</p>
                    <p className="mt-1 truncate text-xs text-[#64736A]">{notification.description}</p>
                    <p className="mt-1 text-[11px] text-[#849289]">{notification.createdAt}</p>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Hapus notifikasi ${notification.title}`}
                    onClick={() => void handleDismiss(notification.id)}
                    className="shrink-0 rounded-lg px-2 py-1 text-xs font-bold text-[#849289] hover:bg-[#EAF3ED] hover:text-[#0B5B35]"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
