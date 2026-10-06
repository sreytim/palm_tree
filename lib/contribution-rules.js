import { topics } from "@/data/topics";

export const CONTRIBUTION_CATEGORIES = [
  "Palm Leaf Preparation",
  "Weaving Techniques",
  "House Construction",
  "Attachment Techniques",
  "Maintenance & Repair",
  "Traditional Houses",
];

export const CONTRIBUTION_TOPICS = topics
  .filter((topic) => topic.scope === "archive")
  .map((topic) => topic.slug);

const trimText = (value) => (typeof value === "string" ? value.trim() : "");

export function normalizeContribution(input) {
  const steps = Array.isArray(input.steps) ? input.steps : [];
  const tips = Array.isArray(input.tips) ? input.tips : [];

  return {
    title: trimText(input.title),
    description: trimText(input.description),
    category: trimText(input.category),
    topicSlugs: Array.isArray(input.topicSlugs)
      ? input.topicSlugs.filter((slug) => typeof slug === "string")
      : [],
    location: trimText(input.location),
    entryDate: trimText(input.entryDate),
    introduction: trimText(input.introduction),
    steps: steps.map((step) => ({
      title: trimText(step?.title),
      description: trimText(step?.description),
    })),
    tips: tips.map(trimText),
    contributorStory: trimText(input.contributorStory),
    imageAlt: trimText(input.imageAlt),
  };
}

export function validateContribution(input) {
  const source =
    input && typeof input === "object" && !Array.isArray(input) ? input : {};
  const value = normalizeContribution(source);
  const errors = {};

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    errors.form = "contributionInvalid";
  }

  if (value.title.length < 3 || value.title.length > 120) {
    errors.title = "titleLength";
  }
  if (value.description.length < 20 || value.description.length > 500) {
    errors.description = "descriptionLength";
  }
  if (!CONTRIBUTION_CATEGORIES.includes(value.category)) {
    errors.category = "chooseCategory";
  }
  if (
    value.topicSlugs.length < 1 ||
    value.topicSlugs.length > 5 ||
    value.topicSlugs.some((slug) => !CONTRIBUTION_TOPICS.includes(slug)) ||
    new Set(value.topicSlugs).size !== value.topicSlugs.length
  ) {
    errors.topicSlugs = "chooseTopics";
  }
  if (value.location.length > 120) {
    errors.location = "locationLength";
  }
  if (
    value.entryDate &&
    !/^[1-9]\d{3}(?:-(?:0[1-9]|1[0-2]))?$/.test(value.entryDate)
  ) {
    errors.entryDate = "entryDateFormat";
  }
  if (value.introduction.length < 20 || value.introduction.length > 2000) {
    errors.introduction = "introductionLength";
  }
  if (value.steps.length > 12) {
    errors.steps = "stepsLimit";
  } else if (
    value.steps.some(
      (step) =>
        step.title.length < 3 ||
        step.title.length > 80 ||
        step.description.length < 10 ||
        step.description.length > 500,
    )
  ) {
    errors.steps = "stepLength";
  }
  if (value.tips.length > 10) {
    errors.tips = "tipsLimit";
  } else if (value.tips.some((tip) => tip.length < 3 || tip.length > 300)) {
    errors.tips = "tipLength";
  }
  if (value.contributorStory.length > 3000) {
    errors.contributorStory = "storyLength";
  }
  if (value.imageAlt.length < 10 || value.imageAlt.length > 250) {
    errors.imageAlt = "imageAltLength";
  }

  return { value, errors };
}
