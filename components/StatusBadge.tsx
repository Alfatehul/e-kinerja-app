const statusMeta: Record<string, string> = {
  Draft: "bg-gray-100 text-gray-600",
  Diajukan: "bg-blue-50 text-blue-700",
  Diverifikasi: "bg-amber-50 text-amber-700",
  Disetujui: "bg-green-50 text-green-700",
  Ditolak: "bg-red-50 text-red-700",
  "Perlu Perbaikan": "bg-orange-50 text-orange-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-1 rounded ${statusMeta[status] || statusMeta["Draft"]}`}
    >
      {status}
    </span>
  );
}
