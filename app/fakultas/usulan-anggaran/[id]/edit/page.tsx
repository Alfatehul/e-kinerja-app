import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateProposal } from "../../actions";
import SubmitButton from "@/components/SubmitButton";
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
        <div className="border-b border-[#EDF2EE] pb-5">
          <h2 className="text-base font-bold text-[#17231D]">Klasifikasi anggaran</h2>
          <p className="mt-1 text-xs text-[#849289]">Perbarui struktur program dan keluaran usulan.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["kementerian_lembaga", "Kementerian Negara / Lembaga"],
            ["unit_eselon", "Unit Eselon I / II"],
            ["satker", "Satker"],
            ["sasaran_kegiatan", "Sasaran Kegiatan"],
            ["klasifikasi_rincian_output", "Klasifikasi Rincian Output"],
            ["rincian_output", "Rincian Output"],
            ["indikator_ro", "Indikator RO"],
            ["satuan_ukuran_keluaran", "Satuan Ukuran Keluaran"],
          ].map(([name, label]) => (
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm font-semibold text-[#334A3C]">{label}</label>
              <input id={name} name={name} required defaultValue={proposal[name] ?? ""} className="form-input" />
            </div>
          ))}
          <div>
            <label htmlFor="volume_keluaran" className="mb-2 block text-sm font-semibold text-[#334A3C]">Volume Keluaran</label>
            <input id="volume_keluaran" name="volume_keluaran" type="number" min="0" step="any" required defaultValue={proposal.volume_keluaran ?? ""} className="form-input" />
          </div>
        </div>
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
        <div className="rounded-2xl border border-[#DCE6DF] bg-[#FAFCFA] p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#334A3C]">Rincian kebutuhan</h3>
            <p className="mt-1 text-xs text-[#849289]">Semua field berikut bersifat opsional.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["sumber_dana", "Sumber Dana", "text", proposal.sumber_dana],
              ["satuan", "Satuan", "text", proposal.satuan],
            ].map(([name, label, type, value]) => (
              <div key={name as string}>
                <label htmlFor={name as string} className="mb-2 block text-sm font-semibold text-[#334A3C]">{label as string} <span className="font-normal text-[#849289]">(opsional)</span></label>
                <input id={name as string} name={name as string} type={type as string} defaultValue={(value as string) ?? ""} className="form-input" />
              </div>
            ))}
            {[
              ["volume", "Volume", proposal.volume],
              ["harga_satuan", "Harga Satuan (Rp)", proposal.harga_satuan],
              ["jumlah", "Jumlah (Rp)", proposal.jumlah],
            ].map(([name, label, value]) => (
              <div key={name as string}>
                <label htmlFor={name as string} className="mb-2 block text-sm font-semibold text-[#334A3C]">{label as string} <span className="font-normal text-[#849289]">(opsional)</span></label>
                <input id={name as string} name={name as string} type="number" min="0" step="any" defaultValue={value ?? ""} className="form-input" />
              </div>
            ))}
          </div>
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
        <div>
          <label htmlFor="rab_link" className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Link Dokumen RAB <span className="font-normal text-[#849289]">(opsional)</span>
          </label>
          <input id="rab_link" name="rab_link" type="url" defaultValue={proposal.rab_link ?? ""} placeholder="https://drive.google.com/..." className="form-input" />
        </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#DCE6DF] bg-[#F8FBF8] px-6 py-4 sm:flex-row sm:justify-end">
          <Link href={`/fakultas/usulan-anggaran/${id}`} className="rounded-xl border border-[#DCE6DF] px-5 py-2.5 text-center text-sm font-semibold text-[#64736A] transition hover:bg-[#F5F8F5]">
            Batal
          </Link>
          <SubmitButton label="Simpan Perubahan" loadingLabel="Menyimpan perubahan..." className="px-5 py-2.5" />
        </div>
      </form>
    </div>
  );
}
