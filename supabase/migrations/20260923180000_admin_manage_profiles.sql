grant select, update on public.profiles to authenticated;

create or replace function public.is_admin_biro()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin_biro'
  );
$$;

revoke all on function public.is_admin_biro() from public;
grant execute on function public.is_admin_biro() to authenticated;

drop policy if exists "Admin biro dapat melihat semua profil" on public.profiles;
create policy "Admin biro dapat melihat semua profil"
on public.profiles for select to authenticated
using (
  id = auth.uid()
  or public.is_admin_biro()
);

drop policy if exists "Admin biro dapat mengubah profil" on public.profiles;
create policy "Admin biro dapat mengubah profil"
on public.profiles for update to authenticated
using (public.is_admin_biro())
with check (true);
