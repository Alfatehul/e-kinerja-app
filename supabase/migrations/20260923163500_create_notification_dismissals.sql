create table if not exists public.notification_dismissals (
  user_id uuid not null references auth.users(id) on delete cascade,
  notification_id text not null,
  dismissed_at timestamptz not null default now(),
  primary key (user_id, notification_id)
);

alter table public.notification_dismissals enable row level security;
grant select, insert, delete on public.notification_dismissals to authenticated;

drop policy if exists "Users can read own notification dismissals" on public.notification_dismissals;
create policy "Users can read own notification dismissals"
  on public.notification_dismissals for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can dismiss own notifications" on public.notification_dismissals;
create policy "Users can dismiss own notifications"
  on public.notification_dismissals for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users can remove own notification dismissals" on public.notification_dismissals;
create policy "Users can remove own notification dismissals"
  on public.notification_dismissals for delete to authenticated
  using (user_id = auth.uid());
