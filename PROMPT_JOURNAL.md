# Sprint 3 - Prompt Journal

This file documents the AI-assisted development process for Sprint 3 of the
Palm Leaf Archive project. Each entry records the date, AI used, prompt, and outcome.

---

## Entry 1 - Nov 10, 2026

**Goal:** Set up admin reviewer account with personal email

**AI Used:** Claude (Anthropic)

**Prompt:** *"I need to promote my personal email (sreytimt@gmail.com) to admin role in my Palm Leaf Archive project. The project uses Supabase with a profiles table that has a 'role' column. I need an SQL command to update this role to 'admin' for my user. I also need to verify the role was set correctly."*

**Outcome:** Provided SQL UPDATE command via Supabase SQL Editor to set `role = 'admin'` for the specified email. Verified the role system (`is_editor()`, `is_admin()`) uses the profiles table, so updating this row is sufficient to grant review permissions.

---

## Entry 2 - Nov 10, 2026

**Goal:** Create Sprint 3 database migration from draft/published/archived to pending/published/returned

**AI Used:** Claude (Anthropic)

**Prompt:** *"I need to migrate my Palm Leaf Archive database from using statuses 'draft', 'published', 'archived' to 'pending', 'published', 'returned'. The migration should: 1) Update the status constraint on the entries table, 2) Migrate existing data (draft -> pending, archived -> returned), 3) Update the public read policy to only show published entries, and 4) Ensure the contribution trigger forces status to 'pending' for new entries."*

**Outcome:** Created migration file `0010_sprint3_status_migration.sql`. The AI generated the complete SQL with constraint update, data migration, RLS policy update, and trigger function replacement. First attempt failed with error: `topic_count is not a known variable` — the `declare` section was missing. Fixed by adding `declare step_item jsonb; tip_item jsonb; topic_count integer;` at the top of the function. This demonstrates the importance of manual verification even with AI assistance.

---

## Entry 3 - Nov 10, 2026

**Goal:** Update Review API, Queue UI, and contributor-facing text to use new status values

**AI Used:** Claude (Anthropic)

**Prompt:** *"I need to update my Next.js application to use the new status workflow (pending/published/returned instead of draft/published/archived). Specifically: 1) Update the Review API at app/api/admin/contributions/route.js to accept 'returned' instead of 'archived', 2) Update ReviewQueue.js component to use 'returned' action and returnSubmission translation key, 3) Update the contributions API to set status to 'pending' instead of 'draft', 4) Update the archive detail page to check for 'pending' status and use pendingReviewNotice translation, 5) Add returnSubmission translation key and update reviewSubmissionsHint text."*

**Outcome:** All 4 updated files were committed successfully. Lint passed. Changed all references from 'draft'/'archived' consistently to 'pending'/'returned' across the codebase. Updated 3 translation keys in both English and Khmer (en + km) to be consistent with the new workflow terminology.

---

## Next Steps

- [ ] Run migration in Supabase SQL Editor
- [ ] Set personal email as admin (via SQL UPDATE)
- [ ] Test with two accounts (contributor + reviewer)
- [ ] Push to GitHub and deploy to Vercel
- [ ] Complete reflection on Sprint 3 changes
