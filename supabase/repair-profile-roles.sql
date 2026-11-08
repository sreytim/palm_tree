-- ============================================================================
-- repair-profile-roles.sql — one-off repair, safe to run any number of times
-- ============================================================================
-- Why this exists
-- `profiles.role` used to default to 'reader' (0001_schema.sql). Only
-- 'contributor', 'editor' and 'admin' may submit an entry, so an account left
-- on 'reader' — or an account whose profile row was never created because the
-- signup trigger was missing — sees "Your account does not yet have
-- contributor access" on /contribute.
--
-- Migration 0012 does both of these fixes itself. Run this file only when you
-- need to unblock contribution BEFORE the full workflow migration is applied:
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/repair-profile-roles.sql
--
-- or paste the three statements below into the Supabase SQL editor.
-- ============================================================================

-- 1. Create the profile row for any auth user that never got one.
insert into public.profiles (id, display_name, role)
select u.id, u.email, 'contributor'
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- 2. 'reader' cannot contribute. Any visitor who signs in should be able to.
update public.profiles
set role = 'contributor'
where role = 'reader';

-- 3. Report the result, so the change is visible in the SQL editor.
select u.email, p.role, p.created_at
from auth.users u
left join public.profiles p on p.id = u.id
order by p.created_at;
