import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createThreadForFaculty, deleteThread } from "./actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export default async function AdminHelpdeskPage() {
  const supabase = await createClient();
  const [{ data: threads, error }, { data: faculties }] = await Promise.all([
    supabase
      .from("helpdesk_threads")
      .select("id, title, status, updated_at, faculties(name)")
      .order("updated_at", { ascending: false }),
    supabase
      .from("faculties")
      .select("id, name")
      .eq("status", "Aktif")
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Komunikasi</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Helpdesk</h1><p className="mt-2 text-sm text-[#64736A]">Kelola pertanyaan dan kendala dari Fakultas / Unit.</p></div>
      <form action={createThreadForFaculty} className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-[#17231D]">Mulai percakapan</h2>
        <p className="mt-1 text-xs text-[#849289]">Pilih Fakultas / Unit yang ingin dihubungi.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input name="title" required placeholder="Topik bantuan" className="form-input" />
          <select name="faculty_id" required defaultValue="" className="form-input">
            <option value="" disabled>Pilih Fakultas / Unit</option>
            {faculties?.map((faculty) => (
              <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
            ))}
          </select>
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">Buat chat</button>
        </div>
      </form>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Gagal memuat helpdesk: {error.message}</div>}
      <div className="flex flex-col gap-3">
        {threads?.map((thread) => {
          const faculty = Array.isArray(thread.faculties) ? thread.faculties[0] : thread.faculties;
          return (
            <div key={thread.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm transition hover:border-[#B9D7C1] hover:shadow-md">
              <Link href={`/admin/helpdesk/${thread.id}`} className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div><h2 className="font-bold text-[#17231D]">{thread.title}</h2><p className="mt-1 text-xs text-[#64736A]">{faculty?.name ?? "Fakultas / Unit"} · {new Date(thread.updated_at).toLocaleDateString("id-ID")}</p></div>
                  <span className="shrink-0 rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#0B5B35]">{thread.status}</span>
                </div>
              </Link>
              <form action={deleteThread.bind(null, thread.id)}>
                <ConfirmSubmitButton className="rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50" />
              </form>
            </div>
          );
        })}
        {(!threads || threads.length === 0) && !error && <div className="rounded-2xl border border-dashed border-[#C9DED0] bg-[#F8FBF8] px-4 py-12 text-center text-sm text-[#718078]">Belum ada percakapan helpdesk.</div>}
      </div>
    </div>
  );
}
