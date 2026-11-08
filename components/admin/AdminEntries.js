"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import {
  MIN_RETURN_NOTE_LENGTH,
  STATUS_LABEL_KEYS,
  SUBMISSION_STATUSES,
} from "@/lib/submission-status";

const STATUS_STYLES = {
  pending: "border-clay/40 bg-beige-soft text-clay-deep",
  published: "border-palm/40 bg-palm text-cream",
  returned: "border-clay bg-clay/10 text-clay-deep",
};

const FILTERS = ["all", ...SUBMISSION_STATUSES];

/**
 * The archive team's entry list: every status, searchable, with the actions
 * that migration 0012 allows (editors moderate pending/returned rows, admins
 * manage everything).
 */
export default function AdminEntries({ initialEntries, role, justUpdated = false }) {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState({});
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");

  const isAdmin = role === "admin";

  const visibleEntries = useMemo(() => {
    const term = query.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesFilter = filter === "all" || entry.status === filter;
      if (!matchesFilter) {
        return false;
      }
      if (term === "") {
        return true;
      }

      return [entry.title, entry.contributor, entry.category]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [entries, filter, query]);

  const updateEntry = async (entry, body, failureKey) => {
    setWorkingId(entry.id);
    setError("");

    try {
      const response = await fetch("/api/admin/contributions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id, ...body }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Could not update the entry:", result);
        setError(result.errorKey ? t(result.errorKey) : t(failureKey));
        return;
      }

      setEntries((current) =>
        current.map((item) =>
          item.id === entry.id
            ? {
                ...item,
                status: result.status ?? item.status,
                reviewNote: result.reviewNote ?? item.reviewNote,
                featured: body.featured ?? item.featured,
              }
            : item,
        ),
      );
      router.refresh();
    } catch (requestError) {
      console.error("Entry update request failed:", requestError);
      setError(t(failureKey));
    } finally {
      setWorkingId(null);
    }
  };

  const review = (entry, status) => {
    const reviewNote = (notes[entry.id] ?? "").trim();
    if (status === "returned" && reviewNote.length < MIN_RETURN_NOTE_LENGTH) {
      setError(t("reviewNoteRequired"));
      return;
    }

    updateEntry(entry, { status, reviewNote }, "reviewUpdateFailed");
  };

  const removeEntry = async (entry) => {
    if (!window.confirm(t("deleteEntryConfirm"))) {
      return;
    }

    setWorkingId(entry.id);
    setError("");

    try {
      const response = await fetch(
        `/api/entries/${encodeURIComponent(entry.id)}`,
        { method: "DELETE" },
      );
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("Could not delete the entry:", result);
        setError(result.errorKey ? t(result.errorKey) : t("deleteEntryFailed"));
        return;
      }

      setEntries((current) => current.filter((item) => item.id !== entry.id));
      router.refresh();
    } catch (requestError) {
      console.error("Delete entry request failed:", requestError);
      setError(t("deleteEntryFailed"));
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay-deep">
          {t("adminArea")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium text-ink sm:text-4xl">
          {t("manageEntries")}
        </h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-ink-soft">
          {t("manageEntriesHint")}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("searchEntries")}
          aria-label={t("searchEntries")}
          className="w-full rounded-xl border border-beige bg-cream px-4 py-3 text-ink outline-none focus:border-palm focus:ring-2 focus:ring-palm/20 sm:max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === value
                  ? "border-palm bg-palm text-cream"
                  : "border-beige bg-cream text-ink hover:bg-beige-soft"
              }`}
            >
              {value === "all" ? t("allStatuses") : t(STATUS_LABEL_KEYS[value])}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-6 rounded-xl bg-clay/10 p-4 text-sm text-clay-deep"
        >
          {error}
        </p>
      )}

      {justUpdated && (
        <p
          role="status"
          className="mb-6 rounded-xl bg-palm/10 p-4 text-sm text-palm-deep"
        >
          {t("submissionUpdated")}
        </p>
      )}

      <p className="mb-4 text-sm text-ink-soft">
        {visibleEntries.length} {t("entriesShown")}
      </p>

      {visibleEntries.length === 0 ? (
        <p className="rounded-2xl border border-beige bg-cream-deep p-6 text-ink-soft">
          {t("noEntriesMatch")}
        </p>
      ) : (
        <ul className="space-y-4">
          {visibleEntries.map((entry) => {
            const busy = workingId === entry.id;
            const canDelete = isAdmin;

            return (
              <li
                key={entry.id}
                className="rounded-3xl border border-beige bg-cream p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay-deep">
                      {localizeLabel(entry.category, language)}
                      {entry.isSample ? ` · ${t("sampleEntry")}` : ""}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-medium text-ink">
                      {localizeLabel(entry.title, language)}
                    </h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      {entry.contributor ? `${entry.contributor} · ` : ""}
                      {new Date(entry.createdAt).toLocaleDateString()}
                      {entry.date ? ` · ${entry.date}` : ""}
                      {entry.featured ? ` · ${t("featuredLabel")}` : ""}
                    </p>
                    {entry.reviewNote && (
                      <p className="mt-2 text-sm text-clay-deep">
                        <strong className="text-ink">{t("reviewNoteLabel")}</strong>{" "}
                        {entry.reviewNote}
                      </p>
                    )}
                  </div>
                  <span
                    className={`inline-flex shrink-0 self-start rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.15em] ${
                      STATUS_STYLES[entry.status] ??
                      "border-beige bg-cream-deep text-ink-soft"
                    }`}
                  >
                    {t(STATUS_LABEL_KEYS[entry.status] ?? entry.status)}
                  </span>
                </div>


                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/archive/${encodeURIComponent(entry.slug)}`}
                    className="rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep hover:bg-beige-soft"
                  >
                    {t("previewSubmission")}
                  </Link>
                  <Link
                    href={`/admin/entries/${encodeURIComponent(entry.id)}/edit`}
                    className="rounded-full border border-palm px-4 py-2 text-sm font-medium text-palm-deep hover:bg-beige-soft"
                  >
                    {t("editEntry")}
                  </Link>
                  {isAdmin && entry.status !== "published" && (
                    <button
                      type="button"
                      onClick={() => review(entry, "published")}
                      disabled={workingId !== null}
                      className="rounded-full bg-palm px-4 py-2 text-sm font-semibold text-cream hover:bg-palm-deep disabled:cursor-wait disabled:opacity-60"
                    >
                      {busy ? t("savingReview") : t("publishSubmission")}
                    </button>
                  )}
                  {isAdmin && entry.status !== "returned" && (
                    <button
                      type="button"
                      onClick={() => review(entry, "returned")}
                      disabled={workingId !== null}
                      className="rounded-full border border-clay px-4 py-2 text-sm font-semibold text-clay-deep hover:bg-clay/10 disabled:cursor-wait disabled:opacity-60"
                    >
                      {t("returnSubmission")}
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() =>
                        updateEntry(
                          entry,
                          { featured: !entry.featured },
                          "reviewUpdateFailed",
                        )
                      }
                      disabled={workingId !== null}
                      className="rounded-full border border-beige px-4 py-2 text-sm font-medium text-ink hover:bg-beige-soft disabled:cursor-wait disabled:opacity-60"
                    >
                      {entry.featured ? t("unfeatureEntry") : t("featureEntry")}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => removeEntry(entry)}
                      disabled={workingId !== null}
                      className="rounded-full border border-clay px-4 py-2 text-sm font-semibold text-clay-deep hover:bg-clay/10 disabled:cursor-wait disabled:opacity-60"
                    >
                      {t("deleteEntry")}
                    </button>
                  )}
                </div>

                {!isAdmin && (
                  <p className="mt-3 text-xs text-ink-soft">
                    {t("editorContentOnlyHint")}
                  </p>
                )}

                {isAdmin && entry.status !== "returned" && (
                  <details className="mt-4 rounded-2xl bg-cream-deep p-4">
                    <summary className="cursor-pointer text-sm font-medium text-ink">
                      {t("reviewNoteLabel")}
                    </summary>
                    <textarea
                      value={notes[entry.id] ?? ""}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [entry.id]: event.target.value,
                        }))
                      }
                      rows={3}
                      maxLength={500}
                      placeholder={t("reviewNotePlaceholder")}
                      className="mt-3 w-full rounded-xl border border-beige bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-palm focus:ring-2 focus:ring-palm/20"
                    />
                    <p className="mt-1 text-xs text-ink-soft">
                      {t("reviewNoteHint")}
                    </p>
                  </details>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

