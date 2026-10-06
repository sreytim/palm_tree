/**
 * Relationship layer.
 *
 * The archive, technique and gallery datasets were written independently
 * and shared no keys, so nothing could be connected. Each record now carries
 * arrays of relations and this module resolves them in both directions.
 *
 * Field-naming convention, so a field name always says what it holds:
 *   `...Ids`   holds a record's `id`    (entryIds, galleryIds,
 *                                        techniqueStepIds, personId)
 *   `...Slugs` holds a record's `slug`  (topicSlugs, primaryTopicSlug)
 * Resolvers follow the same rule: entry/gallery/step resolvers take an
 * `id`, topic resolvers take a `slug`.
 *
 * `assertRelations()` is the safety net for hand-maintained arrays: it throws
 * with a list of every dangling reference instead of silently rendering an
 * empty section. Run it after editing any data file.
 */
import { archiveItems } from "@/data/archive";
import { galleryImages } from "@/data/gallery";
import { techniqueSteps } from "@/data/techniques";
import { topics } from "@/data/topics";
import { people } from "@/data/people";

const bySlug = (list, slug) => list.find((item) => item.slug === slug);
const byId = (list, id) => list.find((item) => item.id === id);

/* ---------------------------------------------------------------- topics */

export function getTopicBySlug(slug) {
  return bySlug(topics, slug);
}

export function getPrimaryTopicForEntry(entryId) {
  const entry = byId(archiveItems, entryId);
  if (!entry) return undefined;
  return getTopicBySlug(entry.primaryTopicSlug);
}

/** All topics an entry belongs to, in the order declared on the entry. */
export function getTopicsForEntry(entryId) {
  const entry = byId(archiveItems, entryId);
  if (!entry) return [];
  return (entry.topicSlugs ?? [])
    .map((slug) => getTopicBySlug(slug))
    .filter(Boolean);
}

export function getEntriesForTopic(topicSlug) {
  return archiveItems.filter((entry) =>
    (entry.topicSlugs ?? []).includes(topicSlug),
  );
}

/* -------------------------------------------------- archive <-> techniques */

export function getTechniqueStepsForEntry(entryId) {
  const entry = byId(archiveItems, entryId);
  if (!entry) return [];
  return (entry.techniqueStepIds ?? [])
    .map((id) => byId(techniqueSteps, id))
    .filter(Boolean);
}

export function getEntriesForTechniqueStep(stepId) {
  return archiveItems.filter((entry) =>
    (entry.techniqueStepIds ?? []).includes(stepId),
  );
}

/** Technique steps in the order a frond actually travels through them. */
export function getOrderedTechniqueSteps() {
  return [...techniqueSteps].sort((a, b) => a.position - b.position);
}

/* --------------------------------------------------- archive <-> gallery */

export function getGalleryForEntry(entryId) {
  const entry = byId(archiveItems, entryId);
  if (!entry) return [];
  return (entry.galleryIds ?? [])
    .map((id) => byId(galleryImages, id))
    .filter(Boolean);
}

export function getEntriesForGalleryImage(imageId) {
  const image = byId(galleryImages, imageId);
  if (!image) return [];
  return (image.entryIds ?? [])
    .map((id) => byId(archiveItems, id))
    .filter(Boolean);
}

/* ----------------------------------------------- techniques <-> gallery */

export function getGalleryForTechniqueStep(stepId) {
  const step = byId(techniqueSteps, stepId);
  if (!step) return [];
  return (step.galleryIds ?? [])
    .map((id) => byId(galleryImages, id))
    .filter(Boolean);
}

export function getTechniqueStepsForGalleryImage(imageId) {
  const image = byId(galleryImages, imageId);
  if (!image) return [];
  return (image.techniqueStepIds ?? [])
    .map((id) => byId(techniqueSteps, id))
    .filter(Boolean);
}

/* ----------------------------------------------------------------- people */

export function getPersonById(id) {
  return byId(people, id);
}

export function getEntriesForPerson(personId) {
  return archiveItems.filter((entry) => entry.personId === personId);
}

export function getGalleryForPerson(personId) {
  return galleryImages.filter((image) => image.personId === personId);
}

/* ------------------------------------------------------------- validation */

const pools = {
  entry: new Set(archiveItems.map((entry) => entry.id)),
  gallery: new Set(galleryImages.map((image) => image.id)),
  step: new Set(techniqueSteps.map((step) => step.id)),
  topic: new Set(topics.map((topic) => topic.slug)),
  person: new Set(people.map((person) => person.id)),
};

/**
 * Throws on any dangling id, so a typo in a hand-written `galleryIds: ["gal-99"]`
 * fails loudly instead of silently rendering an empty section.
 *
 * Call it from any module while developing:
 *   import { assertRelations } from "@/lib/relations";
 *   assertRelations();
 */
export function assertRelations() {
  const broken = [];

  const check = (values, owner, pool, label) => {
    (values ?? []).forEach((value) => {
      if (!pools[pool].has(value)) {
        broken.push(`${owner}: ${label} references missing ${pool} "${value}"`);
      }
    });
  };

  archiveItems.forEach((entry) => {
    const owner = `entry ${entry.slug}`;
    check(entry.topicSlugs, owner, "topic", "topicSlugs");
    check(entry.techniqueStepIds, owner, "step", "techniqueStepIds");
    check(entry.galleryIds, owner, "gallery", "galleryIds");
    check(entry.personId ? [entry.personId] : [], owner, "person", "personId");
    check(
      entry.primaryTopicSlug ? [entry.primaryTopicSlug] : [],
      owner,
      "topic",
      "primaryTopicSlug",
    );
  });

  techniqueSteps.forEach((step) => {
    const owner = `technique step ${step.id}`;
    check(step.topicSlugs, owner, "topic", "topicSlugs");
    check(step.entryIds, owner, "entry", "entryIds");
    check(step.galleryIds, owner, "gallery", "galleryIds");
    check(
      step.tipSourceEntryId ? [step.tipSourceEntryId] : [],
      owner,
      "entry",
      "tipSourceEntryId",
    );
  });

  galleryImages.forEach((image) => {
    const owner = `gallery image ${image.id}`;
    check(
      image.topicSlug ? [image.topicSlug] : [],
      owner,
      "topic",
      "topicSlug",
    );
    check(image.entryIds, owner, "entry", "entryIds");
    check(image.techniqueStepIds, owner, "step", "techniqueStepIds");
    check(image.personId ? [image.personId] : [], owner, "person", "personId");
  });

  if (broken.length > 0) {
    throw new Error(
      `Broken relations (${broken.length}):\n  ${broken.join("\n  ")}`,
    );
  }

  return {
    entries: archiveItems.length,
    techniqueSteps: techniqueSteps.length,
    galleryImages: galleryImages.length,
    topics: topics.length,
    people: people.length,
  };
}