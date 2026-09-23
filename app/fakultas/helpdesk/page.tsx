import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createThread } from "./actions";

export default async function FakultasHelpdeskPage() {
  const supabase = await createClient();
  const { data: threads, error } = await supabase
    .from("helpdesk_threads")
    .select("id, title, status, created_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Komunikasi</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Helpdesk</h1>
        <p className="mt-2 text-sm text-[#64736A]">Sampaikan pertanyaan atau kendala kepada Admin Biro.</p>
      </div>
      <form action={createThread} className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <label htmlFor="title" className="mb-2 block text-sm font-bold text-[#334A3C]">Topik bantuan</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input id="title" name="title" required placeholder="Contoh: Kendala pengajuan anggaran" className="form-input" />
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">Buat percakapan</button>
        </div>
      </form>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat helpdesk: {error.message}</div>}
      <div className="flex flex-col gap-3">
        {threads?.map((thread) => (
          <Link key={thread.id} href={`/fakultas/helpdesk/${thread.id}`} className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm transition hover:border-[#B9D7C1] hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="font-bold text-[#17231D]">{thread.title}</h2><p className="mt-1 text-xs text-[#849289]">{new Date(thread.updated_at).toLocaleDateString("id-ID")}</p></div>
              <span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#0B5B35]">{thread.status}</span>
            </div>
          </Link>
        ))}
        {(!threads || threads.length === 0) && !error && <div className="rounded-2xl border border-dashed border-[#C9DED0] bg-[#F8FBF8] px-4 py-12 text-center text-sm text-[#718078]">Belum ada percakapan helpdesk.</div>}
      </div>
    </div>
  );
}
