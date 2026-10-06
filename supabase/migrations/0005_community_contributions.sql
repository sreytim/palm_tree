-- Community members can submit entries as drafts. Editors alone can publish,
-- edit, or remove entries. Public reads are limited to published entries.

alter table public.profiles
  alter column role set default 'contributor';

update public.profiles
set role = 'contributor'
where role = 'reader';

create table if not exists public.entries (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  owner             uuid not null references auth.users (id),
  slug              text not null unique,
  title             text not null,
  description       text,
  category          text,
  topic_slugs       text[] not null default '{}',
  contributor       text,
  location          text,
  entry_date        text,
  image_path        text not null,
  image_alt         text,
  introduction      text,
  steps             jsonb not null default '[]'::jsonb
                    check (jsonb_typeof(steps) = 'array'),
  tips              jsonb not null default '[]'::jsonb
                    check (jsonb_typeof(tips) = 'array'),
  contributor_story text,
  featured          boolean not null default false,
  is_sample         boolean not null default false,
  status            text not null default 'draft'
                    check (status in ('draft','published','archived')),
  updated_at        timestamptz not null default now()
);

create index if not exists entries_owner_idx on public.entries (owner);
create index if not exists entries_category_idx on public.entries (category);
create index if not exists entries_status_idx on public.entries (status);

alter table public.entries enable row level security;

drop policy if exists "anyone can read entries" on public.entries;
drop policy if exists "owners add their own entries" on public.entries;
drop policy if exists "owners edit their own entries" on public.entries;
drop policy if exists "owners delete their own entries" on public.entries;
drop policy if exists entries_public_published on public.entries;
drop policy if exists entries_owner_read on public.entries;
drop policy if exists entries_editor_read on public.entries;
drop policy if exists entries_contributor_insert on public.entries;
drop policy if exists entries_editor_update on public.entries;
drop policy if exists entries_editor_delete on public.entries;

create policy entries_public_published on public.entries
  for select using (status = 'published');

create policy entries_owner_read on public.entries
  for select to authenticated
  using (owner = (select auth.uid()));

create policy entries_editor_read on public.entries
  for select to authenticated
  using (public.is_editor());

create policy entries_contributor_insert on public.entries
  for insert to authenticated
  with check (
    owner = (select auth.uid())
    and (select public.current_profile_role()) in ('contributor','editor','admin')
  );

create policy entries_editor_update on public.entries
  for update to authenticated
  using (public.is_editor())
  with check (public.is_editor());

create policy entries_editor_delete on public.entries
  for delete to authenticated
  using (public.is_editor());

grant select on public.entries to anon, authenticated;
grant insert, update, delete on public.entries to authenticated;

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
begin
  if public.current_profile_role() = 'contributor' then
    new.id := gen_random_uuid();
    new.created_at := now();
    new.updated_at := now();
    new.owner := auth.uid();
    new.status := 'draft';
    new.featured := false;
    new.is_sample := false;
    new.contributor := 'Community Contributor';
  end if;

  if public.current_profile_role() = 'contributor' then
    new.title := btrim(new.title);
    new.description := btrim(coalesce(new.description, ''));
    new.category := btrim(coalesce(new.category, ''));
    new.location := nullif(btrim(coalesce(new.location, '')), '');
    new.entry_date := nullif(btrim(coalesce(new.entry_date, '')), '');
    new.introduction := btrim(coalesce(new.introduction, ''));
    new.image_alt := btrim(coalesce(new.image_alt, ''));
    new.contributor_story := nullif(btrim(coalesce(new.contributor_story, '')), '');

  if char_length(new.title) not between 3 and 120 then
    raise exception 'Invalid contribution title';
  end if;
  if char_length(new.description) not between 20 and 500 then
    raise exception 'Invalid contribution description';
  end if;
  if new.category not in (
    'Palm Leaf Preparation',
    'Weaving Techniques',
    'House Construction',
    'Attachment Techniques',
    'Maintenance & Repair',
    'Traditional Houses'
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
  if new.owner is null
     or new.image_path not like
       '%/storage/v1/object/public/photos/' || new.owner::text || '/%' then
    raise exception 'Invalid contribution photo';
  end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_contribution_rules on public.entries;
create trigger enforce_contribution_rules
  before insert on public.entries
  for each row execute function public.enforce_contribution_rules();

revoke execute on function public.enforce_contribution_rules() from public, anon, authenticated;

drop trigger if exists set_updated_at_entries on public.entries;
create trigger set_updated_at_entries
  before update on public.entries
  for each row execute function public.set_updated_at();

insert into storage.buckets (
  id, name, public, file_size_limit, allowed_mime_types
)
values (
  'photos',
  'photos',
  true,
  10485760,
  array['image/jpeg','image/png','image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists photos_public_read on storage.objects;
drop policy if exists photos_contributor_insert on storage.objects;
drop policy if exists photos_owner_delete on storage.objects;

create policy photos_contributor_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.current_profile_role()) in ('contributor','editor','admin')
  );

create policy photos_owner_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.current_profile_role()) in ('contributor','editor','admin')
    and not exists (
      select 1
      from public.entries e
      where e.image_path like '%/storage/v1/object/public/photos/' || name
    )
  );
