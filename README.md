# Palm Leaf Archive

A digital cultural archive preserving traditional knowledge about using palm
leaves to cover houses, built with Next.js (App Router), TypeScript, and
Tailwind CSS.

This project is organized around the first three labs: deploy the collection,
render real entries through `EntryCard`, then browse and search those entries.

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in a browser **on the computer running
`npm run dev`**. `localhost` always means the device you are browsing from, so
that address only answers while the dev server is running on that same machine —
it cannot be opened from a phone, another laptop, or a GitHub link.

The deployed archive, which works from any device, is
https://palm-tree-gilt.vercel.app.

## Authentication Configuration

The sign-up, login, and logout flows use Supabase Auth through
`@supabase/ssr`. Copy `.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Get these values from your Supabase project's API settings. The publishable key
is intended for browser use; never put a `service_role` key or other secret in
a `NEXT_PUBLIC_` variable or committed file. `.env.local` is git-ignored.
Restart `npm run dev` after changing environment variables.

In Supabase Authentication → URL Configuration, configure:

- **Site URL**: `https://palm-tree-gilt.vercel.app`
- **Redirect URLs**: `https://palm-tree-gilt.vercel.app/**` and
  `http://localhost:3000/**`

**Site URL** is the single production address. Supabase also uses it as the
fallback when a `redirectTo` is not allowed, so it must always be the live
project — never localhost — even while developing.

**Redirect URLs** is an allow list, and it may hold several entries. The reset
form sends `redirectTo` as `<app origin>/reset-password`, so the origin you open
the app from has to be on that list: production for real users, and
`http://localhost:3000/**` for local development against the same project. When
an address is not allowed, Supabase falls back to the Site URL, and the one-time
recovery credentials land on the home page instead of the reset form — the link
then behaves like a login instead of a password reset. Allowlisting localhost
does not hand a stranger a usable session: the app uses the PKCE flow, so a
recovery code only works in the browser that requested the reset, because its
verifier cookie is scoped to the requesting origin. As a safety net,
`middleware.ts` forwards such a stray recovery link from any page to
`/reset-password` (keeping its one-time credentials), but the Redirect URLs
should still be configured so the email points at the reset form directly.

If you would rather keep the production allow list free of localhost, point local
development at its own Supabase project instead, or remove `http://localhost:3000/**`
after finishing a round of testing — with it removed, local reset links fall back
to the production Site URL and cannot be redeemed on localhost, because the PKCE
verifier cookie lives on `localhost:3000` and not on the production origin.

Email confirmation links after sign-up must be allowed by the same redirect
configuration.

For Vercel, open the project settings, then Environment Variables. Add
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` with the
corresponding Supabase values, selecting the Production, Preview, and
Development environments that the app uses. Save and redeploy so the build
receives the values. Only the URL and publishable key belong here; never add
the Supabase `service_role` key to a `NEXT_PUBLIC_` variable.

To create a production build:

```bash
npm run build
npm run start
```

## Password Reset Configuration

In Supabase Authentication → Email Templates → **Reset Password**, pick one of
the two link styles below. `/reset-password` accepts both.

1. **Default — same browser.** Keep the link as it ships:

   ```html
   <a href="{{ .ConfirmationURL }}">Reset password</a>
   ```

   The one-time code is redeemed in the browser that requested the reset, so the
   link only works in that browser.

2. **Any browser or device.** Replace the link with a token hash link:

   ```html
   <a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=recovery">Reset password</a>
   ```

   Use `&` here, not `?`: the Supabase client appends `?sb_flow_id=...` to the
   `redirectTo` URL before sending it, so `{{ .RedirectTo }}` already carries a
   query string. `{{ .RedirectTo }}` is the `<app origin>/reset-password` URL
   sent by the form, so the same template works for localhost and production.
   (The reset page also tolerates a `?` in that position, so a template written
   with `?` still resolves, but `&` is the correct separator.)

The reset page always requires a new password before the account can be used
again, and a reset link never signs the visitor in to the archive.

### Email delivery limits

The built-in Supabase SMTP service only sends a small number of auth emails per
hour (two by default), and a reset link expires after one hour by default. Both
are project-level auth settings. While testing, a rate-limited request makes the
form show the generic "couldn't send a reset link" message — wait for the limit
to reset, or configure custom SMTP before relying on the flow in production.

### Verify the reset flow locally

1. Run `npm run dev` and open `http://localhost:3000/forgot-password`.
2. Request a link for an account whose mailbox you can read.
3. Open the link. The reset form should show the new-password fields, and the
   one-time parameters should disappear from the address bar once the page has
   loaded.
4. Save a new password, then log in at `/login` with it.

If step 3 reports an invalid or expired link, either the redirect URL is not
allowed (so the credentials were sent to the Site URL) or the link has already
been used. Open the link in the same browser that requested it when the default
`{{ .ConfirmationURL }}` template is in use.

## Project Structure

```
app/                    Pages (App Router)
  page.tsx               Home
  archive/                Archive listing + [slug] detail pages
  techniques/             Visual step-by-step process page
  stories/                Elder stories listing + [slug] detail pages
  gallery/                Photo gallery with lightbox
  about/                  About the archive
components/             Reusable UI components
data/                   Collection entries, stories, gallery, and techniques
  entries.js             Lab 2/Lab 3 entry surface required by the lab
lib/                    Shared TypeScript types + central image registry
```

## Lab 1-3 Checklist

1. **Lab 1:** Run `npm run dev`, confirm the collection name on the home page,
   then import this repository into Vercel and submit the deployed URL.
2. **Lab 2:** Replace the draft objects in `data/entries.js` with at least two
   real grandmother interview entries. Each entry should include a title,
   description, image, contributor, location, and date. They render through
   `components/EntryCard.tsx`.
3. **Lab 3:** Confirm every real entry appears at `/archive`, search filters as
   you type, categories still filter correctly, and the empty state is useful.
   Commit these changes in small pieces before pushing to GitHub.

Do not submit the current draft entries as real interviews. Replace their names,
quotes, locations, dates, images, and descriptions with your collected material
before using the Vercel URL for the lab submission.

## Replacing Draft Content

- Draft text is currently stored in `data/archive.ts` and exposed through the
  required `data/entries.js` file. For the lab submission, replace the draft
  objects there with your real grandmother interview entries.
- All images are referenced through `lib/images.ts`. Replace the URLs there
  (e.g. point them to files in `/public/photos/...` once you add your own
  photography) — no component code needs to change.
- Data files are plain TypeScript objects matching the interfaces in
  `lib/types.ts`, so they can later be swapped for calls to a database or
  CMS without changing the UI.

## Notes

- Placeholder photography is served from Picsum (picsum.photos) purely as a
  stand-in. Swap in real photographs as they're collected.
- Fonts (Fraunces, Work Sans, IBM Plex Mono) load via `next/font/google` and
  require an internet connection during `npm run build` / `npm run dev`.

## Community Contributions

Any visitor can create an account and submit an entry with a photo. Every new
account starts as a `contributor`, and a submitted entry is stored as
`pending`: it is visible only to its author and the archive team until it is
reviewed. The workflow is:

| Status      | Who can see it          | What happens next                                        |
| ----------- | ----------------------- | -------------------------------------------------------- |
| `pending`   | author + archive owner  | the owner publishes it, or returns it with a note          |
| `published` | everyone                | live in `/archive`; only the archive owner can change it   |
| `returned`  | author + archive owner  | the author fixes it, saving sends it back to `pending`     |

Screens:

- `/contribute` – the submission form.
- `/my-submissions` – the author's own entries with their status, the owner's
  note for a returned entry, an edit form, and a withdraw action.
- `/admin/review` – the pending queue with an approve / return-with-note action
  (archive owner only).
- `/admin/entries` – every entry, searchable and filterable. The archive owner
  publishes, returns, features and deletes; editors may correct an entry's
  text but none of the moderation buttons are shown to them.
- `/admin/users` – account roles (admin only).

The header keeps the public links (Home, Techniques, About) and, once signed in,
Contribute an entry and My submissions in the main row. The review queue, the
entry manager and account management live in the account menu (the avatar and
e-mail button on wide screens, the "Archive team" block in the mobile drawer), so
the navigation never needs a second line.

### The archive owner (super admin)

Super admin access is granted by e-mail through the `public.super_admins` table
created in migration `0012_community_contributor_workflow.sql`. It is seeded
with `sreytimt@gmail.com`, so that account becomes `admin` at sign-up, and an
account that already signed up is promoted by the migration itself. The table
has Row Level Security enabled and no policy, so the API roles cannot read it.

Rules the database enforces, not just the UI:

- a contributor may edit or withdraw only their own `pending` or `returned`
  entries; a `published` entry is locked to them;
- `status`, `featured`, `is_sample` and the review columns belong to the archive
  owner alone (editors can edit text, never publish), and a return must carry a
  note;
- content is validated on insert **and** update, and one account may hold at
  most five `pending` submissions at a time;
- only an admin can change a profile role, and the owner account can never be
  demoted — not even by another admin.

Apply migrations `0001_schema.sql` through
`0013_remove_sample_location_markers.sql` in order to the Supabase project used
by the app (migration 0012 is idempotent, so re-running it repairs a policy set
that was edited by hand in the dashboard). Migration 0005 creates
`public.entries`, including `owner uuid not null references auth.users(id)`,
and enables contribution policies. Migrations 0006–0007 clear placeholder
attributions and harden sample/contribution data. Migration 0008 allows
anonymous reads of published entries (including the seeded example rows),
while revoking anonymous insert, update, and delete privileges.
Migration 0009 replaced editor-wide entry writes with owner-scoped insert,
update, and delete policies. Migration 0012 restores owner-only review powers
(editors keep text editing but lose delete and moderation), adds the
review-note columns, the super-admin allow list, the pending cap, and the admin
policies. Migration 0013 removes the leftover "(sample)" markers that the seeded
rows carried inside their location text and contributor stories, so a project
seeded before it stops showing them once it is applied.

### Applying migration 0012 with psql

A local `psql` is the most reliable way to apply a long script; it stops at the
first failing statement and shows the error instead of silently rolling back.

```bash
printf 'DB password: '; read -r -s PGPASSWORD; echo
PGPASSWORD="$PGPASSWORD" psql "host=db.<project-ref>.supabase.co port=5432 dbname=postgres user=postgres sslmode=require" \
  --single-transaction -v ON_ERROR_STOP=1 \
  -f supabase/migrations/0012_community_contributor_workflow.sql
```

Take the `host=` and `user=` values from the dashboard's **Connect** panel when
the direct host is not reachable (use the session pooler instead). The database
password is typed invisibly and never written to a file; the app itself only
ever uses the publishable key, so resetting that password does not affect the
deployment.

Migration 0013 is two idempotent `update` statements; run it the same way, or
paste it into the SQL editor as it is. Until it is applied, entries seeded from
`supabase/seed-entries.sql` still carry the old marker in their stored text.

`supabase/repair-profile-roles.sql` is a standalone, tiny version of the
role/profile repair that 0012 performs, for the case where an existing account
still sees "your account does not yet have contributor access" (its role is
still the original `reader`). Applying 0012 makes it unnecessary.

### Applying migration 0012 with the SQL editor

1. Open the Supabase dashboard → **SQL Editor** → **New query**.
2. Paste the whole of
   `supabase/migrations/0012_community_contributor_workflow.sql` and run it.
   It is safe to run again on the same project.
3. Check the result with:

   ```sql
   -- the owner account should now be admin
   select p.role, u.email
   from public.profiles p
   join auth.users u on u.id = p.id
   where u.email = 'sreytimt@gmail.com';

   -- pending submissions waiting for review
   select id, title, status, created_at from public.entries
   where status = 'pending'
   order by created_at;
   ```

4. Sign out and back in so the new role reaches the navigation bar.

If you ever lock yourself out, sign in as the owner and set the role back with
`update public.profiles set role = 'admin' where id = '<uuid>'`; the
owner-protection trigger only blocks changes made through the API.

### After applying 0012

`Success. No rows returned` is the expected result — the script only defines
columns, policies, triggers and functions. Then:

1. **Sign out and sign in again** on the site, so the navbar re-reads your role
   and shows the management links.
2. **The owner account must exist as an auth user.** If the address in
   `public.super_admins` has never signed up, sign up with it once: the signup
   trigger creates the profile as `admin`. If you would rather promote a
   different account you already use:

   ```sql
   insert into public.super_admins (email) values ('you@example.com')
     on conflict (email) do nothing;

   update public.profiles p
   set role = 'admin'
   from auth.users u
   where p.id = u.id and lower(u.email) = 'you@example.com';
   ```

3. **Open `/contribute`** — every signed-in account is a `contributor` now, so
   the form should appear. If it still says "your account does not yet have
   contributor access", run `supabase/repair-profile-roles.sql`.
4. Quick database check (expect `3 / 10 / 10`):

   ```sql
   select
     (select count(*) from information_schema.columns
        where table_schema = 'public' and table_name = 'entries'
          and column_name like 'review%')                     as review_columns,
     (select count(*) from pg_policies
        where schemaname = 'public' and tablename = 'entries') as entry_policies,
     (select count(*) from pg_policies
        where schemaname = 'public' and tablename = 'entries'
          and policyname like 'entries_%')                    as named_policies;
   ```

5. Prove the public boundary from outside the app: an anonymous request for
   pending rows must come back empty.

   ```bash
   curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/entries?select=slug&status=eq.pending" \
     -H "apikey: $NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
   # -> []
   ```

### Verification

```bash
npm run lint
npm test
npm run build
```

Then, with two real accounts (one contributor, one editor or the owner):

1. Submit an entry as the contributor: it appears on `/my-submissions` as
   **pending review** and is not in `/archive`.
2. Approve it in `/admin/review` (or `/admin/entries`): the entry appears in
   `/archive` for anonymous visitors, and `/my-submissions` shows **published**.
3. Return another submission with a note: the author sees the note and can
   revise it; saving puts it back into the queue as **pending**.
4. Try to edit or withdraw a published entry as the contributor: the action is
   refused, and the database returns 403 if the request is replayed by hand.

To migrate the existing archive examples, open
`supabase/seed-entries.sql`, replace each `PASTE-YOUR-UUID-HERE` with your user
UUID from Supabase Dashboard → Authentication → Users, and run the script in
the Supabase SQL Editor after the migrations. The UUID is the `owner` foreign
key on each migrated row. The eight existing examples are published, so the
public archive displays them as archive content: `is_sample` stays moderation
metadata and nothing in the interface labels an entry as a sample.
The app reads the published entries and their searchable text directly from
Supabase; it no longer falls back to `data/archive.js` for the archive listing.

`/archive` searches titles, descriptions and topic names as you type. The
category dropdown to the right of the search box filters that same list, using
the six categories the contribution form offers and only the ones the archive
actually contains. The view is shareable:
`/archive?category=Weaving%20Techniques` opens already filtered, and picking a
category keeps the address bar in step.

Row Level Security remains enabled on `public.entries`. Anonymous users can
select only published rows; the `anon` and `public` roles have no insert,
update, or delete table privileges. Authenticated contributors, editors, and
admins may insert only rows whose `owner` is their own `auth.uid()`.
Contributors may update or delete only their own `pending`/`returned` rows;
UPDATE checks ownership both before and after the change, preventing ownership
transfer. Editors may update any row (that is what reviewing means) and delete
unapproved ones; admins may update or delete any row, including published
entries. A database trigger reserves `status`, `is_sample`, `featured` and the
review columns to the archive owner, so neither a contributor nor an editor can
self-publish an entry or unmark a sample. Keep the publishable key in the client; do not expose a
service-role key or disable RLS.

Grant access only to trusted archive team members: sign in as the archive owner
and set their profile role at `/admin/users`. An `editor` can open the entry
manager and correct text; only an `admin` (the owner) can approve, return,
feature or delete.

## Sprint 2 Verification

Run the local validation suite with:

```bash
npm run lint
npm test
npm run build
```

Archive cards and entry details carry no sample labels — every published entry
reads as real archive content. Gallery examples remain excluded from the public
gallery.

To run the two-account ownership attack, set these environment variables
without putting their values in a committed file:
`SPRINT2_ACCOUNT_A_EMAIL`, `SPRINT2_ACCOUNT_A_PASSWORD`,
`SPRINT2_ACCOUNT_B_EMAIL`, and `SPRINT2_ACCOUNT_B_PASSWORD`. Account B must own
at least one non-sample entry. Then run:

```bash
npm run test:ownership
```

The script signs both accounts in through the publishable key, attempts to
update and delete B's entry as A, and verifies through B's session that the row
is unchanged. Account A should be the contributor used for the attack; use a
separate trusted editor account only when testing review/publish controls.

Live sign-up, photo upload, Khmer rendering/search, deployed image performance,
and the ownership script still need to be checked against the configured
Supabase/Vercel deployment with two real accounts.
