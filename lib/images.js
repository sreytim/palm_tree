/**
 * Central image registry.
 *
 * Maintains a single source of truth for all images in the app so real media
 * can replace the placeholders without changing component code.
 *
 * Recommended structure:
 * public/images/
 *   hero/
 *   categories/
 *   process/
 *   techniques/
 *   archive/
 *   gallery/
 *   about/
 *
 * Repaired references: five keys used to point at files that are not in
 * `public/` (`/palm_leaf1.jpg`, `/palm_leaf3.jpg`, `/covering.jpeg`,
 * `/maintain.jpg`, `/palm_house1.jpg`), so those slots rendered as broken
 * images. They now point at the existing photograph whose name describes the
 * same subject, which also keeps the original sharing relationships intact —
 * the three keys that used to share `/palm_house1.jpg` still share one file.
 *
 * `/palm_leaf2.jpg` exists in `public/` but is referenced by nothing. Decide
 * whether it should take one of the slots above, or be removed.
 */
import logoAsset from "@/public/logo.png";

const asset = (folder, filename, extension = "svg") =>
  `/images/${folder}/${filename}.${extension}`;
export const images = {
  /**
   * Statically imported on purpose. A plain "/logo.png" string keeps the same
   * `/_next/image?url=%2Flogo.png&w=...` URL when the artwork is replaced, and
   * the optimiser caches by URL for `minimumCacheTTL` (4 hours) with no way to
   * invalidate — so the old bitmap keeps being served. A static import emits
   * `/_next/static/media/logo.<contenthash>.png`, so new bytes mean a new URL.
   * `width`/`height` are supplied by the import; no need to pass them.
   */
  logo: logoAsset,
  heroHouse: "/palm_leaf_houses.png",
  heroTexture: "/images/palm-tree.jpeg",
  categorySelecting: asset("categories", "selecting"),
  categoryPreparing: asset("categories", "preparing"),
  categoryWeaving: asset("categories", "weaving"),
  categoryAttaching: asset("categories", "attaching"),
  categoryMaintaining: asset("categories", "maintaining"),
  categoryHouses: asset("categories", "houses"),
  processInterview: asset("process", "interview"),
  processDocument: asset("process", "document"),
  processPhotograph: asset("process", "photograph"),
  processPreserve: asset("process", "preserve"),
  processShare: asset("process", "share"),
  step1Selecting: asset("techniques", "step-1-selecting", "jpeg"),
  step2Preparing: asset("techniques", "step-2-preparing", "jpeg"),
  step3Drying: asset("techniques", "step-3-drying", "jpg"),
  step4Weaving: asset("techniques", "step-4-weaving", "jpg"),
  step5Attaching: asset("techniques", "step-5-attaching", "jpg"),
  step6Maintaining: asset("techniques", "step-6-maintaining", "jpg"),
  archive1: asset("archive", "archive-1"),
  archive2: asset("archive", "archive-2"),
  archive3: asset("archive", "archive-3"),
  archive4: asset("archive", "archive-4"),
  archive5: asset("archive", "archive-5"),
  archive6: asset("archive", "archive-6"),
  archive7: asset("archive", "archive-7"),
  archive8: asset("archive", "archive-8"),
  galleryLeaves1: asset("gallery", "leaves-1"),
  galleryLeaves2: asset("gallery", "leaves-2"),
  galleryHouse1: asset("gallery", "house-1"),
  galleryHouse2: asset("gallery", "house-2"),
  galleryTools1: asset("gallery", "tools-1"),
  galleryWeaving1: asset("gallery", "weaving-1"),
  galleryWeaving2: asset("gallery", "weaving-2"),
  galleryPreparing1: asset("gallery", "preparing-1"),
  galleryAttaching1: asset("gallery", "attaching-1"),
  galleryFinished1: asset("gallery", "finished-1"),
  galleryFinished2: asset("gallery", "finished-2"),
  galleryCommunity1: asset("gallery", "community-1"),
  galleryCommunity2: asset("gallery", "community-2"),
  galleryCommunity3: asset("gallery", "community-3"),
  aboutFounder: "/about.jpg",
  aboutCommunity: "/about.jpg",
};
