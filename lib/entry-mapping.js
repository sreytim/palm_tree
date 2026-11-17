/**
 * Entry row mapping (Lab 6, Part 3).
 *
 * Pure functions only — no Supabase client, no React — so the mapping can be
 * exercised on its own. `lib/entries.js` pairs it with the database call.
 *
 * Column names in the `entries` table differ from the field names the UI and
 * `data/archive.js` use (image_path vs image, entry_date vs date, …), so this
 * is the single place that translation happens.
 */
import { stripLegacySampleMarker, normalizeLegacyEntryDate } from "./legacy-text.js";

export const COLUMNS = [
  "id",
  "slug",
  "title",
  "description",
  "category",
  "topic_slugs",
  "contributor",
  "location",
  "entry_date",
  "image_path",
  "image_alt",
  "introduction",
  "steps",
  "tips",
  "contributor_story",
  "featured",
  "is_sample",
  "status",
].join(", ");

/**
 * A database row rendered as the entry shape the components expect.
 *
 * `topic_slugs` feeds two things: the topic chip on each card (via the first
 * slug, which is the entry's headline topic) and the search index, which
 * matches topic names as well as titles and descriptions. Without it, the
 * empty-state suggestion chips such as "Roof Covering" would find nothing.
 */
export function toUiEntry(row) {
  const topicSlugs = Array.isArray(row.topic_slugs) ? row.topic_slugs : [];

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    contributor: row.contributor,
    location: row.location,
    date: row.entry_date,
    image: row.image_path,
    imageAlt: row.image_alt,
    introduction: row.introduction,
    steps: Array.isArray(row.steps) ? row.steps : [],
    tips: Array.isArray(row.tips) ? row.tips : [],
    contributorStory: row.contributor_story,
    featured: row.featured ?? false,
    isSample: row.is_sample ?? false,
    status: row.status,
    topicSlugs,
    primaryTopicSlug: topicSlugs[0],
  };
}

/**
 * Columns read by the contributor status page and the admin entry list. They
 * are the entry fields plus the review metadata added in migration 0012.
 */
export const SUBMISSION_COLUMNS = [
  "id",
  "slug",
  "title",
  "status",
  "category",
  "contributor",
  "location",
  "entry_date",
  "image_path",
  "image_alt",
  "featured",
  "is_sample",
  "created_at",
  "updated_at",
  "review_note",
  "reviewed_at",
].join(", ");

/** Columns needed to rebuild the contribution form for editing. */
export const EDITABLE_ENTRY_COLUMNS = [
  "id",
  "slug",
  "status",
  "owner",
  "title",
  "description",
  "category",
  "topic_slugs",
  "contributor",
  "location",
  "entry_date",
  "image_path",
  "image_alt",
  "introduction",
  "steps",
  "tips",
  "contributor_story",
  "review_note",
].join(", ");

/** A database row as the submission card on `/my-submissions` needs it. */
export function toSubmission(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    category: row.category,
    contributor: row.contributor,
    location: row.location,
    date: row.entry_date,
    image: row.image_path,
    imageAlt: row.image_alt,
    featured: row.featured ?? false,
    isSample: row.is_sample ?? false,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    reviewNote: row.review_note ?? null,
    reviewedAt: row.reviewed_at ?? null,
  };
}

/** A database row as the contribution form's field values. */
export function toContributionForm(row) {
  const clean = stripLegacySampleMarker;

  return {
    contributor: clean(row.contributor) ?? "",
    title: clean(row.title) ?? "",
    description: clean(row.description) ?? "",
    category: clean(row.category) ?? "",
    topicSlugs: Array.isArray(row.topic_slugs) ? row.topic_slugs : [],
    location: clean(row.location) ?? "",
    entryDate: normalizeLegacyEntryDate(row.entry_date),
    introduction: clean(row.introduction) ?? "",
    steps: (Array.isArray(row.steps) ? row.steps : []).map((step) => ({
      ...step,
      title: clean(step?.title) ?? "",
      description: clean(step?.description) ?? "",
    })),
    tips: (Array.isArray(row.tips) ? row.tips : []).map((tip) => clean(tip)),
    contributorStory: clean(row.contributor_story) ?? "",
    imageAlt: clean(row.image_alt) ?? "",
  };
}