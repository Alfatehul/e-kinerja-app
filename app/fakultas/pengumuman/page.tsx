import { createClient } from "@/lib/supabase/server";

export default async function PengumumanFakultasPage() {
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false });

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold mb-4">Pengumuman</h1>
      <div className="flex flex-col gap-3">
        {announcements?.map((a) => (
          <div
            key={a.id}
            className={`bg-white border rounded-lg p-4 ${a.pinned ? "border-[#B8862E]" : "border-[#E1DDCF]"}`}
          >
            {a.pinned && (
              <span className="text-[10px] font-bold text-[#B8862E] border border-[#B8862E] rounded px-1.5 py-0.5 mr-2">
                DISEMATKAN
              </span>
            )}
            <span className="font-serif font-semibold text-[15px]">
              {a.title}
            </span>
            <div className="text-xs text-[#5B5A55] mt-1">
              Untuk {a.target_faculty} · Terbit {a.publish_date}
            </div>
            <p className="text-sm mt-2">{a.body}</p>
          </div>
        ))}
        {announcements?.length === 0 && (
          <p className="text-sm text-[#5B5A55]">Belum ada pengumuman.</p>
        )}
      </div>
    </div>
  );
}
