/**
 * Bridges the database and the bilingual catalogue.
 *
 * The `entries` table stores one text column per field, written in the
 * contributor's language (in practice English for the seeded examples). The
 * Khmer wording for those entries lives in `data/entry-content.js`.
 *
 * `withBilingualContent()` pairs the two: the database keeps the text it has,
 * the catalogue supplies the other language, and a field that is already
 * bilingual is left untouched. Nothing here writes to the database, so an
 * editor correcting an entry's text still sees their own correction — only the
 * Khmer side comes from the catalogue until that column is translated too.
 *
 * Pure module: no Supabase, no React, and no image imports, so the merge can be
 * unit-tested directly.
 */
import { entryContent } from "../data/entry-content.js";
import { stripLegacySampleMarker } from "./legacy-text.js";

/** Fields that carry translated prose on an entry. */
const TEXT_FIELDS = [
  "title",
  "description",
  "imageAlt",
  "location",
  "contributor",
  "introduction",
  "contributorStory",
];

const isPlainText = (value) => typeof value === "string" && value.trim() !== "";

/**
 * The catalogue replaced the original draft attribution, but a project that
 * has not run migration 0013 can still hold the old " (sample)" marker inside
 * location and contributor-story text. Strip it on the way to the screen so a
 * published entry never reads as a test row, whatever the database holds.
 */
function cleanLegacyText(value) {
  if (typeof value === "string") {
    return stripLegacySampleMarker(value);
  }

  if (value && typeof value === "object") {
    return {
      ...value,
      ...(typeof value.en === "string"
        ? { en: stripLegacySampleMarker(value.en) }
        : {}),
      ...(typeof value.km === "string"
        ? { km: stripLegacySampleMarker(value.km) }
        : {}),
    };
  }

  return value;
}

/**
 * Pairs an English value with its Khmer counterpart.
 *
 * Returns the original value when no Khmer text is available, so interfaces
 * that predate this catalogue keep working unchanged.
 */
export function pairTranslation(value, khmer) {
  if (!isPlainText(khmer)) {
    return value;
  }

  if (value && typeof value === "object") {
    return { ...value, km: value.km ?? khmer };
  }

  if (isPlainText(value)) {
    return { en: value, km: khmer };
  }

  return { km: khmer };
}

function mergeStepList(steps, catalogueSteps) {
  if (!Array.isArray(catalogueSteps) || catalogueSteps.length === 0) {
    return steps;
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    return catalogueSteps;
  }

  // A different number of steps means the database copy has been rewritten (or
  // the catalogue has), so the curated pair is used as a whole. Pairing by index
  // across two different structures would attach the wrong Khmer sentence to a
  // step, which is worse than showing the catalogue's own English.
  if (steps.length !== catalogueSteps.length) {
    return catalogueSteps;
  }

  return steps.map((step, index) => {
    const translated = catalogueSteps[index];

    return {
      ...step,
      title: pairTranslation(cleanLegacyText(step?.title), translated.title?.km),
      description: pairTranslation(
        cleanLegacyText(step?.description),
        translated.description?.km,
      ),
    };
  });
}

function mergeTipList(tips, catalogueTips) {
  if (!Array.isArray(catalogueTips) || catalogueTips.length === 0) {
    return tips;
  }

  if (!Array.isArray(tips) || tips.length === 0) {
    return catalogueTips;
  }

  if (tips.length !== catalogueTips.length) {
    return catalogueTips;
  }

  return tips.map((tip, index) =>
    pairTranslation(cleanLegacyText(tip), catalogueTips[index]?.km),
  );
}

/**
 * An entry row enriched with the Khmer copy that matches its slug.
 *
 * Unknown slugs — community submissions the archive has not translated yet —
 * pass through untouched and therefore keep rendering in the language they were
 * written in.
 */
export function withBilingualContent(entry) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }

  const catalogue = entryContent[entry.slug];

  if (!catalogue) {
    return entry;
  }

  const merged = { ...entry };

  for (const field of TEXT_FIELDS) {
    const catalogueValue = catalogue[field];

    // Curated attribution is role-based and bilingual. A legacy row may have
    // no contributor at all, in which case the catalogue's pair is used so the
    // English view never falls back to Khmer.
    if (field === "contributor" && !isPlainText(entry.contributor)) {
      merged[field] = catalogueValue ?? cleanLegacyText(entry.contributor);
      continue;
    }

    merged[field] = pairTranslation(
      cleanLegacyText(entry[field]),
      catalogueValue?.km,
    );
  }

  merged.steps = mergeStepList(entry.steps, catalogue.steps);
  merged.tips = mergeTipList(entry.tips, catalogue.tips);

  return merged;
}
