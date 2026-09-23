import Link from "next/link";

export type DashboardAnnouncement = {
  id: string;
  title: string;
  body?: string | null;
  publish_date: string | null;
  pinned?: boolean | null;
};

function formatDate(value: string | null) {
  if (!value) return "Tanggal belum ditentukan";
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DashboardAnnouncements({
  announcements,
  href,
}: {
  announcements: DashboardAnnouncement[];
  href: string;
}) {
  const [featured, ...rest] = announcements;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#D8E7DC] bg-white shadow-[0_10px_28px_rgba(23,59,39,0.07)]">
      <div className="flex flex-col justify-between gap-3 border-b border-[#D9E5DC] bg-gradient-to-r from-[#EAF2EC] via-[#EEF4EF] to-[#F5F3EA] px-4 py-3.5 text-[#3E5548] sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-[#6C8876]">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
              <path d="M4 11a1 1 0 0 1 1-1h3l8-4v12l-8-4H5a1 1 0 0 1-1-1v-2Z" />
              <path d="M16 9a4 4 0 0 1 0 6M6 14l1.5 5h2L8 14" />
            </svg>
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#789182]">Pusat informasi</p>
            <h2 className="mt-0.5 text-base font-bold text-[#3E5548]">Pengumuman penting</h2>
          </div>
        </div>
        <Link href={href} className="inline-flex items-center gap-2 self-start rounded-lg border border-[#C9DCCF] bg-white/60 px-3 py-1.5 text-[11px] font-bold text-[#527160] transition hover:bg-white sm:self-auto">
          Lihat semua
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      {featured ? (
        <div className="grid bg-[#FFFDFC] lg:grid-cols-[1.15fr_0.85fr]">
          <Link href={href} className="group border-b border-[#E2E7E2] p-4 transition hover:bg-[#F3F5F2] sm:p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2">
              {featured.pinned && <span className="rounded-full bg-[#E9E4D3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#74633B]">Disematkan</span>}
              <span className="text-xs font-semibold text-[#707A73]">{formatDate(featured.publish_date)}</span>
            </div>
            <h3 className="mt-3 max-w-2xl text-lg font-bold leading-tight text-[#34463B] transition group-hover:text-[#527160] sm:text-xl">
              {featured.title}
            </h3>
            {featured.body && <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#68736B]">{featured.body}</p>}
            <span className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-[#527160]">Baca pengumuman <span aria-hidden="true">↗</span></span>
          </Link>

          <div className="divide-y divide-[#E5EEE8]">
            {rest.slice(0, 3).map((announcement) => (
              <Link key={announcement.id} href={href} className="group block px-4 py-3 transition hover:bg-[#F3F5F2] sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-[#707A73]">{formatDate(announcement.publish_date)}</span>
                  {announcement.pinned && <span className="text-[10px] font-bold text-[#74633B]">PIN</span>}
                </div>
                <p className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-[#53645A] transition group-hover:text-[#527160]">{announcement.title}</p>
              </Link>
            ))}
            {rest.length === 0 && <div className="flex h-full items-center px-5 py-8 text-sm text-[#849289] sm:px-6">Belum ada pengumuman lainnya.</div>}
          </div>
        </div>
      ) : (
        <div className="px-5 py-10 text-center text-sm text-[#64736A]">Belum ada pengumuman terbaru.</div>
      )}
    </section>
  );
}
