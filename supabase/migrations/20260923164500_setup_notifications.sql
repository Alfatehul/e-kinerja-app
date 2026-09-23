create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  text text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;
alter table public.notifications replica identity full;

grant select, insert, update on public.notifications to authenticated;

drop policy if exists "User baca notifikasi sendiri" on public.notifications;
create policy "User baca notifikasi sendiri"
  on public.notifications for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "User update (tandai baca) notifikasi sendiri" on public.notifications;
create policy "User update (tandai baca) notifikasi sendiri"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Semua authenticated boleh kirim notifikasi ke siapa saja"
  on public.notifications;
create policy "Semua authenticated boleh kirim notifikasi ke siapa saja"
  on public.notifications for insert to authenticated
  with check (true);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;
