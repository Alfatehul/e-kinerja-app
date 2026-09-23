"use client";

import { useState } from "react";
import { updateOwnProfile } from "@/lib/profile-actions";

export default function ProfileForm({
  fullName,
  email,
  roleLabel,
  facultyName,
}: {
  fullName: string;
  email: string;
  roleLabel: string;
  facultyName?: string | null;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setMessage(null);
    setError(null);
    try {
      await updateOwnProfile(formData);
      setMessage("Profil berhasil diperbarui.");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Gagal memperbarui profil.");
    }
  }

  return (
    <form action={submit} className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#17231D]">Informasi akun</h2>
        <p className="mt-1 text-sm text-[#64736A]">Perbarui nama yang tampil di aplikasi.</p>
        <label className="mt-5 block text-sm font-semibold text-[#1B2A4B]">
          Nama lengkap
          <input name="full_name" required minLength={2} defaultValue={fullName} className="mt-1 w-full rounded-xl border border-[#D7E2DA] px-3 py-2.5 font-normal outline-none focus:border-[#0B5B35]" />
        </label>
        <div className="mt-4 text-sm">
          <p className="font-semibold text-[#1B2A4B]">Email</p>
          <p className="mt-1 break-all text-[#64736A]">{email}</p>
        </div>
        <div className="mt-4 text-sm">
          <p className="font-semibold text-[#1B2A4B]">Peran</p>
          <p className="mt-1 text-[#64736A]">{roleLabel}</p>
        </div>
        {facultyName && (
          <div className="mt-4 text-sm">
            <p className="font-semibold text-[#1B2A4B]">Fakultas / Unit</p>
            <p className="mt-1 text-[#64736A]">{facultyName}</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-[#17231D]">Keamanan</h2>
        <p className="mt-1 text-sm text-[#64736A]">Kosongkan jika tidak ingin mengubah password.</p>
        <label className="mt-5 block text-sm font-semibold text-[#1B2A4B]">
          Password baru
          <input type="password" name="password" minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-xl border border-[#D7E2DA] px-3 py-2.5 font-normal outline-none focus:border-[#0B5B35]" />
        </label>
        <label className="mt-4 block text-sm font-semibold text-[#1B2A4B]">
          Konfirmasi password
          <input type="password" name="password_confirmation" minLength={8} autoComplete="new-password" className="mt-1 w-full rounded-xl border border-[#D7E2DA] px-3 py-2.5 font-normal outline-none focus:border-[#0B5B35]" />
        </label>
        {message && <p className="mt-4 rounded-xl bg-[#EAF3ED] px-3 py-2 text-sm font-semibold text-[#0B5B35]">{message}</p>}
        {error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" className="mt-5 rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#084728]">
          Simpan perubahan
        </button>
      </section>
    </form>
  );
}
