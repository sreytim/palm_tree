-- ============================================================================
-- 0016_returned_resubmission_repair.sql
-- ============================================================================
-- Why this file exists
--
-- A contributor whose submission was returned with a review note could not
-- save the corrected entry. PostgreSQL fires BEFORE UPDATE triggers in
-- alphabetical order by trigger name, so `enforce_contribution_rules` runs
-- first: it moves the row from 'returned' to 'pending' and clears
-- review_note / reviewed_at / reviewed_by, exactly as intended.
--
-- Then `prevent_owner_moderation_changes` (created by 0012) compares the
-- cleared review columns with the old row, reads that as the author writing or
-- erasing a review note, and raises SQLSTATE 42501
-- "Only the archive owner can write review notes". The app maps 42501 to
-- "Your account cannot change this entry", so the author's save never lands:
-- someone asked to fix their entry from the admin feedback is locked out of it.
--
-- What this script does
--   * recreates `prevent_owner_moderation_changes()` so the automatic
--     'returned' -> 'pending' resubmission is allowed together with the cleared
--     review columns;
--   * still refuses an author-written review note: in that one case all three
--     review columns must be null, so the note cannot be forged or restored;
--   * leaves every other guard untouched: moderation fields stay admin-only,
--     editors still cannot approve or return an entry;
--   * is idempotent - run it again safely.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL editor -> paste this file -> Run.
-- ============================================================================

create or replace function public.prevent_owner_moderation_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- Migrations, the SQL editor and service work have no auth.uid().
  if (select auth.uid()) is null then
    return new;
  end if;

  if coalesce((select public.is_admin()), false) then
    return new;
  end if;

  if new.status is distinct from old.status
     and not (old.status = 'returned' and new.status = 'pending') then
    raise exception 'Only the archive owner can approve, return or moderate an entry'
      using errcode = '42501';
  end if;

  if new.featured is distinct from old.featured
     or new.is_sample is distinct from old.is_sample then
    raise exception 'Only the archive owner can approve, return or moderate an entry'
      using errcode = '42501';
  end if;

  -- `enforce_contribution_rules` sorts before this trigger and has already
  -- cleared the review columns while resubmitting a returned entry. Removing
  -- the old note is part of that resubmission, so it is allowed here - but the
  -- author may only clear the columns, never write into them.
  if old.status = 'returned' and new.status = 'pending' then
    if new.review_note is not null
       or new.reviewed_at is not null
       or new.reviewed_by is not null then
      raise exception 'Only the archive owner can write review notes'
        using errcode = '42501';
    end if;

    return new;
  end if;

  if new.review_note is distinct from old.review_note
     or new.reviewed_at is distinct from old.reviewed_at
     or new.reviewed_by is distinct from old.reviewed_by then
    raise exception 'Only the archive owner can write review notes'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_owner_moderation_changes()
  from public, anon, authenticated;

-- 0012 already created the trigger, but recreating it here repairs a project
-- where it was dropped by hand in the dashboard.
drop trigger if exists prevent_owner_moderation_changes on public.entries;
create trigger prevent_owner_moderation_changes
  before update on public.entries
  for each row execute function public.prevent_owner_moderation_changes();
