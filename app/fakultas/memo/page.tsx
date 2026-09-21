import { createClient } from "@/lib/supabase/server";

type Memo = {
  id: string;
  title: string;
  body: string;
  target_faculty: string | null;
  publish_date: string | null;
  pinned: boolean;
};

export default async function FakultasMemoPage() {
  const { data: memos, error } = await (await createClient())
    .from("memos")
    .select("id, title, body, target_faculty, publish_date, pinned")
    .eq("status", "Diterbitkan")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Komunikasi internal</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Memo</h1>
        <p className="mt-2 text-sm text-[#64736A]">Informasi dan arahan resmi dari Biro untuk fakultas/unit.</p>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat memo: {error.message}</div>}
      <div className="flex flex-col gap-4">
        {(memos as Memo[] | null)?.map((memo) => (
          <article key={memo.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${memo.pinned ? "border-[#D7B96C]" : "border-[#DCE6DF]"}`}>
            {memo.pinned && <span className="rounded-full bg-[#F7F0D9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8A6B2E]">Disematkan</span>}
            <h2 className="mt-3 text-lg font-bold text-[#17231D]">{memo.title}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#52645A]">{memo.body}</p>
            <p className="mt-4 text-xs text-[#849289]">Untuk {memo.target_faculty ?? "Semua Fakultas"} · Terbit {memo.publish_date ?? "-"}</p>
          </article>
        ))}
        {(!memos || memos.length === 0) && !error && <div className="rounded-2xl border border-dashed border-[#C9DED0] bg-[#F8FBF8] px-4 py-12 text-center text-sm text-[#718078]">Belum ada memo yang diterbitkan.</div>}
      </div>
    </div>
  );
}
