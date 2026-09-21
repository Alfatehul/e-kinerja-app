import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

export default async function TorPage() {
  const session = await getCurrentProfile(); const supabase = await createClient();
  const { data } = await supabase.from("budget_tors").select("*").eq("faculty_id", session!.profile.faculty_id).order("created_at", { ascending: false });
  return <div className="mx-auto flex max-w-7xl flex-col gap-5"><div className="flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan</p><h1 className="mt-1 text-2xl font-bold">TOR</h1><p className="mt-2 text-sm text-[#64736A]">Buat dan pantau Kerangka Acuan Kerja unit Anda.</p></div><Link href="/fakultas/tor/tambah" className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white">+ Buat TOR</Link></div>
    <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm"><table className="w-full text-sm"><thead className="border-b bg-[#F5F8F5] text-left text-xs uppercase text-[#64736A]"><tr><th className="px-4 py-3">No. TOR</th><th className="px-4 py-3">Judul</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th></tr></thead><tbody>{data?.map((tor) => <tr key={tor.id} className="border-b border-[#EDF2EE]"><td className="px-4 py-4 font-bold text-[#0B5B35]">{tor.number}</td><td className="px-4 py-4 font-semibold">{tor.judul}</td><td className="px-4 py-4">{tor.program}</td><td className="px-4 py-4"><StatusBadge status={tor.status} /></td><td className="px-4 py-4"><TableActionLink href={`/fakultas/tor/${tor.id}`} /></td></tr>)}{!data?.length && <tr><td colSpan={5} className="px-4 py-12 text-center text-[#64736A]">Belum ada TOR.</td></tr>}</tbody></table></div>
  </div>;
}
