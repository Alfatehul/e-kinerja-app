import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateProposal } from "../../actions";
export default async function EditUsulanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("id", id)
    .single();
  if (!proposal) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProposal(id, formData);
  }

  const totalAnggaran =
    proposal.total_anggaran ?? proposal.volume * proposal.harga_satuan;

  return (
    <div className="mx-auto w-full max-w-3xl pb-10">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Pengajuan anggaran
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Edit Usulan Anggaran
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#64736A]">
          Perbarui informasi usulan sebelum diajukan kembali untuk proses
          verifikasi.
        </p>
      </div>
      <form
        action={handleUpdate}
        className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-[0_12px_35px_rgba(23,35,29,0.06)]"
      >
        <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-6 py-5">
          <h2 className="text-base font-bold text-[#14532D]">
            Informasi usulan
          </h2>
          <p className="mt-1 text-xs text-[#64736A]">
            Nomor usulan: {proposal.number}
          </p>
        </div>
        <div className="flex flex-col gap-5 p-6">
        <div>
          <label htmlFor="program" className="mb-2 block text-sm font-semibold text-[#334A3C]">Program</label>
          <input
            id="program"
            name="program"
            required
            defaultValue={proposal.program}
            className="form-input"
          />
        </div>
        <div>
            <label htmlFor="kegiatan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Kegiatan</label>
            <input
              id="kegiatan"
              name="kegiatan"
              defaultValue={proposal.kegiatan ?? ""}
              className="form-input"
            />
        </div>
        <div>
          <label htmlFor="uraian" className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Uraian Kebutuhan
          </label>
          <textarea
            id="uraian"
            name="uraian"
            required
            defaultValue={proposal.uraian}
            className="form-input min-h-[140px] resize-y"
          />
        </div>
        <div>
            <label htmlFor="total_anggaran" className="mb-2 block text-sm font-semibold text-[#334A3C]">
              Total Anggaran (Rp)
            </label>
            <input
              id="total_anggaran"
              name="total_anggaran"
              type="number"
              required
              min="0"
              defaultValue={totalAnggaran}
              className="form-input"
            />
        </div>
        <div>
          <label htmlFor="tor_link" className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Link Dokumen TOR <span className="font-normal text-[#849289]">(opsional)</span>
          </label>
          <input
            id="tor_link"
            name="tor_link"
            type="url"
            defaultValue={proposal.tor_link ?? ""}
            placeholder="https://drive.google.com/..."
            className="form-input"
          />
        </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#DCE6DF] bg-[#F8FBF8] px-6 py-4 sm:flex-row sm:justify-end">
          <Link href={`/fakultas/usulan-anggaran/${id}`} className="rounded-xl border border-[#DCE6DF] px-5 py-2.5 text-center text-sm font-semibold text-[#64736A] transition hover:bg-[#F5F8F5]">
            Batal
          </Link>
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]">
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
