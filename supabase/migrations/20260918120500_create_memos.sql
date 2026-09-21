create extension if not exists pgcrypto;

create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_faculty text not null default 'Semua Fakultas',
  status text not null default 'Diterbitkan'
    check (status in ('Draft', 'Diterbitkan', 'Diarsipkan')),
  publish_date date not null default current_date,
  pinned boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.memos
  add column if not exists title text,
  add column if not exists body text,
  add column if not exists target_faculty text default 'Semua Fakultas',
  add column if not exists status text default 'Diterbitkan',
  add column if not exists publish_date date default current_date,
  add column if not exists pinned boolean default false,
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.memos
set
  target_faculty = coalesce(target_faculty, 'Semua Fakultas'),
  status = coalesce(status, 'Diterbitkan'),
  publish_date = coalesce(publish_date, current_date),
  pinned = coalesce(pinned, false),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

create index if not exists memos_publish_date_idx
  on public.memos (publish_date desc);

create index if not exists memos_status_pinned_idx
  on public.memos (status, pinned desc, publish_date desc);

alter table public.memos enable row level security;

grant select on public.memos to authenticated;
grant insert, update, delete on public.memos to authenticated;

drop policy if exists "Published memos are readable by authenticated users"
  on public.memos;
drop policy if exists "Biro admins can create memos"
  on public.memos;
drop policy if exists "Biro admins can update memos"
  on public.memos;
drop policy if exists "Biro admins can delete memos"
  on public.memos;

create policy "Published memos are readable by authenticated users"
  on public.memos for select
  to authenticated
  using (status = 'Diterbitkan' or created_by = auth.uid());

create policy "Biro admins can create memos"
  on public.memos for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  );

create policy "Biro admins can update memos"
  on public.memos for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  );

create policy "Biro admins can delete memos"
  on public.memos for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  );
