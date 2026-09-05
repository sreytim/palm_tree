/**
 * Lab 3 entry collection.
 *
 * Replace the draft objects in archive.ts with real grandmother interviews,
 * or move those objects into this file as the collection grows. This named
 * export is the one used by the browse page and EntryCard.
 */
export {
  archiveItems as entries,
  getArchiveItemBySlug,
  getFeaturedArchiveItems,
  getRelatedArchiveItems,
} from "./archive";
