import test from "node:test";
import assert from "node:assert/strict";
import { validateContribution } from "../lib/contribution-rules.js";
import {
  MAX_CONTRIBUTION_PHOTO_SIZE,
  validateContributionPhoto,
} from "../lib/photo-validation.js";

const validEntry = {
  contributor: "Sokha",
  title: "Palm leaf preparation",
  description: "A description long enough to meet the minimum length.",
  category: "Palm Leaf Preparation",
  topicSlugs: ["palm-leaf-preparation"],
  location: "",
  entryDate: "",
  introduction: "An introduction long enough to pass the validation rule.",
  steps: [],
  tips: [],
  contributorStory: "",
  imageAlt: "Palm leaves being prepared by hand",
};

test("accepts a one-word Khmer contributor name and Khmer entry text", () => {
  const result = validateContribution({
    ...validEntry,
    contributor: "សុខា",
    title: "ការរៀបចំស្លឹកត្នោត",
    description: "ការរៀបចំស្លឹកត្នោតសម្រាប់ប្រក់ដំបូលផ្ទះបែបប្រពៃណី។",
    introduction: "ស្លឹកត្នោតត្រូវបានជ្រើសរើស និងរៀបចំយ៉ាងប្រុងប្រយ័ត្ន។",
  });

  assert.deepEqual(result.errors, {});
  assert.equal(result.value.contributor, "សុខា");
  assert.equal(result.value.title, "ការរៀបចំស្លឹកត្នោត");
});

test("rejects blank and whitespace-only required fields", () => {
  const result = validateContribution({
    ...validEntry,
    contributor: "   ",
    title: "   ",
    description: "   ",
    introduction: "   ",
  });

  assert.equal(result.errors.contributor, "contributorNameLength");
  assert.equal(result.errors.title, "titleLength");
  assert.equal(result.errors.description, "descriptionLength");
  assert.equal(result.errors.introduction, "introductionLength");
});

test("accepts a JPEG whose bytes and declared MIME type match", () => {
  const result = validateContributionPhoto({
    mime: "image/jpeg",
    size: 3,
    bytes: Buffer.from([0xff, 0xd8, 0xff]),
  });

  assert.equal(result.error, null);
  assert.deepEqual(result.detectedType, {
    mime: "image/jpeg",
    extension: "jpg",
  });
});

test("rejects text files renamed as images and mismatched MIME types", () => {
  const textFile = validateContributionPhoto({
    mime: "image/jpeg",
    size: 12,
    bytes: Buffer.from("not an image"),
  });
  const mismatchedType = validateContributionPhoto({
    mime: "image/png",
    size: 3,
    bytes: Buffer.from([0xff, 0xd8, 0xff]),
  });

  assert.equal(textFile.error, "photoType");
  assert.equal(mismatchedType.error, "photoType");
});

test("rejects photos above 10 MB and permits the exact limit", () => {
  const bytes = Buffer.from([0xff, 0xd8, 0xff]);
  const oversized = validateContributionPhoto({
    mime: "image/jpeg",
    size: MAX_CONTRIBUTION_PHOTO_SIZE + 1,
    bytes,
  });
  const atLimit = validateContributionPhoto({
    mime: "image/jpeg",
    size: MAX_CONTRIBUTION_PHOTO_SIZE,
    bytes,
  });

  assert.equal(oversized.error, "photoSize");
  assert.equal(atLimit.error, null);
});
