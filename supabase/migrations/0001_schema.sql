-- ============================================================================
-- 0001_schema.sql — Palm-Leaf Archive core schema
-- ============================================================================
-- Key strategy: text natural keys. Every id the application already uses
-- (`arch-01`, `story-02`, `step-04-weaving`, `gal-09`, `person-community-elder`)
-- is the primary key here, so the relationship arrays in `data/*.js` map onto
-- foreign keys with no id remapping during seeding. Only `profiles.id` is a
-- uuid, because it references `auth.users`.
--
-- Relationships live in six join tables. A join table holds exactly one row per
-- pair, so a one-directional link (like the `gal-04 -> story-01` bug this
-- schema replaces) becomes structurally impossible.
--
-- Ordered child lists that are only ever read with their parent (`steps`,
-- `tips`, `full_story`, `related_images`) stay as jsonb.
-- ============================================================================

create extension if not exists pg_trgm;

-- shared updated_at trigger -------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

-- Editorial bucket: exactly one per archive entry. A different axis from
-- topics, which are many-to-many subject labels.
create table public.archive_categories (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  name_en     text not null unique,
  name_km     text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- The shared subject vocabulary. The primary key IS the slug, because the
-- application's relations already reference topics by slug.
create table public.topics (
  slug            text primary key check (slug ~ '^[a-z0-9-]+$'),
  legacy_id       text unique,          -- 'topic-roof-covering', kept for traceability
  name_en         text not null,
  name_km         text,
  scope           text not null check (scope in ('archive','gallery')),
  description_en  text,
  description_km  text,
  sort_order      int  not null default 0,
  created_at      timestamptz not null default now()
);

-- Contributors and story tellers. Distinct from `profiles` (application users).
-- A null `name` marks an anonymous attribution type, whose display string is
-- kept in `attribution_label`.
create table public.people (
  id                 text primary key check (id ~ '^person-[a-z0-9-]+$'),
  slug               text not null unique,
  name               text,
  role               text not null check (role in
                       ('weaver','householder','carpenter','anonymous-contributor','sample')),
  attribution_label  text,
  created_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Application users (auth-linked). Credentials live in auth.users; this table
-- only holds profile metadata. RLS and the signup trigger are in 0002_rls.sql.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  display_name       text,
  role               text not null default 'reader'
                     check (role in ('reader','contributor','editor','admin')),
  preferred_language text not null default 'en'
                     check (preferred_language in ('en','km')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

create sequence public.stories_id_seq start 5;   -- story-01..04 are seeded

create table public.stories (
  id                text primary key
                    default 'story-' || lpad(nextval('public.stories_id_seq')::text, 2, '0')
                    check (id ~ '^story-[0-9]{2,}$'),
  slug              text not null unique,
  person_id         text references public.people(id) on delete set null,
  name              text not null,
  generation_label  text,
  location_label    text,
  quote_en          text,
  quote_km          text,
  title_en          text not null,
  title_km          text,
  excerpt_en        text,
  excerpt_km        text,
  portrait_path     text,
  full_story        jsonb not null default '[]'::jsonb
                    check (jsonb_typeof(full_story) = 'array'),
  is_sample         boolean not null default false,
  status            text not null default 'published'
                    check (status in ('draft','published','archived')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create sequence public.archive_entries_id_seq start 9;   -- arch-01..08 are seeded

create table public.archive_entries (
  id                    text primary key
                        default 'arch-' || lpad(nextval('public.archive_entries_id_seq')::text, 2, '0')
                        check (id ~ '^arch-[0-9]{2,}$'),
  slug                  text not null unique,
  title_en              text not null,
  title_km              text,
  description_en        text,
  description_km        text,
  introduction_en       text,
  introduction_km       text,
  contributor_story_en  text,   -- the legacy quoted testimony
  contributor_story_km  text,
  category_id           text not null
                        references public.archive_categories(id) on delete restrict,
  person_id             text references public.people(id) on delete set null,
  source_story_id       text references public.stories(id) on delete set null,
  contributor           text,   -- display label, until people.name is filled
  location_label        text,
  date_label            text,   -- 'March 2024' verbatim
  occurred_on           date,
  hero_image_path       text not null,
  hero_image_alt        text not null,
  steps                 jsonb not null default '[]'::jsonb
                        check (jsonb_typeof(steps) = 'array'),
  tips                  jsonb not null default '[]'::jsonb
                        check (jsonb_typeof(tips) = 'array'),
  -- TRANSITIONAL: superseded by entry_gallery. 13 of its rows point at files the
  -- gallery does not cover yet, so it stays until those are reconciled.
  related_images        jsonb not null default '[]'::jsonb
                        check (jsonb_typeof(related_images) = 'array'),
  featured              boolean not null default false,
  is_sample             boolean not null default false,
  status                text not null default 'published'
                        check (status in ('draft','published','archived')),
  published_at          timestamptz,
  created_by            uuid references public.profiles(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create table public.technique_steps (
  id                    text primary key
                        check (id ~ '^step-[0-9]{2}-[a-z0-9-]+$'),
  slug                  text not null unique,
  step_number           text not null,   -- '04' — a display label, not an order key
  position              int  not null unique,   -- the real ordering key
  title_en              text not null,
  title_km              text,
  description_en        text,
  description_km        text,
  tip_en                text,
  tip_km                text,
  -- provenance for guidance that is also stated on an entry
  tip_source_entry_id   text references public.archive_entries(id) on delete set null,
  image_path            text,
  image_alt             text,
  status                text not null default 'published'
                        check (status in ('draft','published','archived')),
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create sequence public.gallery_images_id_seq start 15;   -- gal-01..14 are seeded

create table public.gallery_images (
  id                text primary key
                    default 'gal-' || lpad(nextval('public.gallery_images_id_seq')::text, 2, '0')
                    check (id ~ '^gal-[0-9]{2,}$'),
  topic_slug        text not null references public.topics(slug) on delete restrict,
  image_path        text not null,
  alt               text not null,   -- accessibility text is never optional
  title_en          text not null,
  title_km          text,
  description_en    text,
  description_km    text,
  person_id         text references public.people(id) on delete set null,
  contributor       text,
  location_label    text,
  captured_on       date,
  position          int not null default 0,
  is_sample         boolean not null default false,
  status            text not null default 'published'
                    check (status in ('draft','published','archived')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Join tables — one row per pair, so a link cannot exist in one direction only
-- ---------------------------------------------------------------------------

create table public.entry_stories (
  entry_id  text not null references public.archive_entries(id) on delete cascade,
  story_id  text not null references public.stories(id) on delete cascade,
  primary key (entry_id, story_id)
);

create table public.entry_steps (
  entry_id  text not null references public.archive_entries(id) on delete cascade,
  step_id   text not null references public.technique_steps(id) on delete cascade,
  primary key (entry_id, step_id)
);

create table public.entry_gallery (
  entry_id  text not null references public.archive_entries(id) on delete cascade,
  image_id  text not null references public.gallery_images(id) on delete cascade,
  primary key (entry_id, image_id)
);

create table public.entry_topics (
  entry_id    text not null references public.archive_entries(id) on delete cascade,
  topic_slug  text not null references public.topics(slug) on delete restrict,
  position    int  not null default 0,
  is_primary  boolean not null default false,
  primary key (entry_id, topic_slug)
);

-- an entry has exactly one headline topic, enforced by the database
create unique index one_primary_topic_per_entry
  on public.entry_topics (entry_id) where is_primary;

create table public.story_gallery (
  story_id  text not null references public.stories(id) on delete cascade,
  image_id  text not null references public.gallery_images(id) on delete cascade,
  primary key (story_id, image_id)
);

create table public.step_gallery (
  step_id   text not null references public.technique_steps(id) on delete cascade,
  image_id  text not null references public.gallery_images(id) on delete cascade,
  primary key (step_id, image_id)
);

-- ---------------------------------------------------------------------------
-- Indexes. Primary keys cover the leading column; these cover the reverse
-- direction of every relationship ("which entries use this story?").
-- ---------------------------------------------------------------------------
create index on public.archive_entries (status, category_id);
create index on public.archive_entries (featured) where featured;
create index on public.archive_entries (person_id);
create index on public.archive_entries (source_story_id);
create index on public.stories (status);
create index on public.stories (person_id);
create index on public.technique_steps (status, position);
create index on public.technique_steps (tip_source_entry_id);
create index on public.gallery_images (status, position);
create index on public.gallery_images (topic_slug);
create index on public.gallery_images (person_id);
create index on public.entry_stories (story_id);
create index on public.entry_steps (step_id);
create index on public.entry_gallery (image_id);
create index on public.entry_topics (topic_slug);
create index on public.story_gallery (image_id);
create index on public.step_gallery (image_id);

-- ---------------------------------------------------------------------------
-- Search
-- ---------------------------------------------------------------------------
-- Mirrors the search the UI already performs: both languages of the title and
-- description, the contributor, and the entry's topic names. pg_trgm is used
-- rather than tsvector because Postgres has no Khmer text-search configuration
-- and trigram ILIKE matches the existing substring-search behaviour exactly.
--
-- Topic names live in another table, so the column is maintained by trigger
-- rather than being a generated column.
alter table public.archive_entries add column search_text text not null default '';

create or replace function public.refresh_entry_search_text(target text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.archive_entries e
  set search_text = lower(
        coalesce(e.title_en, '')       || ' ' ||
        coalesce(e.title_km, '')       || ' ' ||
        coalesce(e.description_en, '') || ' ' ||
        coalesce(e.description_km, '') || ' ' ||
        coalesce(e.contributor, '')    || ' ' ||
        coalesce((
          select string_agg(t.name_en || ' ' || coalesce(t.name_km, ''), ' ')
          from public.entry_topics et
          join public.topics t on t.slug = et.topic_slug
          where et.entry_id = e.id
        ), '')
      )
  where e.id = target;
$$;

create or replace function public.archive_entries_search_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (tg_op = 'DELETE') then
    perform public.refresh_entry_search_text(old.id);
  else
    perform public.refresh_entry_search_text(new.id);
  end if;
  return null;
end;
$$;

-- Fires only when searchable columns change. The inner UPDATE touches just
-- `search_text`, so it does not re-fire this trigger.
create trigger archive_entries_refresh_search
  after insert or update of title_en, title_km, description_en, description_km, contributor
  on public.archive_entries
  for each row execute function public.archive_entries_search_trigger();

create or replace function public.entry_topics_search_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (tg_op = 'DELETE') then
    perform public.refresh_entry_search_text(old.entry_id);
  else
    perform public.refresh_entry_search_text(new.entry_id);
  end if;
  return null;
end;
$$;

create trigger entry_topics_refresh_search
  after insert or delete or update on public.entry_topics
  for each row execute function public.entry_topics_search_trigger();

create index archive_entries_search_trgm
  on public.archive_entries using gin (search_text gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_archive_entries
  before update on public.archive_entries
  for each row execute function public.set_updated_at();
create trigger set_updated_at_stories
  before update on public.stories
  for each row execute function public.set_updated_at();
create trigger set_updated_at_technique_steps
  before update on public.technique_steps
  for each row execute function public.set_updated_at();
create trigger set_updated_at_gallery_images
  before update on public.gallery_images
  for each row execute function public.set_updated_at();
