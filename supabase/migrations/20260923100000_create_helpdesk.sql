create table if not exists public.helpdesk_threads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  faculty_id uuid not null references public.faculties(id) on delete cascade,
  created_by uuid not null references auth.users(id) on delete cascade,
  status text not null default 'Open' check (status in ('Open', 'Closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.helpdesk_threads
  add column if not exists title text,
  add column if not exists faculty_id uuid references public.faculties(id) on delete cascade,
  add column if not exists created_by uuid references auth.users(id) on delete cascade,
  add column if not exists status text default 'Open',
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.helpdesk_threads
set
  status = coalesce(status, 'Open'),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, created_at, now());

create table if not exists public.helpdesk_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.helpdesk_threads(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  from_role text not null check (from_role in ('user', 'admin')),
  text text not null check (length(trim(text)) > 0),
  created_at timestamptz not null default now()
);

create index if not exists helpdesk_threads_faculty_id_idx
  on public.helpdesk_threads (faculty_id, updated_at desc);
create index if not exists helpdesk_messages_thread_id_idx
  on public.helpdesk_messages (thread_id, created_at);

alter table public.helpdesk_threads enable row level security;
alter table public.helpdesk_messages enable row level security;

grant select, insert, update on public.helpdesk_threads to authenticated;
grant delete on public.helpdesk_threads to authenticated;
grant select, insert on public.helpdesk_messages to authenticated;

drop policy if exists "Helpdesk threads are visible to owner and biro" on public.helpdesk_threads;
create policy "Helpdesk threads are visible to owner and biro"
  on public.helpdesk_threads for select to authenticated
  using (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
  );

drop policy if exists "Faculty can create helpdesk threads" on public.helpdesk_threads;
create policy "Faculty can create helpdesk threads"
  on public.helpdesk_threads for insert to authenticated
  with check (
    created_by = auth.uid()
    and faculty_id = (select faculty_id from public.profiles where id = auth.uid())
  );

drop policy if exists "Biro admins can create helpdesk threads" on public.helpdesk_threads;
create policy "Biro admins can create helpdesk threads"
  on public.helpdesk_threads for insert to authenticated
  with check (
    created_by = auth.uid()
    and (select role from public.profiles where id = auth.uid()) = 'admin_biro'
  );

drop policy if exists "Biro admins can delete helpdesk threads" on public.helpdesk_threads;
create policy "Biro admins can delete helpdesk threads"
  on public.helpdesk_threads for delete to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin_biro');

drop policy if exists "Thread participants can update helpdesk threads" on public.helpdesk_threads;
create policy "Thread participants can update helpdesk threads"
  on public.helpdesk_threads for update to authenticated
  using (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
  )
  with check (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
  );

drop policy if exists "Helpdesk messages are visible to participants" on public.helpdesk_messages;
create policy "Helpdesk messages are visible to participants"
  on public.helpdesk_messages for select to authenticated
  using (
    exists (
      select 1 from public.helpdesk_threads t
      where t.id = thread_id
        and (
          t.faculty_id = (select faculty_id from public.profiles where id = auth.uid())
          or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
        )
    )
  );

drop policy if exists "Participants can send helpdesk messages" on public.helpdesk_messages;
create policy "Participants can send helpdesk messages"
  on public.helpdesk_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and (
      (from_role = 'user' and (select role from public.profiles where id = auth.uid()) = 'admin_fakultas')
      or (from_role = 'admin' and (select role from public.profiles where id = auth.uid()) = 'admin_biro')
    )
    and exists (
      select 1 from public.helpdesk_threads t
      where t.id = thread_id
        and (
          t.faculty_id = (select faculty_id from public.profiles where id = auth.uid())
          or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
        )
    )
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'helpdesk_messages'
  ) then
    alter publication supabase_realtime add table public.helpdesk_messages;
  end if;
end
$$;
