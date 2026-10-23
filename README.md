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

Then open http://localhost:3000 in your browser.

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

In Supabase Authentication → URL Configuration, set the Site URL to your
deployed app URL and add the local and deployed app URLs to Redirect URLs, for
example `http://localhost:3000/**` and `https://your-domain.example/**`. Email
confirmation links after sign-up must be allowed by this redirect configuration.

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

Community members sign in, submit an entry and photo, and the entry is saved as
a draft. Editors and admins can review drafts at `/admin/review`, preview the
entry, then publish it to the public archive or archive it without publishing.
The review page is part of the same site; it is not a separate admin portal.

Apply migrations `0001_schema.sql` through `0009_owner_entry_write_policies.sql`
in order to the Supabase project used by the app. Migration 0005 creates
`public.entries`, including `owner uuid not null references auth.users(id)`,
and enables contribution policies. Migrations 0006–0007 clear placeholder
attributions and harden sample/contribution data. Migration 0008 allows
anonymous reads of published entries (including explicitly labeled sample
entries), while revoking anonymous insert, update, and delete privileges.
Migration 0009 replaces editor-wide entry writes with owner-scoped insert,
update, and delete policies.

To migrate the existing archive examples, open
`supabase/seed-entries.sql`, replace each `PASTE-YOUR-UUID-HERE` with your user
UUID from Supabase Dashboard → Authentication → Users, and run the script in
the Supabase SQL Editor after the migrations. The UUID is the `owner` foreign
key on each migrated row. The eight existing examples remain marked as samples
and published, so the public archive can display them with their sample labels.
The app reads the published entries and their searchable text directly from
Supabase; it no longer falls back to `data/archive.js` for the archive listing.

Row Level Security remains enabled on `public.entries`. Anonymous users can
select only published rows; the `anon` and `public` roles have no insert,
update, or delete table privileges. Authenticated contributors, editors, and
admins may insert only rows whose `owner` is their own `auth.uid()`. Owners may
update or delete only rows whose owner remains their own `auth.uid()`; UPDATE
checks ownership both before and after the change, preventing ownership
transfer. A database trigger reserves `status`, `is_sample`, and `featured`
changes to editors so owners cannot self-publish a draft or unmark a sample.
Editors cannot bypass ownership for writes. Keep the publishable key in the
client; do not expose a service-role key or disable RLS.

Grant editorial access only to trusted archive team members by setting their
profile role to `editor` (or `admin`) through the Supabase dashboard. These roles
can review submissions; public visitors and ordinary contributors cannot.

## Sprint 2 Verification

Run the local validation suite with:

```bash
npm run lint
npm test
npm run build
```

Archive cards and details label the seeded examples as samples. Gallery
examples remain excluded from the public gallery.

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
