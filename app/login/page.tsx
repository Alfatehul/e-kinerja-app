"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !signInData.user) {
      setLoading(false);
      setError("Email atau password salah. Silakan coba lagi.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", signInData.user.id)
      .single();
    setLoading(false);
    router.push(profile?.role === "admin_biro" ? "/admin/dashboard" : "/fakultas/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f7f3] px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#b8d9c2]/50 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-[#e8d4a2]/40 blur-3xl" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_24px_80px_rgba(7,59,37,0.12)] md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-[#073b25] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <img src="/logo uin.svg" alt="Logo UIN Ar-Raniry" className="h-16 w-16 object-contain" />
            <p className="mt-10 text-sm font-medium uppercase tracking-[0.25em] text-emerald-100/70">Portal resmi</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Kelola kinerja dengan lebih terarah.</h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-emerald-50/70">
              Satu ruang kerja untuk memantau indikator, mengelola usulan, dan melihat capaian unit kerja.
            </p>
          </div>
          <p className="text-xs text-emerald-100/50">UIN Ar-Raniry Banda Aceh</p>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mb-8 flex items-center gap-3 md:hidden">
            <img src="/logo uin.svg" alt="Logo UIN Ar-Raniry" className="h-12 w-12 object-contain" />
            <div>
              <p className="font-bold text-[#073b25]">E-Kinerja</p>
              <p className="text-xs text-slate-500">UIN Ar-Raniry</p>
            </div>
          </div>
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#0b5b35]">Selamat datang kembali</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Masuk ke akun Anda</h2>
            <p className="mt-2 text-sm text-slate-500">Gunakan akun resmi untuk melanjutkan ke dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="nama@uinarraniry.ac.id"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white" />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                required placeholder="Masukkan password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white" />
            </div>
            {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading}
              className="w-full rounded-xl bg-[#0b5b35] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#073b25] disabled:cursor-not-allowed disabled:bg-slate-400">
              {loading ? "Memproses..." : "Masuk ke dashboard"}
            </button>
          </form>
          <p className="mt-8 border-t border-slate-100 pt-5 text-center text-xs text-slate-400">E-Kinerja UIN Ar-Raniry Banda Aceh</p>
        </section>
      </div>
    </main>
  );
}
