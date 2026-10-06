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
    topicSlugs,
    primaryTopicSlug: topicSlugs[0],
  };
}