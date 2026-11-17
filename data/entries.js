/**
 * Lab 3 entry collection.
 *
 * Named exports used by the browse page and EntryCard. The catalogue itself
 * lives in `archive.js`; this file is the stable entry point older lab pages
 * import, so it re-exports the same records and lookups.
 */
export {
  archiveItems as entries,
  getArchiveItemBySlug,
  getFeaturedArchiveItems,
  getRelatedArchiveItems,
} from "./archive";
