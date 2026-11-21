# Palm Leaf Archive

## 1. What this is

Palm Leaf Archive is a bilingual digital collection about traditional Khmer palm-leaf houses and the knowledge involved in preparing leaves, weaving panels, covering and repairing roofs, and building homes. The project is intended to preserve practical knowledge shared by community members through interviews and household visits. The repository contains eight curated entries with English and Khmer copy, plus contribution features for adding further material. The repository describes these entries as interview-based, but it does not include interview transcripts or consent records; the source and permission details should be checked against the original collection records before the archive is presented as fully documented.

## 2. Who it's for

The archive is designed for people in Cambodia who want to learn about or contribute knowledge of palm-leaf building, including Khmer-speaking readers and community members using a phone. The interface offers English and Khmer through a language switcher. Archive copy, topic names, page text, and image descriptions are paired in both languages, and the project includes a self-hosted Noto Sans Khmer font. The layouts use responsive CSS breakpoints for smaller screens. The archive loads its published entries from Supabase and shows a plain connection message when loading fails; it does not document offline use or a low-bandwidth mode.

Entry credits in the repository use labels such as “Community Elder Interview,” “Family Interview, Contributor’s Uncle,” and “Household Visit and Interview.” Locations in the curated entries include Kampong Speu Province. Gallery records also refer to Takeo and Kampong Chhnang provinces and generally credit an “Archive photograph collection.” These are the labels present in the project files, not a complete public list of named sources. The project files do not include individual permission records. The people catalogue itself notes that generic contributor labels should be replaced with real names or preferred attributions, and permission obtained, before publishing.

## 3. How it works

The application uses Next.js 16 App Router and React 19. The source is JavaScript. Vercel hosts the web application; Supabase provides authentication, PostgreSQL data, row-level security (RLS), and photo storage. The main archive browser fetches published rows from the Supabase `entries` table. Bilingual curated copy is maintained in `data/entry-content.js` and combined with database entries by the entry-content mapping code. English and Khmer interface strings live in `lang/i18n.js`.

The main account and contribution data is held in:

- `entries`: archive and community-submitted entries, including the owner UUID, text, photo URL, status, and review metadata.
- `profiles`: application role and display information linked to Supabase Auth users.
- `super_admins`: the archive-owner allow-list used when resolving administrative access.
- Supabase Storage bucket `photos`: uploaded contribution photographs.

The migration history also defines curated/reference tables for topics, categories, people, stories, techniques, and galleries, with join tables for their relationships. The current contribution and public archive workflow uses `entries`.

Entry statuses are `pending`, `published`, and `returned`:

| Status | Visibility and next step |
| --- | --- |
| `pending` | The contributor and archive team can review it; it is not returned by the public published-entry query. |
| `published` | Publicly readable and displayed in the archive. |
| `returned` | The contributor can read and edit it; the reviewer’s note explains what to change. Saving a returned entry sends it back to `pending`. |

The visitor flow is to browse or search the published archive without an account. Search and category filters are applied to the entries returned to the public browser. A contributor creates an account, submits text and a photo, and follows the entry under My Submissions. New submissions are written as `pending`. The archive owner reviews submissions in the queue and publishes or returns them. A contributor may edit their own pending, returned, or published entry; an edit to a returned or published entry goes back to pending for review.

RLS is enabled on `entries`. Anonymous visitors can select published entries only. Signed-in users can also read their own submissions, and editors/admins can read entries for their archive work. Inserts must use the authenticated user’s own UUID as `owner`. Owner update/delete policies are scoped to that owner and the allowed statuses. Editors can correct entry content, but database triggers reserve status and moderation fields for the admin. The archive admin can review, feature, and manage entries. Profile role changes are protected separately; a user cannot grant themselves an elevated role.

## 4. Security decisions

The review action currently goes through `PATCH /api/admin/contributions` in `app/api/admin/contributions/route.js`. The route checks the request origin, verifies the signed-in user and role, validates the requested transition and return note, then updates the row through the Supabase server client. The review page at `/admin/review` also checks the current role before loading pending entries. These route and page checks provide clear behavior in the application, but are not the only security boundary.

The database enforces the boundary even if a user bypasses the page or manually changes a request. RLS policies in `supabase/migrations/0012_community_contributor_workflow.sql` and later repairs scope reads and writes by role and owner. The `prevent_owner_moderation_changes` trigger blocks non-admin changes to moderation fields, while `enforce_contribution_rules` validates submissions and handles resubmission. Migration `0017_owner_revision_of_published_entries.sql` permits an owner to revise their published entry only by sending it back to `pending`. A hidden or disabled button improves the interface, but does not authorize a database write; the API and database policies/triggers do that.

The current repository does not define or call a database function named `review_entry`. The Week 11 prompt journal records an earlier intention to use `supabase.rpc('review_entry', ...)`, and says a direct table update was rejected at that time. That historical note does not match the current route, which performs a direct Supabase update after its checks. In the current implementation, authorization for that update is enforced by the API checks together with RLS and the moderation trigger. This README describes the code that is present now.

Contribution photos are uploaded to the public `photos` bucket and stored by public URL. The contribution form warns that a photo’s URL can be accessed while its entry is still under review. A pending entry is hidden from the public archive query, but the photo URL itself should not be treated as private.

The repository includes automated test files and an ownership-attack script, but this README does not claim they were run for this submission. A clean repository scan and live role-by-role checks are still required before claiming that there are no secrets in history or that the deployed gate works end to end.

## 5. AI use

I used AI as a coding and review assistant during the project, while making decisions about what to keep, change, test, or reject. My process logs record Cline in VS Code with OpenRouter, Gemini 2.5 Flash, Gemini 3.5 Flash-Lite, `openai/gpt-5.1-codex`, `openrouter/free`, and DeepSeek Flash Latest (`~deepseek/deepseek-flash-latest`), as well as ChatGPT. The notes do not consistently map every model to every code change, so this list is a record of models and tools noted during the work, not a complete per-commit attribution.

I used Cline to help set up the archive pages and navigation, develop browse/search and bilingual empty-state copy, integrate Supabase authentication and data, and work through ownership and review controls. I edited suggested topics and descriptions, revised Khmer wording, and used smaller follow-up prompts when a change did not work as expected. I reviewed code and database policies instead of treating generated code as correct by default.

One mistake I caught was an AI suggestion to use the outdated `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable name. I corrected the configuration to the project’s publishable-key variable and reviewed the change so a secret key would not be exposed in the frontend. In the review-queue work, my prompt journal records that Cline initially proposed a direct table update where I expected a `review_entry` RPC; I rejected that suggestion then. The current repository has no such RPC and now implements review through the API route and database protections described above. This difference between my process notes and the code is a reminder to check both the proposed approach and the final implementation.

My logs also describe difficulty understanding generated database changes, changes that caused regressions elsewhere, and the need to test role boundaries rather than assume they work. I used follow-up prompts, code review, and manual checks to decide what to keep. The repository contains tests for several workflows, but the existence of those tests alone does not establish that they passed during final review.

## 6. Sources and credits

The repository’s eight curated entries are about palm-leaf preparation, cross-weaving, roof-frame construction, tying panels, seasonal roof repair, a family house in Kampong Speu, drying panels, and traditional thatching tools. Their contributor fields currently use generalized labels such as “Community Elder Interview.” Related gallery items credit an “Archive photograph collection” and identify locations including Kampong Speu, Takeo, and Kampong Chhnang. `data/entry-content.js`, `data/archive.js`, `data/people.js`, and `data/gallery.js` hold the current entry text, contributor labels, locations, and photo credits.

The project’s About page describes the material as coming from direct conversations, household visits, and photographs taken with permission. However, the repository does not include interview records, the identities or preferred attributions of the people behind the generalized labels, or individual permission records. The code comment in `data/people.js` explicitly says those labels need replacement and permission before publishing. Confirm the source details and permissions against the original records before treating the collection as fully credited and consented. Do not infer consent from a credit label or from the About page copy alone.

## 7. Running it locally

Requirements: Node.js and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set the Supabase project values in your local, ignored environment file. The application needs:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

   Do not put a Supabase `service_role` key in the browser environment or commit credentials. Configure the same variable names in Vercel and redeploy after changing production values.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`. The project’s production URL is [https://palm-tree-gilt.vercel.app](https://palm-tree-gilt.vercel.app).

Useful project commands are `npm run lint`, `npm test`, `npm run build`, and `npm run start`. The optional `npm run test:ownership` script additionally requires `SPRINT2_ACCOUNT_A_EMAIL`, `SPRINT2_ACCOUNT_A_PASSWORD`, `SPRINT2_ACCOUNT_B_EMAIL`, and `SPRINT2_ACCOUNT_B_PASSWORD`; use test accounts and keep these values outside committed files.

## 8. Submission checklist

- **End-to-end visitor, contributor, stranger, and reviewer paths — implementation present.** Public archive: `app/(main)/archive/` and `components/archive/`. Contributions: `app/api/contributions/route.js` and `app/(main)/contribute/`. Review: `app/api/admin/contributions/route.js` and `app/(main)/admin/review/`. Verify all four paths on the live URL before submission.
- **Review gate, published-only access, ownership, and repository secrets — database protections present; final verification required.** See the RLS and trigger migrations, especially `0012_community_contributor_workflow.sql` and `0017_owner_revision_of_published_entries.sql`. Run the role-based live checks and inspect Git history for secrets; this README does not claim those final checks passed.
- **Real, credited collection with Khmer first-class — Khmer implementation present; source/permission verification required.** Bilingual copy and interface are in `data/entry-content.js`, `lang/i18n.js`, and `data/`; current generalized credits are listed in `data/people.js`. Confirm the underlying source records and permissions before asserting the collection is fully sourced and consented.
- **Accurate README — documented here.** This file describes the current repository and identifies items that need live or source-record verification.
- **Four-question reflection — separate Canvas submission.** The reflection is not included in this repository; answer the four questions in the Canvas text box.
- **Finished experience — implementation evidence present; live inspection required.** Loading, error, and empty states are handled in `components/archive/EntriesBrowser.js`; responsive layout rules are in `app/globals.css`. Check the live app on a phone, confirm no test entries are visible, and inspect the browser console on the main pages.

The final submission also requires the live URL and repository, a demo video of five minutes or less, a booked Q&A slot, and the Show Your Archive post with the video link. Test the video link in a private browser window and complete the Canvas submission steps before the deadline.
