import { createClient } from "@/lib/supabase/server";

export default async function PengumumanFakultasPage() {
  const supabase = await createClient();
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">Komunikasi publik</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Pengumuman</h1>
        <p className="mt-2 text-sm leading-6 text-[#64736A]">Informasi dan arahan terbaru dari Biro untuk Fakultas / Unit.</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat pengumuman: {error.message}</div>}
      <div className="flex flex-col gap-4">
        {announcements?.map((announcement) => (
          <article key={announcement.id} className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6 ${announcement.pinned ? "border-[#D7B96C]" : "border-[#DCE6DF]"}`}>
            <div className="flex flex-wrap items-center gap-2">
              {announcement.pinned && <span className="rounded-full bg-[#F7F0D9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8A6B2E]">Disematkan</span>}
              <span className="rounded-full bg-[#EAF3ED] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#0B5B35]">Pengumuman</span>
            </div>
            <h2 className="mt-3 text-lg font-bold text-[#17231D]">{announcement.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#52645A]">{announcement.body}</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#849289]">
              <span>Untuk: {announcement.target_faculty}</span>
              <span>Terbit: {announcement.publish_date}</span>
              {announcement.end_date && <span>Berakhir: {announcement.end_date}</span>}
            </div>
          </article>
        ))}
        {(!announcements || announcements.length === 0) && !error && <div className="rounded-2xl border border-dashed border-[#C9DED0] bg-[#F8FBF8] px-4 py-14 text-center text-sm text-[#718078]">Belum ada pengumuman yang diterbitkan.</div>}
      </div>
    </div>
  );
}
