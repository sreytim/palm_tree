/**
 * Central image registry.
 *
 * Every photo in the archive is referenced through this file. Replace the
 * URL strings below with real photographs later (upload to /public/photos
 * and swap the path here) — no component code needs to change.
 *
 * Placeholder photos are served from Picsum (picsum.photos) using a fixed
 * "seed" per image so the same subject always renders the same picture.
 */

const picsum = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const images = {
  heroHouse: picsum("palm-house-hero", 1600, 2000),
  heroTexture: picsum("palm-leaves-macro", 1200, 1200),

  categorySelecting: picsum("selecting-leaves", 800, 600),
  categoryPreparing: picsum("preparing-leaves", 800, 600),
  categoryWeaving: picsum("weaving-leaves", 800, 600),
  categoryAttaching: picsum("attaching-roof", 800, 600),
  categoryMaintaining: picsum("maintaining-roof", 800, 600),
  categoryStories: picsum("elder-portrait-1", 800, 600),
  categoryHouses: picsum("traditional-house-1", 800, 600),

  processInterview: picsum("process-interview", 700, 500),
  processDocument: picsum("process-document", 700, 500),
  processPhotograph: picsum("process-photograph", 700, 500),
  processPreserve: picsum("process-preserve", 700, 500),
  processShare: picsum("process-share", 700, 500),

  step1Selecting: picsum("step-selecting", 1200, 900),
  step2Preparing: picsum("step-preparing", 1200, 900),
  step3Drying: picsum("step-drying", 1200, 900),
  step4Weaving: picsum("step-weaving", 1200, 900),
  step5Attaching: picsum("step-attaching", 1200, 900),
  step6Maintaining: picsum("step-maintaining", 1200, 900),

  archive1: picsum("archive-prep-overview", 900, 700),
  archive2: picsum("archive-weave-pattern", 900, 700),
  archive3: picsum("archive-roof-frame", 900, 700),
  archive4: picsum("archive-lashing", 900, 700),
  archive5: picsum("archive-repair", 900, 700),
  archive6: picsum("archive-house-full", 900, 700),
  archive7: picsum("archive-drying-rack", 900, 700),
  archive8: picsum("archive-tools", 900, 700),

  storyPortrait1: picsum("elder-portrait-1", 500, 600),
  storyPortrait2: picsum("elder-portrait-2", 500, 600),
  storyPortrait3: picsum("elder-portrait-3", 500, 600),
  storyPortrait4: picsum("elder-portrait-4", 500, 600),

  galleryLeaves1: picsum("gallery-leaves-1", 800, 1000),
  galleryLeaves2: picsum("gallery-leaves-2", 800, 600),
  galleryHouse1: picsum("gallery-house-1", 900, 700),
  galleryHouse2: picsum("gallery-house-2", 700, 900),
  galleryTools1: picsum("gallery-tools-1", 800, 600),
  galleryWeaving1: picsum("gallery-weaving-1", 800, 1000),
  galleryWeaving2: picsum("gallery-weaving-2", 900, 600),
  galleryPreparing1: picsum("gallery-preparing-1", 800, 600),
  galleryAttaching1: picsum("gallery-attaching-1", 900, 700),
  galleryFinished1: picsum("gallery-finished-1", 800, 1000),
  galleryFinished2: picsum("gallery-finished-2", 900, 600),
  galleryCommunity1: picsum("gallery-community-1", 800, 600),
  galleryCommunity2: picsum("gallery-community-2", 700, 900),
  galleryCommunity3: picsum("gallery-community-3", 900, 700),

  aboutFounder: picsum("about-founder", 900, 900),
  aboutCommunity: picsum("about-community", 1000, 700),
};
