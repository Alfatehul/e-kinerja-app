-- Ubah kolom target dan unit di tabel indicators agar bersifat opsional (dapat bernilai NULL)
alter table public.indicators
  alter column target drop not null;

alter table public.indicators
  alter column unit drop not null;
