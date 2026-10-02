create or replace function public.get_faculty_achievement_summary()
returns table (
  faculty_id uuid,
  faculty_name text,
  assignment_count bigint,
  average_capaian numeric
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    f.id,
    f.name,
    count(a.id),
    coalesce(
      round(
        avg(
          case
            when i.target is null then
              case when coalesce(a.realization, 0) > 0 then 100.0 else 0.0 end
            when i.target > 0 then
              least(
                100.0,
                round((coalesce(a.realization, 0)::numeric / i.target::numeric) * 1000) / 10
              )
            else 0.0
          end
        ),
        1
      ),
      0
    )
  from public.faculties f
  left join public.indicator_assignments a on a.faculty_id = f.id
  left join public.indicators i on i.id = a.indicator_id
  where f.status = 'Aktif'
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin_biro', 'admin_fakultas')
    )
  group by f.id, f.name
  order by 4 desc, f.name;
$$;

revoke all on function public.get_faculty_achievement_summary() from public;
grant execute on function public.get_faculty_achievement_summary() to authenticated;
