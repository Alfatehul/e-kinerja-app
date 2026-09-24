alter table public.indicators
  add column if not exists quarter text;

alter table public.indicators
  drop constraint if exists indicators_quarter_check;

alter table public.indicators
  add constraint indicators_quarter_check
  check (quarter is null or quarter in ('1', '2', '3', '4'));

update public.indicators
set quarter = case
  when extract(month from deadline) between 1 and 3 then '1'
  when extract(month from deadline) between 4 and 6 then '2'
  when extract(month from deadline) between 7 and 9 then '3'
  when extract(month from deadline) between 10 and 12 then '4'
end
where quarter is null
  and deadline is not null;
