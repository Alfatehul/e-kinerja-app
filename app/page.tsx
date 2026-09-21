import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center overflow-hidden bg-[#f3f8f4] px-5 py-10 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="flex items-center gap-3">
            <img src="/logo uin.svg" alt="Logo UIN Ar-Raniry" className="h-14 w-14 object-contain" />
            <div><p className="font-bold text-[#073b25]">E-Kinerja</p><p className="text-xs text-slate-500">UIN Ar-Raniry</p></div>
          </div>
          <p className="mt-16 text-sm font-bold uppercase tracking-[0.24em] text-[#0b5b35]">Sistem informasi kinerja</p>
          <h1 className="mt-4 max-w-2xl text-5xl font-bold leading-[1.08] tracking-tight text-[#073b25] sm:text-6xl">
            Wujudkan kinerja yang <span className="text-[#c08f32]">terukur</span> dan berdampak.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
            Kelola indikator, usulan anggaran, dan capaian unit kerja dalam satu platform yang sederhana dan transparan.
          </p>
          <Link href="/login" className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#0b5b35] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-900/15 transition hover:bg-[#073b25]">
            Masuk ke sistem <span aria-hidden>→</span>
          </Link>
        </section>
        <section className="relative hidden min-h-[430px] lg:block">
          <div className="absolute right-10 top-4 h-80 w-80 rounded-full bg-[#c6dfcc] blur-3xl" />
          <div className="absolute right-0 top-16 w-80 rounded-3xl border border-white bg-white/85 p-6 shadow-2xl shadow-emerald-950/10 backdrop-blur">
            <div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-700">Ringkasan capaian</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">2026</span></div>
            <div className="mt-8 flex items-end gap-3"><p className="text-5xl font-bold text-[#073b25]">84.6%</p><p className="mb-2 text-xs font-semibold text-emerald-600">+12.4%</p></div>
            <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-[84.6%] rounded-full bg-[#c08f32]" /></div>
            <div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[#f3f8f4] p-4"><p className="text-2xl font-bold text-[#073b25]">128</p><p className="mt-1 text-xs text-slate-500">Indikator aktif</p></div><div className="rounded-2xl bg-[#fff9ed] p-4"><p className="text-2xl font-bold text-[#9a6f1e]">12</p><p className="mt-1 text-xs text-slate-500">Unit kerja</p></div></div>
          </div>
        </section>
      </div>
    </main>
  );
}
