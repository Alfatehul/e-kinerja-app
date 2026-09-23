grant usage on schema public to authenticated;
grant select, insert, update on table public.notifications to authenticated;

alter table public.notifications enable row level security;
alter table public.notifications replica identity full;

drop policy if exists "User baca notifikasi sendiri" on public.notifications;
create policy "User baca notifikasi sendiri"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "User update (tandai baca) notifikasi sendiri"
  on public.notifications;
create policy "User update (tandai baca) notifikasi sendiri"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Semua authenticated boleh kirim notifikasi ke siapa saja"
  on public.notifications;
create policy "Semua authenticated boleh kirim notifikasi ke siapa saja"
  on public.notifications for insert
  to authenticated
  with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'notifications'
  ) then
    alter publication supabase_realtime add table public.notifications;
  end if;
end
$$;
