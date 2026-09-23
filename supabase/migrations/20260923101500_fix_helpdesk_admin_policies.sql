grant select, insert, update, delete on public.helpdesk_threads to authenticated;

drop policy if exists "Biro admins can create helpdesk threads"
  on public.helpdesk_threads;
create policy "Biro admins can create helpdesk threads"
  on public.helpdesk_threads for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  );

drop policy if exists "Biro admins can delete helpdesk threads"
  on public.helpdesk_threads;
create policy "Biro admins can delete helpdesk threads"
  on public.helpdesk_threads for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin_biro'
    )
  );
