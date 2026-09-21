import { createClient } from "@/lib/supabase/server";
import { createTor } from "../actions";
import TorForm from "@/components/TorForm";
export default async function TambahTorPage() {
  const supabase = await createClient(); const { data: proposals } = await supabase.from("budget_proposals").select("id,number,program,kegiatan,uraian,total_anggaran,volume,harga_satuan,sumber_dana").order("created_at", { ascending: true });
  return <div className="mx-auto max-w-3xl"><h1 className="mb-2 text-2xl font-bold">Buat TOR</h1><p className="mb-6 text-sm text-[#64736A]">TOR disimpan sebagai draft dan dapat diajukan setelah ditinjau.</p><TorForm action={createTor} proposals={proposals ?? []} /></div>;
}
