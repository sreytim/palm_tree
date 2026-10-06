"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { topics } from "@/data/topics";
import {
  CONTRIBUTION_CATEGORIES,
  validateContribution,
} from "@/lib/contribution-rules";

const EMPTY_ENTRY = {
  title: "",
  description: "",
  category: "",
  topicSlugs: [],
  location: "",
  entryDate: "",
  introduction: "",
  steps: [],
  tips: [],
  contributorStory: "",
  imageAlt: "",
};

const FIELD_CLASS =
  "mt-1 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-ink outline-none focus:border-palm focus:ring-2 focus:ring-palm/20";

function FieldError({ message }) {
  return message ? (
    <p className="mt-1 text-sm text-clay-deep" role="alert">
      {message}
    </p>
  ) : null;
}

export default function ContributionForm() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [entry, setEntry] = useState(EMPTY_ENTRY);
  const [photo, setPhoto] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (name, value) => {
    setEntry((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setFormError("");
  };

  const toggleTopic = (slug) => {
    setField(
      "topicSlugs",
      entry.topicSlugs.includes(slug)
        ? entry.topicSlugs.filter((selected) => selected !== slug)
        : [...entry.topicSlugs, slug],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const validation = validateContribution(entry);
    const nextErrors = { ...validation.errors };
    if (!photo) {
      nextErrors.photo = "photoRequired";
    } else if (!["image/jpeg", "image/png", "image/webp"].includes(photo.type)) {
      nextErrors.photo = "photoType";
    } else if (photo.size > 10 * 1024 * 1024) {
      nextErrors.photo = "photoSize";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.set("entry", JSON.stringify(validation.value));
      payload.set("photo", photo);
      const response = await fetch("/api/contributions", {
        method: "POST",
        body: payload,
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error("Contribution response could not be read:", parseError);
        setFormError(t("contributionSubmitFailed"));
        return;
      }

      if (!response.ok) {
        if (response.status === 401) {
          setFormError(t("contributionSessionExpired"));
        } else if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        } else {
          console.error("Contribution submission failed:", result);
          setFormError(t("contributionSubmitFailed"));
        }
        return;
      }

      router.push(`/archive/${encodeURIComponent(result.slug)}`);
    } catch (error) {
      console.error("Contribution request failed:", error);
      setFormError(t("contributionSubmitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      <fieldset disabled={isSubmitting} className="space-y-8 disabled:opacity-80">
        <FieldError message={fieldErrors.form && t(fieldErrors.form)} />
        <section className="space-y-5 rounded-3xl border border-beige bg-cream p-5 sm:p-8">
          <div>
            <label htmlFor="title" className="font-medium text-ink">
              {t("contributionTitle")} *
            </label>
            <input
              id="title"
              value={entry.title}
              onChange={(event) => setField("title", event.target.value)}
              maxLength={120}
              required
              className={FIELD_CLASS}
            />
            <FieldError message={fieldErrors.title && t(fieldErrors.title)} />
          </div>

          <div>
            <label htmlFor="description" className="font-medium text-ink">
              {t("contributionDescription")} *
            </label>
            <textarea
              id="description"
              value={entry.description}
              onChange={(event) => setField("description", event.target.value)}
              minLength={20}
              maxLength={500}
              rows={3}
              required
              className={FIELD_CLASS}
            />
            <FieldError
              message={fieldErrors.description && t(fieldErrors.description)}
            />
          </div>

          <div>
            <label htmlFor="category" className="font-medium text-ink">
              {t("contributionCategory")} *
            </label>
            <select
              id="category"
              value={entry.category}
              onChange={(event) => setField("category", event.target.value)}
              required
              className={FIELD_CLASS}
            >
              <option value="">{t("selectContributionCategory")}</option>
              {CONTRIBUTION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {localizeLabel(category, language)}
                </option>
              ))}
            </select>
            <FieldError
              message={fieldErrors.category && t(fieldErrors.category)}
            />
          </div>

          <fieldset>
            <legend className="font-medium text-ink">
              {t("contributionTopics")} *{" "}
              <span className="font-normal text-ink-soft">
                {t("chooseOneToFiveTopics")}
              </span>
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {topics
                .filter((topic) => topic.scope === "archive")
                .map((topic) => (
                  <label
                    key={topic.slug}
                    className="flex items-center gap-2 rounded-xl border border-beige/70 px-3 py-2 text-sm text-ink"
                  >
                    <input
                      type="checkbox"
                      checked={entry.topicSlugs.includes(topic.slug)}
                      onChange={() => toggleTopic(topic.slug)}
                      className="accent-palm"
                    />
                    {localizeLabel(topic.name, language)}
                  </label>
                ))}
            </div>
            <FieldError
              message={
                fieldErrors.topicSlugs && t(fieldErrors.topicSlugs)
              }
            />
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="font-medium text-ink">
                {t("contributionLocation")}
              </label>
              <input
                id="location"
                value={entry.location}
                onChange={(event) => setField("location", event.target.value)}
                maxLength={120}
                className={FIELD_CLASS}
              />
              <p className="mt-1 text-xs text-ink-soft">
                {t("locationPrivacyHint")}
              </p>
              <FieldError
                message={fieldErrors.location && t(fieldErrors.location)}
              />
            </div>
            <div>
              <label htmlFor="entry-date" className="font-medium text-ink">
                {t("contributionDate")}
              </label>
              <input
                id="entry-date"
                value={entry.entryDate}
                onChange={(event) => setField("entryDate", event.target.value)}
                placeholder="YYYY or YYYY-MM"
                maxLength={7}
                className={FIELD_CLASS}
              />
              <FieldError
                message={fieldErrors.entryDate && t(fieldErrors.entryDate)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="introduction" className="font-medium text-ink">
              {t("contributionIntroduction")} *
            </label>
            <textarea
              id="introduction"
              value={entry.introduction}
              onChange={(event) => setField("introduction", event.target.value)}
              minLength={20}
              maxLength={2000}
              rows={6}
              required
              className={FIELD_CLASS}
            />
            <FieldError
              message={
                fieldErrors.introduction && t(fieldErrors.introduction)
              }
            />
          </div>
        </section>

        <section className="space-y-5 rounded-3xl border border-beige bg-cream p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-medium text-ink">
                {t("contributionSteps")}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {t("optionalStepsHint")}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setField("steps", [
                  ...entry.steps,
                  { title: "", description: "" },
                ])
              }
              disabled={entry.steps.length >= 12}
              className="shrink-0 rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep disabled:opacity-50"
            >
              {t("addStep")}
            </button>
          </div>
          {entry.steps.map((step, index) => (
            <div
              key={`step-${index}`}
              className="space-y-3 rounded-2xl border border-beige/70 p-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink">
                  {t("stepNumber")} {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setField(
                      "steps",
                      entry.steps.filter((_, stepIndex) => stepIndex !== index),
                    )
                  }
                  className="text-sm text-clay-deep underline"
                >
                  {t("remove")}
                </button>
              </div>
              <input
                value={step.title}
                onChange={(event) => {
                  const steps = [...entry.steps];
                  steps[index] = { ...step, title: event.target.value };
                  setField("steps", steps);
                }}
                maxLength={80}
                placeholder={t("stepTitle")}
                aria-label={`${t("stepNumber")} ${index + 1}: ${t("stepTitle")}`}
                className={FIELD_CLASS}
              />
              <textarea
                value={step.description}
                onChange={(event) => {
                  const steps = [...entry.steps];
                  steps[index] = {
                    ...step,
                    description: event.target.value,
                  };
                  setField("steps", steps);
                }}
                maxLength={500}
                rows={3}
                placeholder={t("stepDescription")}
                aria-label={`${t("stepNumber")} ${index + 1}: ${t("stepDescription")}`}
                className={FIELD_CLASS}
              />
            </div>
          ))}
          <FieldError message={fieldErrors.steps && t(fieldErrors.steps)} />

          <div className="border-t border-beige pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-medium text-ink">
                  {t("contributionTips")}
                </h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {t("optionalTipsHint")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setField("tips", [...entry.tips, ""])}
                disabled={entry.tips.length >= 10}
                className="shrink-0 rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep disabled:opacity-50"
              >
                {t("addTip")}
              </button>
            </div>
            {entry.tips.map((tip, index) => (
              <div
                key={`tip-${index}`}
                className="mt-3 flex items-start gap-2"
              >
                <textarea
                  value={tip}
                  onChange={(event) => {
                    const tips = [...entry.tips];
                    tips[index] = event.target.value;
                    setField("tips", tips);
                  }}
                  maxLength={300}
                  rows={2}
                  placeholder={t("tipPlaceholder")}
                  aria-label={`${t("tip")} ${index + 1}`}
                  className={FIELD_CLASS}
                />
                <button
                  type="button"
                  onClick={() =>
                    setField(
                      "tips",
                      entry.tips.filter((_, tipIndex) => tipIndex !== index),
                    )
                  }
                  aria-label={`${t("remove")} ${t("tip")} ${index + 1}`}
                  className="mt-3 text-sm text-clay-deep underline"
                >
                  {t("remove")}
                </button>
              </div>
            ))}
            <FieldError message={fieldErrors.tips && t(fieldErrors.tips)} />
          </div>

          <div>
            <label
              htmlFor="contributor-story"
              className="font-medium text-ink"
            >
              {t("contributionStory")}
            </label>
            <textarea
              id="contributor-story"
              value={entry.contributorStory}
              onChange={(event) =>
                setField("contributorStory", event.target.value)
              }
              maxLength={3000}
              rows={5}
              className={FIELD_CLASS}
            />
            <FieldError
              message={
                fieldErrors.contributorStory &&
                t(fieldErrors.contributorStory)
              }
            />
          </div>
        </section>

        <section className="space-y-5 rounded-3xl border border-beige bg-cream p-5 sm:p-8">
          <div>
            <label htmlFor="photo" className="font-medium text-ink">
              {t("contributionPhoto")} *
            </label>
            <input
              id="photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              onChange={(event) => {
                setPhoto(event.target.files?.[0] ?? null);
                setFieldErrors((current) => ({
                  ...current,
                  photo: undefined,
                }));
              }}
              className={`${FIELD_CLASS} file:mr-4 file:rounded-full file:border-0 file:bg-beige-soft file:px-4 file:py-2 file:font-medium file:text-ink`}
            />
            <p className="mt-1 text-sm text-ink-soft">
              {t("photoUploadRules")}
            </p>
            <FieldError message={fieldErrors.photo && t(fieldErrors.photo)} />
          </div>
          <p className="rounded-xl bg-beige-soft/60 p-3 text-sm text-ink-soft">
            {t("photoPrivacyHint")}
          </p>
          <div>
            <label htmlFor="image-alt" className="font-medium text-ink">
              {t("photoDescription")} *
            </label>
            <input
              id="image-alt"
              value={entry.imageAlt}
              onChange={(event) => setField("imageAlt", event.target.value)}
              minLength={10}
              maxLength={250}
              required
              className={FIELD_CLASS}
            />
            <FieldError
              message={fieldErrors.imageAlt && t(fieldErrors.imageAlt)}
            />
          </div>
        </section>
      </fieldset>

      {formError && (
        <p role="alert" className="rounded-xl bg-clay/10 p-4 text-sm text-clay-deep">
          {formError}{" "}
          {formError === t("contributionSessionExpired") && (
            <a href="/login?next=%2Fcontribute" className="font-semibold underline">
              {t("logIn")}
            </a>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-palm px-6 py-4 font-semibold text-cream transition-colors hover:bg-palm-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? t("submittingContribution") : t("submitContribution")}
      </button>
    </form>
  );
}
