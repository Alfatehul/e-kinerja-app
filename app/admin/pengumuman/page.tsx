import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { togglePin, deleteAnnouncement } from "./actions";

export default async function PengumumanAdminPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-xl font-semibold">Pengumuman</h1>
        <Link
          href="/admin/pengumuman/tambah"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
        >
          + Buat Pengumuman
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {announcements?.map((a) => (
          <div
            key={a.id}
            className={`bg-white border rounded-lg p-4 ${a.pinned ? "border-[#B8862E]" : "border-[#E1DDCF]"}`}
          >
            <div className="flex justify-between items-start">
              <div>
                {a.pinned && (
                  <span className="text-[10px] font-bold text-[#B8862E] border border-[#B8862E] rounded px-1.5 py-0.5 mr-2">
                    DISEMATKAN
                  </span>
                )}
                <span className="font-serif font-semibold text-[15px]">
                  {a.title}
                </span>
                <div className="text-xs text-[#5B5A55] mt-1">
                  Untuk {a.target_faculty} · Terbit {a.publish_date} · Berakhir{" "}
                  {a.end_date ?? "-"}
                </div>
                <p className="text-sm mt-2">{a.body}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <form action={togglePin.bind(null, a.id, !a.pinned)}>
                  <button
                    type="submit"
                    className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                  >
                    {a.pinned ? "Lepas Pin" : "Sematkan"}
                  </button>
                </form>
                <form action={deleteAnnouncement.bind(null, a.id)}>
                  <button
                    type="submit"
                    className="text-red-600 text-xs font-semibold hover:underline"
                  >
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {announcements?.length === 0 && (
          <p className="text-sm text-[#5B5A55]">Belum ada pengumuman.</p>
        )}
      </div>
    </div>
  );
}
