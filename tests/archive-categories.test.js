import test from "node:test";
import assert from "node:assert/strict";
import {
  ALL_CATEGORIES,
  buildCategoryOptions,
  matchesCategory,
  resolveActiveCategory,
} from "../lib/archive-categories.js";
import { CONTRIBUTION_CATEGORIES } from "../lib/contribution-rules.js";

const entry = (category) => ({ id: category, category });

test("chips follow the contribution form order, not the row order", () => {
  const items = [
    entry("Traditional Houses"),
    entry("Palm Leaf Preparation"),
    entry("Weaving Techniques"),
  ];

  assert.deepEqual(buildCategoryOptions(items), [
    "Palm Leaf Preparation",
    "Weaving Techniques",
    "Traditional Houses",
  ]);
});

test("every category is listed once even when many entries share it", () => {
  const items = [
    entry("House Construction"),
    entry("House Construction"),
    entry("House Construction"),
  ];

  assert.deepEqual(buildCategoryOptions(items), ["House Construction"]);
});

test("a category outside the form list still gets a chip, sorted last", () => {
  const items = [
    entry("Weaving Techniques"),
    entry("Roof Thatching"),
    entry("Bamboo Work"),
  ];

  assert.deepEqual(buildCategoryOptions(items), [
    "Weaving Techniques",
    "Bamboo Work",
    "Roof Thatching",
  ]);
});

test("rows without a category or with no rows at all offer no chips", () => {
  assert.deepEqual(buildCategoryOptions([]), []);
  assert.deepEqual(buildCategoryOptions([{ id: 1 }, { id: 2, category: "" }]), []);
  assert.deepEqual(buildCategoryOptions(null), []);
});

test("all six contribution categories are recognised as known", () => {
  const items = CONTRIBUTION_CATEGORIES.map(entry);

  assert.deepEqual(buildCategoryOptions(items), CONTRIBUTION_CATEGORIES);
});

test("an active category that is offered is kept", () => {
  const options = ["Weaving Techniques", "Traditional Houses"];

  assert.equal(
    resolveActiveCategory("Traditional Houses", options),
    "Traditional Houses",
  );
});

test("a stale or missing category falls back to showing everything", () => {
  const options = ["Weaving Techniques"];

  for (const value of [null, undefined, "", "Removed Category"]) {
    assert.equal(resolveActiveCategory(value, options), ALL_CATEGORIES);
  }
  assert.equal(resolveActiveCategory("Weaving Techniques", []), ALL_CATEGORIES);
});

test("the all filter keeps every entry, a category keeps its own", () => {
  const weaving = entry("Weaving Techniques");

  assert.equal(matchesCategory(weaving, ALL_CATEGORIES), true);
  assert.equal(matchesCategory(weaving, "Weaving Techniques"), true);
  assert.equal(matchesCategory(weaving, "Traditional Houses"), false);
  assert.equal(matchesCategory({ id: 1 }, ALL_CATEGORIES), true);
  assert.equal(matchesCategory({ id: 1 }, "Traditional Houses"), false);
});
