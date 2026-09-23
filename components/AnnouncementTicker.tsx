"use client";

import Link from "next/link";

export type AnnouncementSummary = {
  id: string;
  title: string;
  body?: string | null;
  publish_date: string | null;
  pinned?: boolean;
};

export default function AnnouncementTicker({
  announcements,
  href,
}: {
  announcements: AnnouncementSummary[];
  href: string;
}) {
  if (announcements.length === 0) return null;

  const items = announcements.map((announcement) => announcement.title).join("   •   ");

  return (
    <div className="print-hidden border-b border-[#E8DDBB] bg-[#FFF9E8] px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden">
        <span className="shrink-0 rounded-full bg-[#F3E5B8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#80662E]">
          Info
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="ticker-track whitespace-nowrap text-xs font-medium text-[#705A28]">
            <Link href={href} className="hover:underline">
              {items}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
