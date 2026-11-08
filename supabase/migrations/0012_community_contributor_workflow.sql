-- ============================================================================
-- 0012_community_contributor_workflow.sql
-- ============================================================================
-- Community contributor workflow + super-admin controls.
--
-- Apply this file once in the Supabase SQL editor (or with the Supabase CLI)
-- after 0001–0011. It is idempotent: every statement can run again safely, so
-- it is also the repair script when an earlier policy ended up in a half
-- applied state.
--
-- Workflow it defines
--   contributor  submits  ->  status 'pending'   (invisible to the public)
--   editor/admin reviews  ->  'published'        (visible to everyone)
--                         ->  'returned' + note  (back to the contributor)
--   contributor  edits a returned entry -> back to 'pending' automatically.
--
-- Rules it enforces in the database (not only in the UI)
--   1. New sign-ups are 'contributor'; the e-mail in public.super_admins is
--      'admin'. Role changes are admin-only, and the owner account can never
--      be demoted.
--   2. A contributor owns only their own submissions, and may only edit or
--      withdraw rows that are still 'pending' or 'returned'.
--   3. Editors review any submission; admins manage every row.
--   4. Contribution content is validated on INSERT and on UPDATE, and one
--      account may hold at most 5 pending submissions.
--   5. status / featured / is_sample / review_* are moderation fields: only
--      editors and admins may change them.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Review metadata
-- ---------------------------------------------------------------------------
-- A returned submission carries the reason back to its author, so the
-- contributor sees what to fix instead of a bare "returned" label.
alter table public.entries add column if not exists review_note text;
alter table public.entries add column if not exists reviewed_at timestamptz;
alter table public.entries add column if not exists reviewed_by uuid
  references auth.users (id) on delete set null;

alter table public.entries drop constraint if exists entries_review_note_length;
alter table public.entries add constraint entries_review_note_length
  check (review_note is null or char_length(btrim(review_note)) between 1 and 500);

-- The review queue reads pending rows oldest-first, and the admin list filters
-- by status, so both paths get a covering index.
create index if not exists entries_review_queue_idx
  on public.entries (status, created_at);
create index if not exists entries_owner_status_idx
  on public.entries (owner, status);

-- ---------------------------------------------------------------------------
-- 2. Super-admin allow list
-- ---------------------------------------------------------------------------
-- The archive owner is identified by e-mail, never by a hard-coded uuid: the
-- account may be deleted and re-created during a rebuild. The table has RLS
-- enabled and no policy, so the API roles cannot read it at all — only the
-- security definer functions below (and the SQL editor) can.
create table if not exists public.super_admins (
  email      text primary key check (email = lower(email)),
  note       text,
  created_at timestamptz not null default now()
);

alter table public.super_admins enable row level security;
revoke all on table public.super_admins from anon, authenticated;

insert into public.super_admins (email, note)
values ('sreytimt@gmail.com', 'Archive owner - full control of entries and roles')
on conflict (email) do nothing;

-- Every new account starts as a contributor so any visitor can contribute
-- immediately; the owner account starts as admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    new.email,
    case
      when exists (
        select 1 from public.super_admins s where s.email = lower(new.email)
      ) then 'admin'
      else 'contributor'
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;


-- Repair accounts whose profile row was never created -----------------------
-- Some projects have auth users whose `profiles` insert never ran (the signup
-- trigger was missing or disabled when they registered). Every auth user needs
-- a profile, otherwise the app can never read its role.
insert into public.profiles (id, display_name, role)
select u.id,
       u.email,
       case
         when exists (
           select 1 from public.super_admins s where s.email = lower(u.email)
         ) then 'admin'
         else 'contributor'
       end
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- Promote the owner account if it already signed up before this migration.
update public.profiles p
set role = 'admin'
from auth.users u
join public.super_admins s on s.email = lower(u.email)
where p.id = u.id
  and p.role <> 'admin';

-- 'reader' was the original default. Such an account can browse but not
-- contribute, which contradicts "any visitor who signs up can contribute", so
-- legacy reader accounts become contributors.
update public.profiles
set role = 'contributor'
where role = 'reader';

-- ---------------------------------------------------------------------------
-- 3. Role changes are admin-only (and the owner cannot be demoted)
-- ---------------------------------------------------------------------------
-- profiles_update_self already stops a profile from promoting itself, but an
-- admin could still demote the owner account by accident. This trigger keeps
-- the archive owner permanently in charge, whoever else becomes an admin.
create or replace function public.prevent_profile_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is not distinct from old.role then
    return new;
  end if;

  -- Migrations, the SQL editor and service work run without auth.uid() and
  -- must stay able to repair data.
  if (select auth.uid()) is null then
    return new;
  end if;

  if not coalesce((select public.is_admin()), false) then
    raise exception 'Only admins can change profile roles'
      using errcode = '42501';
  end if;

  if old.role = 'admin' and exists (
    select 1
    from auth.users u
    join public.super_admins s on s.email = lower(u.email)
    where u.id = old.id
  ) then
    raise exception 'The archive owner account cannot be demoted'
      using errcode = '42501';
  end if;

  if new.role not in ('reader', 'contributor', 'editor', 'admin') then
    raise exception 'Unknown profile role' using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_profile_role_escalation on public.profiles;
create trigger prevent_profile_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_role_escalation();

revoke execute on function public.prevent_profile_role_escalation()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Entry policies
-- ---------------------------------------------------------------------------
-- Reading   anon        published rows only
--           owner       own rows, whatever the status (drafts previewable)
--           editor      every row
-- Writing   owner       own pending/returned rows only
--           editor      correct any row's text (no moderation, no delete)
--           admin       any row, including published ones
-- ---------------------------------------------------------------------------
alter table public.entries enable row level security;


-- Start from a clean slate ---------------------------------------------------
-- Remove every policy that currently exists on `public.entries`, whatever its
-- name. A policy created by hand in the dashboard (for example
-- "anyone can read entries") is OR-ed with the policies below, so leaving it in
-- place would re-open the exact hole this migration closes.
do $$
declare
  existing record;
begin
  for existing in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'entries'
  loop
    execute format('drop policy if exists %I on public.entries', existing.policyname);
  end loop;
end;
$$;

drop policy if exists entries_public_published on public.entries;
drop policy if exists entries_owner_read on public.entries;
drop policy if exists entries_editor_read on public.entries;
drop policy if exists entries_owner_insert on public.entries;
drop policy if exists entries_owner_update on public.entries;
drop policy if exists entries_owner_delete on public.entries;
drop policy if exists entries_editor_update on public.entries;
drop policy if exists entries_editor_delete on public.entries;
drop policy if exists entries_admin_update on public.entries;
drop policy if exists entries_admin_delete on public.entries;

create policy entries_public_published on public.entries
  for select to anon, authenticated
  using (status = 'published');

create policy entries_owner_read on public.entries
  for select to authenticated
  using (owner = (select auth.uid()));

create policy entries_editor_read on public.entries
  for select to authenticated
  using (public.is_editor());

create policy entries_owner_insert on public.entries
  for insert to authenticated
  with check (
    owner = (select auth.uid())
    and (select public.current_profile_role()) in ('contributor', 'editor', 'admin')
  );

-- A published entry is no longer the owner's to change: once it is live, only
-- an editor or admin can touch it. That keeps a contributor from rewriting
-- approved content (or deleting it) behind the reviewers' back. Editing a
-- 'returned' row is allowed, and the trigger in section 6 puts it back in the
-- queue as 'pending'.
create policy entries_owner_update on public.entries
  for update to authenticated
  using (
    owner = (select auth.uid())
    and status in ('pending', 'returned')
  )
  with check (
    owner = (select auth.uid())
    and status in ('pending', 'returned')
  );

create policy entries_owner_delete on public.entries
  for delete to authenticated
  using (
    owner = (select auth.uid())
    and status in ('pending', 'returned')
  );

create policy entries_editor_update on public.entries
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

-- Editors cannot delete: removing a submission is the archive owner's call.

create policy entries_admin_update on public.entries
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy entries_admin_delete on public.entries
  for delete to authenticated
  using (public.is_admin());

revoke insert, update, delete on table public.entries from anon, public;
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;


-- ---------------------------------------------------------------------------
-- 5. Contribution rules — INSERT and UPDATE
-- ---------------------------------------------------------------------------
-- The rules used to run on INSERT only, so an owner could update a pending row
-- straight past every length check. The same validation now runs on both
-- paths. Editors and admins are exempt (they moderate, and the API validates
-- their input separately).
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
    -- Identity, ownership and moderation fields are not the author's to set.
    new.id := old.id;
    new.created_at := old.created_at;
    new.owner := old.owner;
    new.featured := old.featured;
    new.is_sample := old.is_sample;

    if old.status = 'returned' then
      -- Fixing a returned entry resubmits it, and clears the old review note.
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
-- 6. Moderation fields belong to the archive owner alone
-- ---------------------------------------------------------------------------
-- Approving, returning, featuring and deleting decide what the public sees, so
-- only an admin may do them. Editors keep write access to an entry's text
-- (`entries_editor_update`), but every moderation field is refused for them
-- here. An author can never move these fields either; the single exception is
-- the automatic 'returned' -> 'pending' resubmission performed by the
-- contribution trigger.
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

-- Re-apply the status workflow ---------------------------------------------
-- 0010/0011 replaced 'draft'/'archived' with 'pending'/'returned'. This runs
-- after the guard above so a project whose constraint was never updated is
-- repaired here instead of rejecting every new submission. It runs with no
-- auth.uid() (SQL editor), which the guard allows.
alter table public.entries drop constraint if exists entries_status_check;
update public.entries
set status = 'pending'
where status not in ('pending', 'published', 'returned');
alter table public.entries add constraint entries_status_check
  check (status in ('pending', 'published', 'returned'));

-- ---------------------------------------------------------------------------
-- 7. updated_at maintenance
-- ---------------------------------------------------------------------------
-- Re-created so this migration also repairs a table whose trigger was dropped
-- while the policies were edited by hand in the dashboard. The legacy
-- `archive_entries` search triggers from 0001 are untouched: they belong to the
-- old schema, not to `public.entries`.
drop trigger if exists set_updated_at_entries on public.entries;
create trigger set_updated_at_entries
  before update on public.entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 8. Storage
-- ---------------------------------------------------------------------------
-- The `photos` bucket and its policies were created in 0005: public read,
-- insert only into the caller's own `<uid>/` folder, delete only once no entry
-- references the object. Deleting a submission therefore frees its photo for
-- the owner to remove, which the API does after the row is gone.
--
-- An admin removing somebody else's entry also removes its photo, which the
-- owner-scoped delete policy would refuse, so admins need their own rule.
drop policy if exists photos_admin_delete on storage.objects;
create policy photos_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'photos' and public.is_admin());
-- ============================================================================

