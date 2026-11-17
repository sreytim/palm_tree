import assert from "node:assert/strict";
import test from "node:test";
import { toContributionForm } from "../lib/entry-mapping.js";
import {
  normalizeLegacyEntryDate,
  stripLegacySampleMarker,
} from "../lib/legacy-text.js";

test("the old (sample) marker is removed from display text", () => {
  assert.equal(
    stripLegacySampleMarker("Kampong Speu Province, Cambodia (sample)"),
    "Kampong Speu Province, Cambodia",
  );
  assert.equal(stripLegacySampleMarker("(SAMPLE) A story"), "A story");
  assert.equal(stripLegacySampleMarker("No marker here"), "No marker here");
  assert.equal(stripLegacySampleMarker(null), null);
});

test("prose entry dates are normalised for the edit form", () => {
  assert.equal(normalizeLegacyEntryDate("March 2024"), "2024-03");
  assert.equal(normalizeLegacyEntryDate("2024-03"), "2024-03");
  assert.equal(normalizeLegacyEntryDate("2024"), "2024");
  assert.equal(normalizeLegacyEntryDate("sometime in 2024"), "");
  assert.equal(normalizeLegacyEntryDate(null), "");
});

test("an edit form starts from clean, saveable values", () => {
  const form = toContributionForm({
    contributor: "Community Elder Interview",
    title: "A title",
    description: "A description",
    category: "Maintenance & Repair",
    location: "Takeo Province, Cambodia (sample)",
    entry_date: "March 2024",
    introduction: "An introduction",
    steps: [{ title: "A step (sample)", description: "A step description" }],
    tips: ["A tip (sample)"],
    contributor_story: "A story (sample)",
    image_alt: "A photo",
  });

  assert.equal(form.location, "Takeo Province, Cambodia");
  assert.equal(form.entryDate, "2024-03");
  assert.equal(form.steps[0].title, "A step");
  assert.equal(form.tips[0], "A tip");
  assert.equal(form.contributorStory, "A story");
});
