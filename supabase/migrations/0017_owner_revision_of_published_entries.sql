-- ============================================================================
-- 0017_owner_revision_of_published_entries.sql
-- ============================================================================
-- Why this file exists
--
-- The workflow allowed an author to correct only a 'pending' or 'returned'
-- submission. A published entry was locked to its author, so a contributor who
-- spotted a mistake in their own published entry could not fix it at all.
--
-- What this script does
--   * lets an author update their own published entry;
--   * saving that edit moves it back to 'pending' and clears the old review
--     fields, so a changed public entry is re-approved before it appears again;
--   * keeps reviewer edits different: an editor or admin editing a published
--     entry leaves it published;
--   * refuses an author-supplied status change loudly (SQLSTATE 42501) instead
--     of silently resetting it, so a hand-written "publish my own entry"
--     request fails with an error;
--   * keeps withdrawal (deleting the entry and its photo) limited to
--     'pending' / 'returned' entries: a published entry is removed by the
--     archive team.
--
-- Applying this after 0016 is safe. Every statement is idempotent.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL editor -> paste this file -> Run.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Contribution rules: automatic resubmission, no author status changes
-- ---------------------------------------------------------------------------
create or replace function public.enforce_contribution_rules()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  step_item jsonb;
  tip_item jsonb;
  topic_count integer;
  pending_count integer;
  max_pending constant integer := 5;
begin
  if coalesce(public.current_profile_role(), '') <> 'contributor' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.id := gen_random_uuid();
    new.created_at := now();
    new.updated_at := now();
    new.owner := auth.uid();
    new.status := 'pending';
    new.featured := false;
    new.is_sample := false;
    new.review_note := null;
    new.reviewed_at := null;
    new.reviewed_by := null;

    -- One account cannot flood the review queue.
    select count(*) into pending_count
    from public.entries e
    where e.owner = auth.uid() and e.status = 'pending';

    if pending_count >= max_pending then
      raise exception 'Submission limit reached';
    end if;
  else
    -- The contribution form never sends a status. A contributor who sends one
    -- is trying to moderate their own entry; refuse it loudly instead of
    -- silently replacing the requested value.
    if new.status is distinct from old.status then
      raise exception 'Only the archive owner can approve, return or moderate an entry'
        using errcode = '42501';
    end if;

    -- Identity, ownership and moderation fields are not the author's to set.
    new.id := old.id;
    new.created_at := old.created_at;
    new.owner := old.owner;
    new.featured := old.featured;
    new.is_sample := old.is_sample;

    if old.status in ('returned', 'published') then
      -- Correcting a returned or published entry resubmits it for review, and
      -- clears the old review note.
      new.status := 'pending';
      new.review_note := null;
      new.reviewed_at := null;
      new.reviewed_by := null;
    else
      new.status := old.status;
      new.review_note := old.review_note;
      new.reviewed_at := old.reviewed_at;
      new.reviewed_by := old.reviewed_by;
    end if;
  end if;

  new.title := btrim(new.title);
  new.description := btrim(coalesce(new.description, ''));
  new.category := btrim(coalesce(new.category, ''));
  new.location := nullif(btrim(coalesce(new.location, '')), '');
  new.entry_date := nullif(btrim(coalesce(new.entry_date, '')), '');
  new.introduction := btrim(coalesce(new.introduction, ''));
  new.image_alt := btrim(coalesce(new.image_alt, ''));
  new.contributor_story := nullif(btrim(coalesce(new.contributor_story, '')), '');
  new.contributor := btrim(coalesce(new.contributor, ''));

  if char_length(new.contributor) not between 1 and 80 then
    raise exception 'Invalid contribution display name';
  end if;
  if char_length(new.title) not between 3 and 120 then
    raise exception 'Invalid contribution title';
  end if;
  if char_length(new.description) not between 20 and 500 then
    raise exception 'Invalid contribution description';
  end if;
  if new.category not in (
    'Palm Leaf Preparation', 'Weaving Techniques', 'House Construction',
    'Attachment Techniques', 'Maintenance & Repair', 'Traditional Houses'
  ) then
    raise exception 'Invalid contribution category';
  end if;

  if cardinality(new.topic_slugs) not between 1 and 5 then
    raise exception 'Invalid contribution topics';
  end if;
  select count(*) into topic_count
  from (
    select distinct topic_slug
    from unnest(new.topic_slugs) as selected(topic_slug)
  ) selected_topics
  join public.topics t on t.slug = selected_topics.topic_slug
  where t.scope = 'archive';
  if topic_count <> cardinality(new.topic_slugs) then
    raise exception 'Invalid contribution topics';
  end if;
  if new.location is not null and char_length(new.location) > 120 then
    raise exception 'Invalid contribution location';
  end if;
  if new.entry_date is not null
     and new.entry_date !~ '^[1-9][0-9]{3}(-((0[1-9])|(1[0-2])))?$' then
    raise exception 'Invalid contribution date';
  end if;
  if char_length(new.introduction) not between 20 and 2000 then
    raise exception 'Invalid contribution introduction';
  end if;
  if jsonb_array_length(new.steps) > 12 then
    raise exception 'Too many contribution steps';
  end if;
  for step_item in select value from jsonb_array_elements(new.steps)
  loop
    if jsonb_typeof(step_item) <> 'object'
       or char_length(btrim(coalesce(step_item->>'title', ''))) not between 3 and 80
       or char_length(btrim(coalesce(step_item->>'description', ''))) not between 10 and 500 then
      raise exception 'Invalid contribution step';
    end if;
  end loop;
  new.steps := (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'title', btrim(value->>'title'),
          'description', btrim(value->>'description')
        ) order by ordinality
      ),
      '[]'::jsonb
    )
    from jsonb_array_elements(new.steps) with ordinality as items(value, ordinality)
  );
  if jsonb_array_length(new.tips) > 10 then
    raise exception 'Too many contribution tips';
  end if;
  for tip_item in select value from jsonb_array_elements(new.tips)
  loop
    if jsonb_typeof(tip_item) <> 'string'
       or char_length(btrim(tip_item #>> '{}')) not between 3 and 300 then
      raise exception 'Invalid contribution tip';
    end if;
  end loop;
  new.tips := (
    select coalesce(
      jsonb_agg(to_jsonb(btrim(value #>> '{}')) order by ordinality),
      '[]'::jsonb
    )
    from jsonb_array_elements(new.tips) with ordinality as items(value, ordinality)
  );
  if new.contributor_story is not null
     and char_length(new.contributor_story) > 3000 then
    raise exception 'Invalid contributor story';
  end if;
  if char_length(new.image_alt) not between 10 and 250 then
    raise exception 'Invalid contribution photo description';
  end if;
  -- The photo must live in the author's own storage folder.
  if new.image_path is null
     or new.image_path not like
       '%/storage/v1/object/public/photos/' || new.owner::text || '/%' then
    raise exception 'Invalid contribution photo';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_contribution_rules on public.entries;
create trigger enforce_contribution_rules
  before insert or update on public.entries
  for each row execute function public.enforce_contribution_rules();

revoke execute on function public.enforce_contribution_rules()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. Moderation guard: the automatic resubmission may clear the review note
-- ---------------------------------------------------------------------------
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
     and not (
       coalesce((select public.current_profile_role()), '') = 'contributor'
       and new.owner = (select auth.uid())
       and old.status in ('returned', 'published')
       and new.status = 'pending'
     ) then
    raise exception 'Only the archive owner can approve, return or moderate an entry'
      using errcode = '42501';
  end if;

  if new.featured is distinct from old.featured
     or new.is_sample is distinct from old.is_sample then
    raise exception 'Only the archive owner can approve, return or moderate an entry'
      using errcode = '42501';
  end if;

  -- `enforce_contribution_rules` sorts before this trigger and has already
  -- cleared the review columns while resubmitting a returned or published
  -- entry. Only the contributing owner can reach that transition: an editor
  -- changing a published row's status is refused above, so reviewing can never
  -- unpublish an entry. Removing the old note is part of the resubmission, so
  -- it is allowed here - but the author may only clear the columns, never
  -- write into them.
  if old.status in ('returned', 'published') and new.status = 'pending' then
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

drop trigger if exists prevent_owner_moderation_changes on public.entries;
create trigger prevent_owner_moderation_changes
  before update on public.entries
  for each row execute function public.prevent_owner_moderation_changes();

revoke execute on function public.prevent_owner_moderation_changes()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Owners may revise a published entry, but never publish it themselves
-- ---------------------------------------------------------------------------
-- WITH CHECK is evaluated after the BEFORE triggers, so the resubmission
-- trigger has already turned the row into 'pending' by the time this check
-- runs. A hand-written request that tries to leave the row 'published' is
-- refused by the policy (and by the trigger above).
drop policy if exists entries_owner_update on public.entries;
create policy entries_owner_update on public.entries
  for update to authenticated
  using (
    owner = (select auth.uid())
    and status in ('pending', 'returned', 'published')
  )
  with check (
    owner = (select auth.uid())
    and status in ('pending', 'returned')
  );
