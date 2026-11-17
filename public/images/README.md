# Image asset structure

This folder is organized by page section so illustration and photography files
can be swapped without touching component code.

- hero/ for homepage visuals
- categories/ for landing-page category cards
- process/ for the archive process timeline
- techniques/ for the weaving process stages
- archive/ for archive entries
- gallery/ for gallery images
- about/ for founder/community photography

Each file is named to match the key used in `lib/images.js`. You can replace an
illustration with a real `.jpg`, `.jpeg`, `.png`, or `.webp` image by updating
the extension for that key; component code does not need to change.

The homepage uses existing photographs at `public/palm_leaf_houses.png`,
`public/images/palm-tree.jpeg`, and `public/about.jpg` for its hero and community
sections.

Example (JavaScript):

```js
heroHouse: asset("hero", "my-real-house-photo", "jpg"),
archive1: asset("archive", "grandmother-leaf-preparation", "jpeg"),
```
