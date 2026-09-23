grant usage on schema public to authenticated;
grant select, insert, update, delete
on table public.notification_dismissals
to authenticated;

alter table public.notification_dismissals enable row level security;

drop policy if exists "Users can read own notification dismissals"
  on public.notification_dismissals;
create policy "Users can read own notification dismissals"
  on public.notification_dismissals for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can dismiss own notifications"
  on public.notification_dismissals;
create policy "Users can dismiss own notifications"
  on public.notification_dismissals for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can update own notification dismissals"
  on public.notification_dismissals;
create policy "Users can update own notification dismissals"
  on public.notification_dismissals for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users can remove own notification dismissals"
  on public.notification_dismissals;
create policy "Users can remove own notification dismissals"
  on public.notification_dismissals for delete
  to authenticated
  using (user_id = auth.uid());
