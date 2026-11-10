import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

/**
 * The archive presents the seeded examples as real archive content, so no
 * screen, translation or seeded row may carry a "sample" marker any more.
 * `is_sample` itself survives as moderation metadata: migration 0008 uses it to
 * order the migrated examples, and it is not rendered anywhere.
 */
const contentSources = {
  entryDetail: read("app/(main)/archive/[slug]/page.js"),
  techniqueDetail: read("app/(main)/techniques/page.js"),
  labels: read("lang/i18n.js"),
  archiveData: read("data/archive.js"),
  seed: read("supabase/seed-entries.sql"),
};

const sampleMarkers = [
  { pattern: /sampleArchiveEntry|sampleEntry\b/, hint: "sample i18n key" },
  { pattern: /\(sample\)/, hint: "stored (sample) marker" },
  { pattern: /sample (entry|contributor)\./, hint: "sample attribution suffix" },
];

test("no content source labels an entry as a sample", () => {
  for (const [name, source] of Object.entries(contentSources)) {
    for (const { pattern, hint } of sampleMarkers) {
      assert.doesNotMatch(source, pattern, `${name} still contains a ${hint}`);
    }
  }
});

test("migration 0013 clears the markers already stored in the database", () => {
  const cleanup = read(
    "supabase/migrations/0013_remove_sample_location_markers.sql",
  );

  assert.match(cleanup, /update public\.entries\s+set location = nullif\(/);
  assert.match(cleanup, /regexp_replace\(location, '\\s\*\\\(sample\\\)\\s\*\$'/);
  assert.match(cleanup, /sample \(entry\|contributor\)/);
});

test("both entry detail views show the way back over the photo", () => {
  for (const view of [contentSources.entryDetail, contentSources.techniqueDetail]) {
    assert.match(view, /absolute left-4 top-4/);
    assert.match(view, /t\("backToArchive"\)/);
  }
});

test("both languages still translate the back label", () => {
  const labelLines = contentSources.labels
    .split("\n")
    .filter((line) => line.includes("backToArchive:"));

  assert.equal(labelLines.length, 2);
  for (const line of labelLines) {
    assert.doesNotMatch(line, /backToArchive:\s*""/);
  }
});
