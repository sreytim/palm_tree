-- Only the authenticated owner may create, update, or delete an entry.
-- Keep public reads limited to published entries; owners can also read their
-- own drafts through entries_owner_read.
alter table public.entries enable row level security;

drop policy if exists entries_editor_update on public.entries;
drop policy if exists entries_editor_delete on public.entries;
drop policy if exists entries_owner_update on public.entries;
drop policy if exists entries_owner_delete on public.entries;
drop policy if exists entries_contributor_insert on public.entries;
drop policy if exists entries_owner_insert on public.entries;

create policy entries_owner_insert on public.entries
  for insert to authenticated
  with check (
    owner = (select auth.uid())
    and (select public.current_profile_role()) in ('contributor','editor','admin')
  );

create policy entries_owner_update on public.entries
  for update to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));

create policy entries_owner_delete on public.entries
  for delete to authenticated
  using (owner = (select auth.uid()));

create or replace function public.prevent_owner_moderation_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not coalesce((select public.is_editor()), false)
     and (
       new.status is distinct from old.status
       or new.is_sample is distinct from old.is_sample
       or new.featured is distinct from old.featured
     ) then
    raise exception 'Only editors can change entry moderation fields'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_owner_moderation_changes on public.entries;
create trigger prevent_owner_moderation_changes
  before update on public.entries
  for each row execute function public.prevent_owner_moderation_changes();

revoke execute on function public.prevent_owner_moderation_changes()
  from public, anon, authenticated;

revoke insert, update, delete on table public.entries from anon, public;
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;
