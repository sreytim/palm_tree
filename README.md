# Traditional Palm-Leaf House Covering Techniques

A digital cultural archive preserving traditional knowledge about using palm
leaves to cover houses, built with Next.js (App Router), TypeScript, and
Tailwind CSS.

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
data/                   Sample content (archive entries, stories, gallery, techniques)
lib/                    Shared TypeScript types + central image registry
```

## Replacing Sample Content

- All sample text is clearly labeled "Sample Archive Entry" / "sample name"
  and can be edited directly in the files under `data/`.
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
