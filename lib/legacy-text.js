/**
 * Legacy draft markers.
 *
 * The first seed wrote " (sample)" inside location and contributor-story text.
 * Migration 0013 removes it from the database, but a project that has not run
 * that migration can still return it. Every read path that surfaces those
 * fields strips the marker, so a published entry never reads as a test row and
 * an editor saving the form never writes the marker back.
 */
const LEGACY_SAMPLE_MARKER = /\s*\(sample\)\s*/gi;

export function stripLegacySampleMarker(value) {
  if (typeof value !== "string") {
    return value;
  }

  return value.replace(LEGACY_SAMPLE_MARKER, " ").replace(/\s{2,}/g, " ").trim();
}

const MONTH_NUMBERS = {
  january: "01",
  february: "02",
  march: "03",
  april: "04",
  may: "05",
  june: "06",
  july: "07",
  august: "08",
  september: "09",
  october: "10",
  november: "11",
  december: "12",
};

/**
 * Entry dates are stored as `YYYY` or `YYYY-MM`, which is what the form and the
 * database accept. The first seed used prose dates such as "March 2024"; the
 * edit form normalises those instead of rejecting a save the reviewer cannot
 * fix. Anything unrecognised becomes an empty optional field.
 */
export function normalizeLegacyEntryDate(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (/^[1-9]\d{3}(?:-(?:0[1-9]|1[0-2]))?$/.test(trimmed)) {
    return trimmed;
  }

  const monthYear = trimmed.match(/^([A-Za-z]+)\s+([1-9]\d{3})$/);
  if (monthYear) {
    const month = MONTH_NUMBERS[monthYear[1].toLowerCase()];
    if (month) {
      return `${monthYear[2]}-${month}`;
    }
  }

  return "";
}
