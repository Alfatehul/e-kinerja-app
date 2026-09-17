import { createClient } from "@/lib/supabase/client";

export default async function TestPage() {
  const supabase = createClient();
  const { data, error } = await supabase.from("faculties").select("*");

  if (error) {
    return (
      <div style={{ padding: 40, color: "red" }}>
        Terjadi error: {error.message}
      </div>
    );
  }

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Daftar Fakultas (dari Supabase)</h1>
      <ul>
        {data?.map((f) => (
          <li key={f.id}>
            {f.name} ({f.code}) — {f.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
