# Image asset structure

This folder is organized by page section so you can easily replace placeholder SVG files with real project images later.

- hero/ for homepage visuals
- categories/ for landing-page category cards
- process/ for the archive process timeline
- techniques/ for the weaving process stages
- archive/ for archive entries
- stories/ for contributor portraits
- gallery/ for gallery images
- about/ for founder/community photography

Each file is named to match the key used in `lib/images.ts`. You can replace the
draft SVG files with real `.jpg`, `.jpeg`, `.png`, or `.webp` images. Update the
extension for that image in `lib/images.ts`; component code does not need to
change.

The homepage uses existing photographs at `public/palm_leaf_houses.png`,
`public/images/palm-tree.jpeg`, and `public/about.jpg` for its hero and community
sections.

Example:

```ts
heroHouse: asset("hero", "my-real-house-photo", "jpg"),
archive1: asset("archive", "grandmother-leaf-preparation", "jpeg"),
```
