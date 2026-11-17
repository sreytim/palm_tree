-- ============================================================================
-- 0015_admin_access_repair.sql
-- ============================================================================
-- Why this file exists
--
-- The app decides who may review submissions from the role stored in
-- `public.profiles` (reader / contributor / editor / admin). The archive owner
-- is identified by e-mail in `public.super_admins` and is supposed to be
-- promoted to 'admin' by migration 0012.
--
-- When that promotion never happened — the account was created after 0012, the
-- sign-up trigger was missing, or 0012 stopped part-way — the owner signs in as
-- a contributor:
--   * the "Admin area" links are hidden in the account menu;
--   * /admin/review answers "admin access required";
--   * published entries look fine, but every pending submission stays invisible
--     because Row Level Security only shows them to editors and admins.
--
-- What this script does (every statement is safe to run again)
--   1. re-adds the owner e-mail to the allow list;
--   2. recreates the sign-up trigger, so new accounts get the right role;
--   3. creates a profile row for any auth user that never got one;
--   4. promotes every allow-listed account to 'admin';
--   5. makes `public.current_profile_role()` answer 'admin' for the allow-listed
--      e-mail even when the profile row is out of date, so Row Level Security
--      and the app (which reads that function) cannot lock the owner out again;
--   6. prints every account with its role, the allow-list state and the number
--      of pending submissions — the result is the verification.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL editor -> paste this file -> Run.
--   Then reload the app and sign in again.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Allow list
-- ---------------------------------------------------------------------------
insert into public.super_admins (email, note)
values ('sreytimt@gmail.com', 'Archive owner - full control of entries and roles')
on conflict (email) do nothing;

-- ---------------------------------------------------------------------------
-- 2. New sign-ups: the allow-listed e-mail becomes admin, everyone else a
--    contributor. Recreated here so the workflow cannot rot if the trigger was
--    dropped by hand in the dashboard.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 3. Accounts whose profile row never got created
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 4. Promote the allow-listed accounts
-- ---------------------------------------------------------------------------
update public.profiles p
set role = 'admin',
    updated_at = now()
from auth.users u
join public.super_admins s on s.email = lower(u.email)
where p.id = u.id
  and p.role <> 'admin';

-- ---------------------------------------------------------------------------
-- 5. Effective role
-- ---------------------------------------------------------------------------
-- The allow-listed e-mail is always admin, whatever `profiles.role` says. This
-- is the same function Row Level Security calls through `is_admin()` and
-- `is_editor()`, so the review queue, the entry manager and the REST API all
-- agree with the app without a second repair.
create or replace function public.current_profile_role()
returns text
language sql
security definer
set search_path = ''
stable
as $$
  select case
    when exists (
      select 1
      from auth.users u
      join public.super_admins s on s.email = lower(u.email)
      where u.id = (select auth.uid())
    ) then 'admin'
    else (select p.role from public.profiles p where p.id = (select auth.uid()))
  end
$$;

-- ---------------------------------------------------------------------------
-- 6. Report
-- ---------------------------------------------------------------------------
select u.email,
       coalesce(p.role, '(no profile row)') as profile_role,
       (s.email is not null)                as allow_listed,
       (select count(*) from public.entries e where e.status = 'pending')
         as pending_submissions
from auth.users u
left join public.profiles p on p.id = u.id
left join public.super_admins s on s.email = lower(u.email)
order by u.created_at;
