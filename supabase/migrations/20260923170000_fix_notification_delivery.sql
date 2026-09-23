create or replace function public.notify_user(
  target_user_id uuid,
  notification_text text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, text, read)
  values (target_user_id, notification_text, false);
$$;

create or replace function public.notify_faculty_admin(
  target_faculty_id uuid,
  notification_text text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, text, read)
  select id, notification_text, false
  from public.profiles
  where role = 'admin_fakultas'
    and faculty_id = target_faculty_id;
$$;

create or replace function public.notify_all_biro(
  notification_text text
)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (user_id, text, read)
  select id, notification_text, false
  from public.profiles
  where role = 'admin_biro';
$$;

revoke all on function public.notify_user(uuid, text) from public;
revoke all on function public.notify_faculty_admin(uuid, text) from public;
revoke all on function public.notify_all_biro(text) from public;

grant execute on function public.notify_user(uuid, text) to authenticated;
grant execute on function public.notify_faculty_admin(uuid, text) to authenticated;
grant execute on function public.notify_all_biro(text) to authenticated;
