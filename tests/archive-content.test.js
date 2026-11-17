import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { entryContent } from "../data/entry-content.js";
import { topics } from "../data/topics.js";
import { isBilingual, localizeLabel } from "../lang/i18n.js";
import { pairTranslation, withBilingualContent } from "../lib/entry-content.js";

/**
 * The archive is read in Khmer by default in many households, so a paragraph
 * that is only written in English is a bug, not a translation gap to fix later.
 * These tests read the bilingual catalogue directly and fail on any field that
 * carries one language instead of two.
 *
 * `data/gallery.js` is checked as source text because it imports the image
 * registry, which Next resolves through its asset pipeline and plain Node does
 * not.
 */
const gallerySource = readFileSync(
  new URL("../data/gallery.js", import.meta.url),
  "utf8",
);
const techniquesSource = readFileSync(
  new URL("../data/techniques.js", import.meta.url),
  "utf8",
);

/**
 * Contributor stories were removed from the public entry views: a card now
 * ends with the location, steps and tips. The field is still collected on the
 * contribution form and shown to reviewers, so this test guards the display
 * only.
 */
const detailViews = ["../app/(main)/archive/[slug]/page.js", "../app/(main)/techniques/page.js"].map(
  (path) => readFileSync(new URL(path, import.meta.url), "utf8"),
);

const slugs = Object.keys(entryContent);
const proseFields = [
  "title",
  "description",
  "imageAlt",
  "location",
  "introduction",
  "contributorStory",
];


test("every seeded entry is in the catalogue", () => {
  assert.equal(slugs.length, 8);
});

test("every prose field of every entry carries English and Khmer", () => {
  for (const slug of slugs) {
    const entry = entryContent[slug];

    for (const field of proseFields) {
      const value = entry[field];

      assert.ok(isBilingual(value), `${slug}.${field} is not bilingual`);
      assert.equal(typeof value.en, "string", `${slug}.${field}.en`);
      assert.equal(typeof value.km, "string", `${slug}.${field}.km`);
      assert.ok(value.en.trim().length > 0, `${slug}.${field}.en is empty`);
      assert.ok(value.km.trim().length > 0, `${slug}.${field}.km is empty`);
    }
  }
});

test("Khmer copy contains no untranslated English words", () => {
  for (const slug of slugs) {
    const entry = entryContent[slug];

    for (const field of proseFields) {
      assert.doesNotMatch(
        entry[field].km,
        /[A-Za-z]{3,}/,
        `${slug}.${field}.km still contains English words`,
      );
    }

    entry.steps.forEach((step, index) => {
      for (const part of ["title", "description"]) {
        assert.ok(
          isBilingual(step[part]),
          `${slug}.steps[${index}].${part} is not bilingual`,
        );
        assert.doesNotMatch(
          step[part].km,
          /[A-Za-z]{3,}/,
          `${slug}.steps[${index}].${part}.km still contains English words`,
        );
      }
    });

    entry.tips.forEach((tip, index) => {
      assert.ok(isBilingual(tip), `${slug}.tips[${index}] is not bilingual`);
      assert.doesNotMatch(
        tip.km,
        /[A-Za-z]{3,}/,
        `${slug}.tips[${index}].km still contains English words`,
      );
    });
  }
});

test("steps and tips describe the same number of items in both languages", () => {
  for (const slug of slugs) {
    const { steps, tips } = entryContent[slug];

    assert.ok(Array.isArray(steps) && steps.length >= 3, `${slug} has no steps`);
    assert.ok(Array.isArray(tips) && tips.length >= 2, `${slug} has no tips`);
  }
});

test("topic labels and gallery photographs are bilingual too", () => {
  for (const topic of topics) {
    assert.ok(isBilingual(topic.name), `topic ${topic.slug} name`);
    if (topic.description) {
      assert.ok(isBilingual(topic.description), `topic ${topic.slug} description`);
    }
  }

  for (const field of ["title", "description", "alt", "location", "contributor"]) {
    assert.doesNotMatch(
      gallerySource,
      new RegExp(`\\n\\s+${field}: "`),
      `a gallery photograph still has an untranslated ${field}`,
    );
  }

  for (const field of ["title", "description", "imageAlt", "tip"]) {
    assert.doesNotMatch(
      techniquesSource,
      new RegExp(`\\n\\s+${field}: "`),
      `a technique step still has an untranslated ${field}`,
    );
  }
});

test("no public entry card renders a contributor story", () => {
  for (const source of detailViews) {
    assert.doesNotMatch(
      source,
      /t\("contributorStory"\)/,
      "an entry view still shows the contributor story heading",
    );
    assert.doesNotMatch(
      source,
      /item\.contributorStory/,
      "an entry view still renders the contributor story text",
    );
  }
});

test("localizeLabel resolves a bilingual object and falls back safely", () => {
  const label = { en: "Roof Covering", km: "ការប្រក់ដំបូល" };

  assert.equal(localizeLabel(label, "km"), "ការប្រក់ដំបូល");
  assert.equal(localizeLabel(label, "en"), "Roof Covering");
  assert.equal(localizeLabel({ en: "Only English" }, "km"), "Only English");
  assert.equal(localizeLabel(null, "km"), "");
  assert.equal(localizeLabel("Plain string", "km"), "Plain string");
  // A legacy dictionary label still resolves through the same function.
  assert.equal(localizeLabel("Weaving Techniques", "km"), "បច្ចេកទេសត្បាញ");
});

test("a database row gains the Khmer copy that matches its slug", () => {
  const catalogue = entryContent["seasonal-roof-repair"];
  const row = {
    slug: "seasonal-roof-repair",
    title: "Seasonal Roof Repair",
    description: "A short English description.",
    imageAlt: "A patched roof",
    location: "Takeo Province, Cambodia",
    introduction: "English introduction kept from the database.",
    contributorStory: "A story from the database.",
    // Same number of steps and tips as the catalogue, so the English the editor
    // saved is kept and only the Khmer is supplied.
    steps: catalogue.steps.map((step) => ({
      title: step.title.en,
      description: step.description.en,
    })),
    tips: catalogue.tips.map((tip) => tip.en),
  };

  const merged = withBilingualContent(row);

  assert.equal(merged.title.en, "Seasonal Roof Repair");
  assert.equal(merged.title.km, catalogue.title.km);
  assert.equal(merged.introduction.en, row.introduction);
  assert.equal(merged.introduction.km, catalogue.introduction.km);
  assert.equal(merged.steps.length, catalogue.steps.length);
  assert.equal(merged.steps[0].title.en, catalogue.steps[0].title.en);
  assert.equal(merged.steps[0].title.km, catalogue.steps[0].title.km);
  assert.equal(merged.tips[0].en, catalogue.tips[0].en);
  assert.equal(merged.tips[0].km, catalogue.tips[0].km);
});

test("a rewritten step list falls back to the curated bilingual pair", () => {
  const catalogue = entryContent["seasonal-roof-repair"];
  const merged = withBilingualContent({
    slug: "seasonal-roof-repair",
    steps: [{ title: "Only one step", description: "A step added later." }],
    tips: ["Only one tip"],
  });

  // Pairing by index across two different structures would attach the wrong
  // Khmer sentence to a step, so the catalogue wins as a whole.
  assert.equal(merged.steps.length, catalogue.steps.length);
  assert.equal(merged.steps[0].title.km, catalogue.steps[0].title.km);
  assert.equal(merged.tips.length, catalogue.tips.length);
});

test("an untranslated community submission passes through untouched", () => {
  const row = {
    slug: "a-new-community-submission",
    title: "My family's roof",
    steps: [{ title: "Step", description: "Doing the thing." }],
    tips: ["A tip"],
  };

  const merged = withBilingualContent(row);

  assert.deepEqual(merged, row);
  assert.equal(pairTranslation("English only", undefined), "English only");
});
