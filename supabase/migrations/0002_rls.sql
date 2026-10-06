-- ============================================================================
-- 0002_rls.sql — row level security
-- ============================================================================
-- Public (anon) access is read-only and limited to published content. Writes
-- require an editor or admin role, resolved through a security definer helper
-- so a policy on `profiles` never has to read `profiles` (which would recurse).
--
-- Role is deliberately not self-upgradable: without that check, anyone who can
-- sign up could promote themselves to editor.
-- ============================================================================

-- helpers -------------------------------------------------------------------
-- Named `current_profile_role` rather than `current_role`, which is a reserved
-- SQL keyword.
create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

create or replace function public.is_editor()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(public.current_profile_role() in ('editor','admin'), false)
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select coalesce(public.current_profile_role() = 'admin', false)
$$;

-- enable RLS everywhere -----------------------------------------------------
alter table public.profiles            enable row level security;
alter table public.people              enable row level security;
alter table public.topics              enable row level security;
alter table public.archive_categories  enable row level security;
alter table public.archive_entries     enable row level security;
alter table public.stories             enable row level security;
alter table public.technique_steps     enable row level security;
alter table public.gallery_images      enable row level security;
alter table public.entry_stories       enable row level security;
alter table public.entry_steps         enable row level security;
alter table public.entry_gallery       enable row level security;
alter table public.entry_topics        enable row level security;
alter table public.story_gallery       enable row level security;
alter table public.step_gallery        enable row level security;

-- profiles ------------------------------------------------------------------
create policy profiles_select_self on public.profiles
  for select using (id = (select auth.uid()));

-- `role` must equal the caller's existing role, so a profile cannot be
-- promoted by its owner.
create policy profiles_update_self on public.profiles
  for update
  using (id = (select auth.uid()))
  with check (
    id = (select auth.uid())
    and role = public.current_profile_role()
  );

create policy profiles_admin_all on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- people --------------------------------------------------------------------
-- No public policy: `people` is readable by editors, and the public sees the
-- `public_people` view instead.
create policy people_editor_all on public.people
  for all using (public.is_editor()) with check (public.is_editor());

-- topics and categories: public vocabulary, editor-maintained ----------------
create policy topics_public_read on public.topics
  for select using (true);
create policy topics_editor_all on public.topics
  for all using (public.is_editor()) with check (public.is_editor());

create policy categories_public_read on public.archive_categories
  for select using (true);
create policy categories_editor_all on public.archive_categories
  for all using (public.is_editor()) with check (public.is_editor());

-- content tables: published is public, everything else is editorial ----------
create policy archive_entries_public_read on public.archive_entries
  for select using (status = 'published');
create policy archive_entries_editor_all on public.archive_entries
  for all using (public.is_editor()) with check (public.is_editor());

create policy stories_public_read on public.stories
  for select using (status = 'published');
create policy stories_editor_all on public.stories
  for all using (public.is_editor()) with check (public.is_editor());

create policy technique_steps_public_read on public.technique_steps
  for select using (status = 'published');
create policy technique_steps_editor_all on public.technique_steps
  for all using (public.is_editor()) with check (public.is_editor());

create policy gallery_images_public_read on public.gallery_images
  for select using (status = 'published');
create policy gallery_images_editor_all on public.gallery_images
  for all using (public.is_editor()) with check (public.is_editor());

-- join tables ---------------------------------------------------------------
-- Join rows inherit their visibility from the parent that owns them, so a link
-- to an unpublished entry or story is not readable.
create or replace function public.entry_is_published(entry text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.archive_entries e
    where e.id = entry and e.status = 'published'
  )
$$;

create or replace function public.story_is_published(story text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.stories s
    where s.id = story and s.status = 'published'
  )
$$;

create or replace function public.step_is_published(step text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.technique_steps s
    where s.id = step and s.status = 'published'
  )
$$;

create policy entry_stories_public_read on public.entry_stories
  for select using (public.entry_is_published(entry_id));
create policy entry_stories_editor_all on public.entry_stories
  for all using (public.is_editor()) with check (public.is_editor());

create policy entry_steps_public_read on public.entry_steps
  for select using (public.entry_is_published(entry_id));
create policy entry_steps_editor_all on public.entry_steps
  for all using (public.is_editor()) with check (public.is_editor());

create policy entry_gallery_public_read on public.entry_gallery
  for select using (public.entry_is_published(entry_id));
create policy entry_gallery_editor_all on public.entry_gallery
  for all using (public.is_editor()) with check (public.is_editor());

create policy entry_topics_public_read on public.entry_topics
  for select using (public.entry_is_published(entry_id));
create policy entry_topics_editor_all on public.entry_topics
  for all using (public.is_editor()) with check (public.is_editor());

create policy story_gallery_public_read on public.story_gallery
  for select using (public.story_is_published(story_id));
create policy story_gallery_editor_all on public.story_gallery
  for all using (public.is_editor()) with check (public.is_editor());

create policy step_gallery_public_read on public.step_gallery
  for select using (public.step_is_published(step_id));
create policy step_gallery_editor_all on public.step_gallery
  for all using (public.is_editor()) with check (public.is_editor());

-- public projection of people -----------------------------------------------
-- `people` itself is editor-only, but the public needs contributor names in
-- order to credit them. The view reads past RLS (security_invoker = false, the
-- default for a view owned by the table owner) and exposes only these columns.
-- Placeholder attribution records (role = 'sample') are withheld.
create view public.public_people
with (security_invoker = false) as
select id, slug, name, role, attribution_label
from public.people
where role <> 'sample';

-- grants --------------------------------------------------------------------
-- RLS is what gates access; these grants just make the tables reachable through
-- the API roles.
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- new signups get a reader profile ------------------------------------------
-- Runs as definer so it can insert despite `profiles` having no insert policy
-- for end users, and so role always starts as the column default ('reader').
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- lock down definer helpers --------------------------------------------------
-- PostgreSQL grants EXECUTE to PUBLIC by default. These three run as the owner
-- and are only ever invoked by triggers, so no API role needs to call them.
-- The policy helpers (is_editor, is_admin, *_is_published) are deliberately NOT
-- revoked: policy expressions are evaluated as the caller, so anon and
-- authenticated must keep EXECUTE on them.
revoke execute on function public.refresh_entry_search_text(text) from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
