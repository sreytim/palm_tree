-- Public visitors may read published archive entries, including labeled
-- examples. Writes remain limited to authenticated users by RLS and grants.
alter table public.entries enable row level security;

alter table public.entries
  add column if not exists sort_order integer generated always as (
    case
      when is_sample then
        case slug
          when 'preparing-palm-leaves-for-house-covering' then 1
          when 'the-cross-weave-pattern' then 2
          when 'raising-the-roof-frame' then 3
          when 'tying-panels-to-the-roof-frame' then 4
          when 'seasonal-roof-repair' then 5
          when 'the-family-house-in-kampong-speu' then 6
          when 'drying-technique-for-longer-lasting-panels' then 7
          when 'the-tools-of-a-traditional-thatcher' then 8
          else 1000
        end
      else 0
    end
  ) stored;

drop policy if exists entries_public_published on public.entries;
create policy entries_public_published on public.entries
  for select to anon, authenticated
  using (status = 'published');

revoke insert, update, delete on table public.entries from anon, public;
grant select on table public.entries to anon, authenticated;
grant insert, update, delete on table public.entries to authenticated;
