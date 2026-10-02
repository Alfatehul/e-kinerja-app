"use client";

import { useMemo, useState } from "react";
import { updateUserPassword, updateUserProfile } from "@/app/admin/users/actions";
import SubmitButton from "@/components/SubmitButton";
import FormModal from "@/components/FormModal";

type User = {
  id: string;
  full_name: string | null;
  role: string;
  faculty_id: string | null;
  faculties: { name: string } | { name: string }[] | null;
};

type Faculty = { id: string; name: string };

export default function UserManagementTable({
  users,
  faculties,
}: {
  users: User[];
  faculties: Faculty[];
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [passwordUser, setPasswordUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();
    return users.filter((user) => {
      const faculty = Array.isArray(user.faculties) ? user.faculties[0] : user.faculties;
      const matchesQuery =
        !normalizedQuery ||
        (user.full_name ?? "").toLowerCase().includes(normalizedQuery) ||
        (faculty?.name ?? "").toLowerCase().includes(normalizedQuery);
      return matchesQuery && (roleFilter === "all" || user.role === roleFilter);
    });
  }, [query, roleFilter, users]);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#E1DDCF] bg-[#F6F4EF] p-4 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari nama atau fakultas..."
          className="min-w-0 flex-1 rounded-xl border border-[#D7E2DA] bg-white px-3 py-2 text-sm outline-none focus:border-[#0B5B35]"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-xl border border-[#D7E2DA] bg-white px-3 py-2 text-sm"
        >
          <option value="all">Semua peran</option>
          <option value="admin_biro">Admin Biro</option>
          <option value="admin_fakultas">Admin Fakultas</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-[#F8FBF8] text-xs uppercase tracking-wide text-[#64736A]">
            <tr>
              <th className="px-5 py-3">Pengguna</th>
              <th className="px-5 py-3">Peran</th>
              <th className="px-5 py-3">Fakultas / Unit</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1DDCF]">
            {filteredUsers.map((user) => {
              const faculty = Array.isArray(user.faculties) ? user.faculties[0] : user.faculties;
              return (
                <tr key={user.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#17231D]">{user.full_name || "Tanpa nama"}</p>
                    <p className="mt-1 text-xs text-[#849289]">{user.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-[#EAF3ED] px-3 py-1 text-xs font-bold text-[#0B5B35]">
                      {user.role === "admin_biro" ? "Admin Biro" : "Admin Fakultas"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {faculty?.name ?? "Universitas / Biro"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <FormModal
                        label="Edit akses"
                        title={`Edit akses ${user.full_name || "pengguna"}`}
                        className="text-xs font-bold text-[#1B2A4B] hover:underline"
                      >
                        <form action={updateUserProfile} className="mx-auto flex max-w-md flex-col gap-4 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
                          <h2 className="text-lg font-bold text-[#17231D]">Edit akses pengguna</h2>
                          <p className="text-sm text-[#64736A]">{user.full_name || "Tanpa nama"}</p>
                          <input type="hidden" name="user_id" value={user.id} />
                          <label className="block text-sm font-semibold text-[#334A3C]">
                            Peran
                            <select name="role" defaultValue={user.role} className="form-input mt-1">
                              <option value="admin_biro">Admin Biro</option>
                              <option value="admin_fakultas">Admin Fakultas</option>
                            </select>
                          </label>
                          <label className="block text-sm font-semibold text-[#334A3C]">
                            Fakultas / Unit
                            <select name="faculty_id" defaultValue={user.faculty_id ?? ""} className="form-input mt-1">
                              <option value="">Tidak terikat</option>
                              {faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                            </select>
                          </label>
                          <SubmitButton label="Simpan akses" loadingLabel="Menyimpan..." className="self-start px-4 py-2.5" />
                        </form>
                      </FormModal>
                      <button type="button" onClick={() => setPasswordUser(user)} className="text-xs font-bold text-[#0B5B35] hover:underline">Ubah password</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && <p className="px-5 py-12 text-center text-sm text-[#64736A]">Tidak ada pengguna yang sesuai.</p>}
      {passwordUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#E1DDCF] bg-white p-5 shadow-2xl">
            <h2 className="text-lg font-bold text-[#1B2A4B]">Ubah password pengguna</h2>
            <p className="mt-1 text-sm text-[#64736A]">
              Atur password baru untuk {passwordUser.full_name || "pengguna ini"}.
            </p>
            <form action={updateUserPassword} className="mt-5 space-y-4">
              <input type="hidden" name="user_id" value={passwordUser.id} />
              <label className="block text-sm font-semibold text-[#1B2A4B]">
                Password baru
                <input required minLength={8} type="password" name="password" className="mt-1 w-full rounded-xl border border-[#D7E2DA] px-3 py-2 font-normal outline-none focus:border-[#0B5B35]" />
              </label>
              <label className="block text-sm font-semibold text-[#1B2A4B]">
                Konfirmasi password
                <input required minLength={8} type="password" name="password_confirmation" className="mt-1 w-full rounded-xl border border-[#D7E2DA] px-3 py-2 font-normal outline-none focus:border-[#0B5B35]" />
              </label>
              <p className="text-xs text-[#849289]">Minimal 8 karakter.</p>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setPasswordUser(null)} className="rounded-xl border border-[#E1DDCF] px-4 py-2 text-sm font-semibold text-[#64736A]">Batal</button>
                <SubmitButton label="Simpan password" loadingLabel="Menyimpan..." className="px-4 py-2" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
