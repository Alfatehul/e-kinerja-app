alter table public.budget_proposals
  add column if not exists kementerian_lembaga text,
  add column if not exists unit_eselon text,
  add column if not exists satker text,
  add column if not exists sasaran_kegiatan text,
  add column if not exists klasifikasi_rincian_output text,
  add column if not exists rincian_output text,
  add column if not exists indikator_ro text,
  add column if not exists volume_keluaran numeric,
  add column if not exists satuan_ukuran_keluaran text;
