grant delete on table public.notifications to authenticated;

drop policy if exists "User hapus notifikasi sendiri" on public.notifications;
create policy "User hapus notifikasi sendiri"
  on public.notifications for delete
  to authenticated
  using (user_id = auth.uid());
