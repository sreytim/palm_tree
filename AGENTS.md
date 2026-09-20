<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Sprint 2 amendment (added week 5)

Two dependencies are approved for Sprint 2, and only these two:
- @supabase/supabase-js
- @supabase/ssr

Everything else in the hard rules stands, especially rule 3:
no keys, tokens, or passwords in any committed file, ever.
Auth configuration lives in .env.local and in Vercel
environment variables.
