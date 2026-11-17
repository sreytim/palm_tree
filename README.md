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

A history scan (`git log -p`) shows that only `.env.example` is tracked, with
empty values; no service key, database URL or password has ever been committed.
If a secret ever does reach a commit, rotate it first and rewrite the history
before pushing again — deleting it in a later commit does not remove it.

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
`proxy.ts` forwards such a stray recovery link from any page to
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
  (main)/page.js         Home
  (main)/archive/        Archive listing + [slug] detail pages
  (main)/techniques/     Visual step-by-step process page
  (main)/gallery/        Photo gallery with lightbox
  (main)/about/          About the archive
  (auth)/                Sign up, log in, password reset
  api/                   Contribution, edit and admin endpoints
components/             Reusable UI components
  archive/               Cards, search, filters, pagination
  gallery/               Lightbox gallery
  contribute/            Contribution form and submission editor
  admin/                 Review queue, entry manager, account roles
data/                   Bilingual content catalogue and relations
  entry-content.js       English/Khmer copy for every archive entry
  archive.js             Entries: identity, photograph, relations
  topics.js              Topic vocabulary (bilingual names)
  techniques.js          Six technique stages (bilingual copy)
  gallery.js             Photographs (bilingual captions)
  people.js              Contributor and attribution records
  entries.js             Stable entry exports used by older lab pages
lang/i18n.js            Interface translations + localizeLabel()
lib/                    Data access, validation and helper modules
supabase/               Schema, row-level security, storage and seed SQL
tests/                  Node test runner suites (`npm test`)
```

## Lab 1-3 Checklist

1. **Lab 1:** Run `npm run dev`, confirm the collection name on the home page,
   then import this repository into Vercel and submit the deployed URL.
2. **Lab 2:** The archive content lives in `data/entry-content.js` (bilingual
   copy) and `data/archive.js` (identity, photograph, relations). Each entry
   carries a title, description, image, contributor credit, location and date,
   and renders through `components/archive/EntryCard.js`.
3. **Lab 3:** Confirm the entries appear at `/archive`, search filters as you
   type in English and Khmer, categories still filter correctly, and the empty
   state is useful. Commit these changes in small pieces before pushing.

The eight curated entries are the archive's shipped catalogue. Replace their
copy, credits, locations and photographs with your collected interview material
before submitting them as first-hand documentation.

## Replacing the Curated Content

- Copy lives in `data/entry-content.js` as `{ en, km }` pairs.
- Identity and relations live in `data/archive.js`; gallery captions in
  `data/gallery.js`; people and attribution records in `data/people.js`.
- Images are referenced through `lib/images.js`. Point a key at a file in
  `public/` and every component picks it up; no component code changes.
- The same data is stored in Supabase for the live archive. The SQL companion
  files are `supabase/seed-entries.sql` (fresh project) and
  `supabase/migrations/0014_archive_content_refresh.sql` (existing rows).


## Bilingual content (English / Khmer)

Every page renders in English or Khmer, chosen with the language switcher in
the header. Three rules keep a Khmer page from slipping back into English:

1. **Interface text** lives in `lang/i18n.js` under `translations.en` and
   `translations.km`. Components read it with `t("someKey")`; a missing key
   shows the key itself, which is obvious in review.
2. **Archive copy** (titles, introductions, steps, tips, contributor stories,
   gallery captions, topic names) lives in `data/entry-content.js`,
   `data/gallery.js` and `data/topics.js` as `{ en, km }` pairs. Both languages
   travel together, so a field can never be half-translated.
3. **`localizeLabel(value, language)`** resolves all of the above: a bilingual
   object, a dictionary label, or a plain string. It falls back to the other
   language rather than rendering `undefined`.

### Adding or editing an archive entry

- Edit the copy in `data/entry-content.js`. Each entry is a keyed block with
  `title`, `description`, `imageAlt`, `location`, `introduction`, `steps`,
  `tips` and `contributorStory`, each holding `en` and `km`.
- `data/archive.js` pairs that copy with the entry's identity, photograph and
  relations (topic slugs, technique steps, gallery photographs, contributor).
- `tests/archive-content.test.js` fails if any field is missing a language, or
  if Khmer copy still contains English words.

### How the database and the catalogue meet

The `entries` table keeps one text column per field, written in the language the
contributor used. `lib/entry-content.js` pairs that text with the Khmer copy
from `data/entry-content.js` by slug:

- a database row with the same number of steps and tips as the catalogue keeps
  its own English and gains the catalogue's Khmer;
- a row whose structure no longer matches falls back to the curated pair, so a
  Khmer reader is never shown the wrong sentence beside a step;
- a submission the archive has not translated yet passes through untouched, and
  the detail page says in Khmer that the entry has not been translated yet.

`supabase/migrations/0014_archive_content_refresh.sql` brings the database's
English text in line with the catalogue. It matches rows by `slug`, updates only
text columns, and is safe to run more than once:

```bash
# Dashboard -> SQL editor: paste and run the file, or with psql:
psql "$SUPABASE_DB_URL" -f supabase/migrations/0014_archive_content_refresh.sql
```

After that, both languages in the database and in the app describe exactly the
same practice. Without it, Khmer pages are still complete — the Khmer copy comes
from the catalogue — but an English page keeps whatever English wording the
database already holds.

## Notes

- Photography and illustrations are served from `public/` (SVG illustrations
  for the archive cards and gallery, photographs for the technique stages).
  New photographs can replace a file without changing component code; the
  image registry is `lib/images.js`.
- Fonts are **self-hosted** from `public/fonts/` (Fraunces, Work Sans, IBM Plex
  Mono, Noto Sans Khmer — all SIL Open Font License 1.1) and declared with
  `@font-face` in `app/globals.css`. Nothing is fetched from Google at build or
  run time, so `npm run dev` and `npm run build` work offline; the CSS stacks
  name system fonts as fallbacks in case a file is ever removed.
- `proxy.ts` is Next.js 16's name for middleware. It refreshes the Supabase auth
  session before each request and redirects stray password-recovery links.

## Community Contributions

Any visitor can create an account and submit an entry with a photo. Every new
account starts as a `contributor`, and a submitted entry is stored as
`pending`: it is visible only to its author and the archive team until it is
reviewed. The workflow is:

| Status      | Who can see it          | What happens next                                        |
| ----------- | ----------------------- | -------------------------------------------------------- |
| `pending`   | author + archive owner  | the owner publishes it, or returns it with a note          |
| `published` | everyone                | live in `/archive`; an author's edit sends it back to `pending` |
| `returned`  | author + archive owner  | the author fixes it, saving sends it back to `pending`     |

Only the author's own edit resubmits a published entry. When an editor or admin
corrects a published entry in `/admin/entries`, it stays published.

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

- a contributor may edit their own `pending`, `returned` or `published` entries
  (saving a returned or published one puts it back in the review queue) and may
  withdraw only the unapproved ones;
- `status`, `featured`, `is_sample` and the review columns belong to the archive
  owner alone (editors can edit text, never publish), and a return must carry a
  note;
- content is validated on insert **and** update, and one account may hold at
  most five `pending` submissions at a time;
- only an admin can change a profile role, and the owner account can never be
  demoted — not even by another admin.

### The admin menu or review queue is missing

The app decides who may review from `public.current_profile_role()`, which
returns the role of the signed-in account. The owner is the e-mail in
`public.super_admins`; the function answers `admin` for it even when the
`profiles.role` column is out of date, and Row Level Security calls the same
function, so the UI and the data cannot disagree.

If an owner account signs in without the "Archive team" menu, or `/admin/review`
says "Admin access required" and shows a role other than *admin*:

1. Run `supabase/migrations/0015_admin_access_repair.sql` in the Supabase SQL
   editor. It is idempotent: it re-adds the allow list, recreates the sign-up
   trigger, creates any missing profile row, promotes the owner to `admin`, and
   makes `current_profile_role()` honour the allow list.
2. The last statement prints every account with its role, whether it is
   allow-listed, and how many submissions are pending — that output is the
   verification.
3. Reload the app and sign in again.

An empty queue with a correct `admin` role means there are no `pending` rows in
this project: a submission made against a different Supabase project (for
example a deployed site with other environment variables) will not appear here.

Apply migrations `0001_schema.sql` through
`0019_tools_is_an_archive_topic.sql` in order to the Supabase project used
by the app (migrations 0012, 0015, 0016, 0017, 0018 and 0019 are idempotent, so re-running them repairs a
policy set or a role that was edited by hand in the dashboard). Migration 0005
creates `public.entries`, including `owner uuid not null references auth.users(id)`,
and enables contribution policies. Migrations 0006–0007 clear draft
attributions and harden sample/contribution data. Migration 0008 allows
anonymous reads of published entries (including the seeded example rows),
while revoking anonymous insert, update, and delete privileges.
Migration 0009 replaced editor-wide entry writes with owner-scoped insert,
update, and delete policies. Migration 0012 restores owner-only review powers
(editors keep text editing but lose delete and moderation), adds the
review-note columns, the super-admin allow list, the pending cap, and the admin
policies. Migration 0013 removes the leftover "(sample)" markers that the seeded
rows carried inside their location text and contributor stories, so a project
seeded before it stops showing them once it is applied. The display layer also
strips that marker from the eight curated entries, so a deployment that has not
run 0013 yet never shows a test label; the migration remains the permanent fix. Migration 0016 repairs
the guard that stopped an author from saving a returned entry: the resubmission
trigger clears the old review note before the guard runs, so the guard now
accepts that one transition (and only when the review columns end up empty).
Migration 0017 lets an author revise a published entry (saving returns it to
`pending`) while a reviewer's edit keeps it published, and refuses an
author-supplied status change. Migration 0018 fills the contributor credit on
the eight curated rows that were seeded blank. Migration 0019 promotes the
"tools" topic to the archive scope, so the Tools entry can be edited or
re-tagged like every other archive entry.

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
4. Edit the published entry as its author: it leaves `/archive` and returns to
   **pending** until it is approved again. Withdrawing it is refused. Replaying
   a "publish" request from the browser console fails with SQLSTATE 42501.

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
Contributors may update their own `pending`/`returned`/`published` rows (the
trigger turns a published save into `pending`) and delete only `pending` or
`returned` rows; UPDATE checks ownership both before and after the change,
preventing ownership transfer. Editors may update any row (that is what
reviewing means) and delete unapproved ones; admins may update or delete any
row, including published entries. A database trigger reserves `status`,
`is_sample`, `featured` and the review columns to the archive owner, so neither a
contributor nor an editor can self-publish an entry or change a moderation flag.
Keep the publishable key in the client; do not expose a service-role key or
disable RLS.

A direct REST update against a row the caller cannot see returns zero rows and
no error — that is how Supabase applies Row Level Security, not a gap in the
policies. The app's own API never does that silently: it answers 404 or 403 with
a plain message, and `npm run test:ownership` proves the target row is unchanged.

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
reads as real archive content, and gallery photographs credit the archive's
photograph collection and the province they document.

To run the two-account ownership attack, set these environment variables
without putting their values in a committed file:
`SPRINT2_ACCOUNT_A_EMAIL`, `SPRINT2_ACCOUNT_A_PASSWORD`,
`SPRINT2_ACCOUNT_B_EMAIL`, and `SPRINT2_ACCOUNT_B_PASSWORD`. Account B must own
at least one entry. Then run:

```bash
npm run test:ownership
```

The script signs both accounts in through the publishable key, attempts to
update and delete B's entry as A, and verifies through B's session that the row
is unchanged. Account A should be the contributor used for the attack; use a
separate trusted editor account only when testing review/publish controls.

Before submitting the deployed archive, run the Lab 13 review on the live URL
with two real accounts: sign-up and photo upload, English/Khmer search, a
returned-entry revision, a published-entry revision that returns to pending,
the console publish/ownership attempts, and `npm run test:ownership`.
