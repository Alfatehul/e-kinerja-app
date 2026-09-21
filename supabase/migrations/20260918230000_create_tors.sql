create table if not exists public.budget_tors (
  id uuid primary key default gen_random_uuid(),
  number text not null unique,
  year text not null,
  faculty_id uuid not null references public.faculties(id),
  proposal_id uuid references public.budget_proposals(id) on delete set null,
  program text not null,
  kegiatan text,
  rincian_anggaran text,
  sumber_dana text,
  judul text not null,
  latar_belakang text not null,
  dasar_hukum text,
  tujuan text not null,
  output text,
  outcome text,
  indikator_keberhasilan text,
  lokasi text,
  waktu_pelaksanaan text,
  peserta text,
  narasumber text,
  metode_pelaksanaan text,
  pengusul_id uuid not null references auth.users(id),
  status text not null default 'Draft' check (status in ('Draft', 'Diajukan', 'Diverifikasi', 'Disetujui', 'Ditolak', 'Perlu Perbaikan')),
  catatan_verifikator text,
  tanggal_pengajuan date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists budget_tors_faculty_id_idx on public.budget_tors(faculty_id);
create index if not exists budget_tors_status_idx on public.budget_tors(status);

alter table public.budget_documents
  drop constraint if exists budget_documents_entity_type_check;
alter table public.budget_documents
  add constraint budget_documents_entity_type_check
  check (entity_type in ('proposal', 'revision', 'tor'));

alter table public.budget_tors enable row level security;

create policy "Faculty users can read own TORs"
  on public.budget_tors for select to authenticated
  using (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
  );

create policy "Faculty users can create own TORs"
  on public.budget_tors for insert to authenticated
  with check (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    and pengusul_id = auth.uid()
  );

create policy "Faculty users can update own TORs"
  on public.budget_tors for update to authenticated
  using (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    and status in ('Draft', 'Perlu Perbaikan', 'Ditolak')
  )
  with check (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
  );

create policy "Biro admins can update TORs"
  on public.budget_tors for update to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin_biro')
  with check ((select role from public.profiles where id = auth.uid()) = 'admin_biro');

create policy "Faculty users can delete own TORs"
  on public.budget_tors for delete to authenticated
  using (
    faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    and status in ('Draft', 'Perlu Perbaikan', 'Ditolak')
  );

create policy "Biro admins can delete TORs"
  on public.budget_tors for delete to authenticated
  using ((select role from public.profiles where id = auth.uid()) = 'admin_biro');

create policy "Users can read TOR documents"
  on public.budget_documents for select to authenticated
  using (
    entity_type = 'tor'
    and exists (
      select 1 from public.budget_tors t
      where t.id = entity_id
      and (
        t.faculty_id = (select faculty_id from public.profiles where id = auth.uid())
        or (select role from public.profiles where id = auth.uid()) = 'admin_biro'
      )
    )
  );

create policy "Faculty users can manage TOR documents"
  on public.budget_documents for all to authenticated
  using (
    entity_type = 'tor'
    and exists (
      select 1 from public.budget_tors t
      where t.id = entity_id
      and t.faculty_id = (select faculty_id from public.profiles where id = auth.uid())
      and t.status in ('Draft', 'Perlu Perbaikan', 'Ditolak')
    )
  )
  with check (
    entity_type = 'tor'
    and exists (
      select 1 from public.budget_tors t
      where t.id = entity_id
      and t.faculty_id = (select faculty_id from public.profiles where id = auth.uid())
    )
  );
