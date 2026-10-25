"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";

export default function ReviewQueue({ initialEntries }) {
  const { t } = useLanguage();
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");

  const reviewEntry = async (entry, status) => {
    setWorkingId(entry.id);
    setError("");
    try {
      const response = await fetch("/api/admin/contributions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, status }),
      });
      const result = await response.json();
      if (!response.ok) {
        console.error("Could not update submission status:", result);
        setError(t("reviewUpdateFailed"));
        return;
      }

      setEntries((current) => current.filter((item) => item.id !== entry.id));
      router.refresh();
    } catch (requestError) {
      console.error("Submission review request failed:", requestError);
      setError(t("reviewUpdateFailed"));
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay-deep">
          {t("reviewSubmissions")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          {t("pendingSubmissions")}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t("reviewSubmissionsHint")}
        </p>
      </div>

      {error && (
        <p className="mb-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep" role="alert">
          {error}
        </p>
      )}

      {entries.length === 0 ? (
        <p className="rounded-2xl border border-beige bg-cream-deep p-6 text-ink-soft">
          {t("noPendingSubmissions")}
        </p>
      ) : (
        <ul className="space-y-6">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-3xl border border-beige bg-cream p-5 sm:p-8"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay-deep">
                    {entry.category}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium text-ink">
                    {entry.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {entry.description}
                  </p>
                  {entry.location && (
                    <p className="mt-3 text-sm text-ink-soft">
                      {entry.location}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap gap-3">
                  <a
                    href={entry.image_path}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep hover:bg-beige-soft"
                  >
                    {t("viewSubmissionPhoto")}
                  </a>
                  <a
                    href={`/archive/${encodeURIComponent(entry.slug)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep hover:bg-beige-soft"
                  >
                    {t("previewSubmission")}
                  </a>
                </div>
              </div>

              <details className="mt-5 rounded-2xl bg-cream-deep p-4">
                <summary className="cursor-pointer font-medium text-ink">
                  {t("submissionDetails")}
                </summary>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">
                  <p>
                    <strong className="text-ink">{t("introduction")}: </strong>
                    {entry.introduction}
                  </p>
                  {entry.steps?.length > 0 && (
                    <div>
                      <strong className="text-ink">{t("contributionSteps")}</strong>
                      <ol className="mt-2 list-decimal space-y-2 pl-5">
                        {entry.steps.map((step, index) => (
                          <li key={`${step.title}-${index}`}>
                            <strong className="text-ink">{step.title}: </strong>
                            {step.description}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {entry.tips?.length > 0 && (
                    <div>
                      <strong className="text-ink">{t("contributionTips")}</strong>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {entry.tips.map((tip, index) => (
                          <li key={`${tip}-${index}`}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.contributor_story && (
                    <p>
                      <strong className="text-ink">{t("contributionStory")}: </strong>
                      {entry.contributor_story}
                    </p>
                  )}
                  <p className="text-xs">
                    {t("submittedOn")}:{" "}
                    {new Date(entry.created_at).toLocaleString()}
                    {entry.image_alt && (
                      <>
                        {" · "}
                        {t("photoDescription")}: {entry.image_alt}
                      </>
                    )}
                  </p>
                </div>
              </details>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => reviewEntry(entry, "published")}
                  disabled={workingId !== null}
                  className="rounded-full bg-palm px-5 py-2.5 text-sm font-semibold text-cream hover:bg-palm-deep disabled:cursor-wait disabled:opacity-60"
                >
                  {workingId === entry.id
                    ? t("savingReview")
                    : t("publishSubmission")}
                </button>
                <button
                  type="button"
                  onClick={() => reviewEntry(entry, "returned")}
                  disabled={workingId !== null}
                  className="rounded-full border border-clay px-5 py-2.5 text-sm font-semibold text-clay-deep hover:bg-clay/10 disabled:cursor-wait disabled:opacity-60"
                >
                  {t("returnSubmission")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
