export default function PageLoading() {
  return (
    <div
      aria-label="Memuat halaman"
      aria-live="polite"
      className="mx-auto flex w-full max-w-5xl animate-pulse flex-col gap-6 pb-10"
    >
      <div className="space-y-3">
        <div className="h-3 w-32 rounded-full bg-[#DCE6DF]" />
        <div className="h-8 w-64 rounded-xl bg-[#DCE6DF]" />
        <div className="h-4 w-80 max-w-full rounded-full bg-[#E7EFE9]" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-2xl border border-[#DCE6DF] bg-white" />
        <div className="h-28 rounded-2xl border border-[#DCE6DF] bg-white" />
        <div className="h-28 rounded-2xl border border-[#DCE6DF] bg-white" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white">
        <div className="border-b border-[#EDF2EE] bg-[#F8FBF8] p-5">
          <div className="h-5 w-40 rounded-lg bg-[#DCE6DF]" />
          <div className="mt-2 h-3 w-64 rounded-full bg-[#E7EFE9]" />
        </div>
        <div className="space-y-4 p-5">
          <div className="h-12 rounded-xl bg-[#F1F6F2]" />
          <div className="h-12 rounded-xl bg-[#F1F6F2]" />
          <div className="h-12 rounded-xl bg-[#F1F6F2]" />
          <div className="h-12 rounded-xl bg-[#F1F6F2]" />
        </div>
      </div>
    </div>
  );
}
