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
