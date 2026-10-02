alter table public.indicator_assignments
  add column if not exists realization_unit text;
