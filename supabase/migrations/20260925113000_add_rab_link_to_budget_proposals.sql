alter table public.budget_proposals
  add column if not exists rab_link text;

notify pgrst, 'reload schema';
