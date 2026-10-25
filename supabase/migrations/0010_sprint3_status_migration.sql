-- Sprint 3: Submit, Review, Publish
-- Adds pending -> published -> returned status workflow

-- 1. Update status constraint
alter table public.entries
  drop constraint if exists entries_status_check;

alter table public.entries
  add constraint entries_status_check
  check (status in ('pending', 'published', 'returned'));

-- 2. Migrate existing data
update public.entries set status = 'pending' where status = 'draft';

-- 3. Update public read policy
drop policy if exists entries_public_published on public.entries;
create policy entries_public_published on public.entries
  for select to anon, authenticated
  using (status = 'published');

-- 4. Update contribution trigger to force 'pending'
create or replace function public.enforce_contribution_rules()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if public.current_profile_role() = 'contributor' then
    new.id := gen_random_uuid();
    new.created_at := now();
    new.updated_at := now();
    new.owner := auth.uid();
    new.status := 'pending';
    new.featured := false;
    new.is_sample := false;
    new.contributor := btrim(coalesce(new.contributor, ''));
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
    if new.owner is null
       or new.image_path not like
         '%/storage/v1/object/public/photos/' || new.owner::text || '/%' then
      raise exception 'Invalid contribution photo';
    end if;
  end if;

  return new;
end;
$$;

-- 5. Grants
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;
