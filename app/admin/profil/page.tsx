import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/ProfileForm";

export default async function AdminProfilePage() {
  const session = await getCurrentProfile();
  if (!session) return null;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Akun</p>
        <h1 className="mt-1 text-2xl font-bold text-[#17231D]">Profil</h1>
        <p className="mt-2 text-sm text-[#64736A]">Kelola informasi akun dan keamanan Anda.</p>
      </div>
      <ProfileForm fullName={session.profile.full_name ?? ""} email={userData.user?.email ?? "-"} roleLabel="Admin Biro — Universitas" />
    </div>
  );
}
