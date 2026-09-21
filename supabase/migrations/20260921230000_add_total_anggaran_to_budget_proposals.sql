alter table public.budget_proposals
  add column if not exists total_anggaran numeric not null default 0;

update public.budget_proposals
set total_anggaran = volume * harga_satuan
where total_anggaran = 0
  and volume is not null
  and harga_satuan is not null;
