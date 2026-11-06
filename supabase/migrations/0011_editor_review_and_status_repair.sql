-- ============================================================================
-- 0011_editor_review_and_status_repair.sql
-- ============================================================================
-- Sprint 3 review flow repair. This migration is idempotent: it can be run
-- again safely, and it also re-applies the 0010 status workflow, which could
-- not complete if draft rows existed (see the note on the moderation trigger).
--
-- Problems this fixes
-- 1. 0009 dropped `entries_editor_update` and replaced it with owner-only
--    write policies, so an editor publishing somebody else's submission
--    updated zero rows and the review queue always answered "already
--    reviewed". Editors need UPDATE on rows they do not own in order to
--    move a submission from pending to published or returned.
-- 2. `prevent_owner_moderation_changes` raises whenever the caller is not an
--    editor, and `auth.uid()` is null outside the API (the Supabase SQL
--    editor, migrations, service work). The `update ... set status = 'pending'`
--    in 0010 therefore raised, the whole 0010 script rolled back, and the
--    status constraint kept rejecting the 'pending' value that
--    /api/contributions inserts.
-- ============================================================================

alter table public.entries enable row level security;

-- Editors may update any entry, because reviewing is not ownership-based -----
-- Column-level limits cannot be expressed in a policy, so the guard triggers
-- below keep the dangerous fields out of reach.
drop policy if exists entries_editor_update on public.entries;
create policy entries_editor_update on public.entries
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

-- Ownership is never transferable, not even by an editor ---------------------
create or replace function public.prevent_entry_owner_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.owner is distinct from old.owner then
    raise exception 'Entry ownership cannot be transferred'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_entry_owner_change on public.entries;
create trigger prevent_entry_owner_change
  before update on public.entries
  for each row execute function public.prevent_entry_owner_change();

revoke execute on function public.prevent_entry_owner_change()
  from public, anon, authenticated;

-- Moderation fields stay editor-only, but only for end-user sessions ----------
-- `auth.uid()` is null for migrations, the SQL editor and service work, which
-- must remain able to repair data.
create or replace function public.prevent_owner_moderation_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) is not null
     and not coalesce((select public.is_editor()), false)
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

revoke execute on function public.prevent_owner_moderation_changes()
  from public, anon, authenticated;

-- Re-apply the 0010 status workflow in the order the check constraint needs ---
alter table public.entries drop constraint if exists entries_status_check;

-- 'draft' and 'archived' are no longer part of the workflow. Community
-- submissions become pending review; anything else keeps its published state.
update public.entries
set status = 'pending'
where status not in ('pending', 'published', 'returned');

alter table public.entries add constraint entries_status_check
  check (status in ('pending', 'published', 'returned'));

revoke insert, update, delete on table public.entries from anon, public;
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;
