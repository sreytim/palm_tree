-- ============================================================================
-- Community contribution entries, row-level security and contributor policies
--
-- Manual/lab setup only: apply migrations 0001–0004, run this file and any
-- seed script, then apply 0005_community_contributions.sql. Standard migration
-- installs should skip this file; migration 0005 creates this table itself.
--
-- Safe to commit: no keys, no user uuid.
-- ============================================================================

create table entries (
  -- mandated by the worksheet
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  owner               uuid not null references auth.users (id),

  -- content columns
  slug                text not null unique,
  title               text not null,
  description         text,
  category            text,
  -- Added beyond the worksheet's column list. The archive's search index
  -- matches topic names as well as titles and descriptions, and each card shows
  -- its headline topic. Without this column, 9 of the 10 empty-state
  -- suggestion chips (e.g. "Roof Covering") would find nothing.
  -- The first element is the entry's headline topic.
  topic_slugs         text[] not null default '{}',
  contributor         text,
  location            text,
  entry_date          text,
  image_path          text not null,
  image_alt           text,
  introduction        text,
  steps               jsonb not null default '[]'::jsonb
                      check (jsonb_typeof(steps) = 'array'),
  tips                jsonb not null default '[]'::jsonb
                      check (jsonb_typeof(tips) = 'array'),
  contributor_story   text,
  featured            boolean not null default false,
  is_sample           boolean not null default false,
  status              text not null default 'draft'
                      check (status in ('draft','published','archived')),
  updated_at          timestamptz not null default now()
);

create index entries_owner_idx    on entries (owner);
create index entries_category_idx on entries (category);
create index entries_status_idx   on entries (status);

-- Row Level Security -------------------------------------------------------
alter table entries enable row level security;

drop policy if exists "anyone can read entries" on entries;
drop policy if exists "owners add their own entries" on entries;
drop policy if exists "owners edit their own entries" on entries;
drop policy if exists "owners delete their own entries" on entries;
drop policy if exists entries_public_published on entries;
drop policy if exists entries_owner_read on entries;
drop policy if exists entries_contributor_insert on entries;
drop policy if exists entries_editor_update on entries;
drop policy if exists entries_editor_delete on entries;

create policy entries_public_published on entries
  for select using (status = 'published');

create policy entries_owner_read on entries
  for select to authenticated
  using (owner = (select auth.uid()));

create policy entries_contributor_insert on entries
  for insert to authenticated
  with check (
    owner = (select auth.uid())
    and (select public.current_profile_role()) in ('contributor','editor','admin')
  );

create policy entries_editor_update on entries
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

create policy entries_editor_delete on entries
  for delete to authenticated
  using (public.is_editor());

-- Privileges ---------------------------------------------------------------
-- RLS decides which ROWS a role may touch; these decide whether it may touch
-- the TABLE at all. Supabase normally applies equivalents through default
-- privileges, but stating them removes any doubt (and is required on plain
-- PostgreSQL, where an unqualified role gets "permission denied").
grant select on entries to anon;
grant select, insert, update, delete on entries to authenticated;

-- Optional: if you want client inserts to work without passing `owner`
-- explicitly, give the column a default. Harmless for the seed, which supplies
-- owner on every row.
-- alter table entries alter column owner set default auth.uid();

-- Verify afterwards:
--   select count(*) from entries;                                  -- expect 8 after seeding
--   select policyname from pg_policies where tablename = 'entries'; -- expect 5
