"use client";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "../common/SearchBar";
import CategoryFilter from "./CategoryFilter";
import FadeIn from "../common/FadeIn";
import EntryCard from "./EntryCard";
import { useLanguage } from "../common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { getTopicBySlug } from "@/data/topics";
import {
  ALL_CATEGORIES,
  buildCategoryOptions,
  matchesCategory,
  resolveActiveCategory,
} from "@/lib/archive-categories";
import { paginate, pageNumbers } from "@/lib/pagination";
import { useResponsivePageSize } from "@/lib/use-responsive-page-size";

/**
 * Search compares lowercased text with hyphens treated as spaces, so that
 * "Palm-Leaf Houses" and "Palm Leaf Houses" match the same records — and the
 * hyphenated empty-state suggestions keep working now that topic names, rather
 * than entry titles, carry those labels.
 */
const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[-–—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export default function ArchiveBrowser({ items, pageSize }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(
    () => searchParams.get("category") ?? ALL_CATEGORIES,
  );
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const listTopRef = useRef(null);

  // `pageSize` is either a fixed number or `{ small, large }` for a size that
  // follows the layout. The hook must run unconditionally — hooks cannot be
  // conditional — so it always runs and is only used for the responsive form.
  const isResponsive = typeof pageSize === "object" && pageSize !== null;
  const responsivePageSize = useResponsivePageSize(
    isResponsive ? pageSize.small : undefined,
    isResponsive ? pageSize.large : undefined,
  );
  const resolvedPageSize = isResponsive ? responsivePageSize : pageSize;
  // Nothing else is needed when the size changes: `paginate` clamps the page
  // number, so crossing the breakpoint can never strand the list on a page that
  // no longer exists.

  // Chips are built from the categories the entries actually use, ordered
  // like the contribution form, so a contributor recognises the list they
  // chose from and no chip can lead to an empty page of its own accord.
  const categoryOptions = useMemo(() => buildCategoryOptions(items), [items]);

  // A category from the address bar that no longer matches anything shows
  // everything rather than an unexplained empty page.
  const activeCategory = resolveActiveCategory(category, categoryOptions);

  const suggestions = [
    { label: "suggestionPalmLeafHouses", search: "Palm-Leaf Houses" },
    { label: "suggestionRoofCovering", search: "Roof Covering" },
    { label: "suggestionWallCovering", search: "Wall Covering" },
    { label: "suggestionLeafWeaving", search: "Leaf Weaving" },
    {
      label: "suggestionPalmLeafPreparation",
      search: "Palm-Leaf Preparation",
    },
  ];
  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query);
    return items
      .map((item) => {
        const title = normalize(localizeLabel(item.title, language));
        const description = normalize(
          localizeLabel(item.description, language),
        );
        // The archive is bilingual, but the language someone types a query in
        // is not necessarily the language the UI is set to, so both languages
        // of every searchable field are indexed. Topic names are included
        // because they carry the subject labels the empty state suggests.
        const topicsForItem = (item.topicSlugs ?? [])
          .map((slug) => getTopicBySlug(slug))
          .filter(Boolean);
        const searchableText = normalize(
          [
            localizeLabel(item.title, "en"),
            localizeLabel(item.title, "km"),
            localizeLabel(item.description, "en"),
            localizeLabel(item.description, "km"),
            ...topicsForItem.flatMap((topic) => [
              topic.name,
              localizeLabel(topic.name, "km"),
              topic.description ?? "",
              localizeLabel(topic.description ?? "", "km"),
            ]),
          ].join(" "),
        );
        const matchesQuery =
          normalizedQuery.length === 0 ||
          searchableText.includes(normalizedQuery);
        const relevance =
          (title === normalizedQuery
            ? 3
            : title.includes(normalizedQuery)
              ? 2
              : 0) +
          (description.includes(normalizedQuery) ? 1 : 0);

        return { item, matchesQuery, relevance };
      })
      .filter(({ item, matchesQuery }) => {
        return matchesCategory(item, activeCategory) && matchesQuery;
      })
      .sort((first, second) => second.relevance - first.relevance)
      .map(({ item }) => item);
  }, [items, activeCategory, language, query]);

  // Pagination applies to the filtered set, so search results paginate too.
  // `paginate` clamps the page number, which means a shrinking result set (for
  // example after typing a search) can never leave the browser stranded on a
  // page that no longer exists. With no `pageSize`, nothing is paginated.
  const { items: visible, currentPage, totalPages, paginated } = paginate(
    filtered,
    page,
    resolvedPageSize,
  );

  const goToPage = (next) => {
    setPage(next);
    listTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
    // Keep the address bar shareable without a server round trip, so a
    // filtered view can be bookmarked or sent to someone else.
    const params = new URLSearchParams(window.location.search);
    if (next === ALL_CATEGORIES) {
      params.delete("category");
    } else {
      params.set("category", next);
    }
    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${queryString ? `?${queryString}` : ""}`,
    );
  };

  const hasQuery = normalize(query).length > 0;

  return (
    <div ref={listTopRef}>
      {/* Search and the category dropdown share one row; on phones the
          dropdown drops below the field so neither control gets squashed. */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:flex-1">
          <SearchBar
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />
        </div>

        {categoryOptions.length > 0 && (
          <CategoryFilter
            categories={categoryOptions}
            active={activeCategory}
            onChange={changeCategory}
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-beige px-6 py-12 text-center">
          <p className="font-display text-xl font-medium text-ink">
            {hasQuery ? t("noResultsTitle") : t("noCategoryResultsTitle")}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {hasQuery ? t("noResultsPrompt") : t("noCategoryResultsHint")}
          </p>
          {!hasQuery && (
            <button
              type="button"
              onClick={() => changeCategory(ALL_CATEGORIES)}
              className="mt-5 inline-flex rounded-full border border-palm px-5 py-2.5 text-sm font-semibold text-palm-deep transition-colors hover:bg-beige-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-palm focus-visible:ring-offset-2"
            >
              {t("showAllCategories")}
            </button>
          )}
          {hasQuery && (
            <div className="mx-auto mt-5 flex max-w-3xl flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.search}
                  type="button"
                  onClick={() => setQuery(t(suggestion.label))}
                  className="rounded-full border border-beige bg-cream px-4 py-2 text-sm text-ink-soft transition-colors hover:border-palm hover:text-palm-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-palm focus-visible:ring-offset-2"
                >
                  {t(suggestion.label)}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item, index) => (
              <FadeIn
                key={item.id}
                delay={(index % 3) * 80}
                className="h-full"
              >
                <EntryCard item={item} view="grid" />
              </FadeIn>
            ))}
          </div>

          {paginated && (
            <nav
              aria-label={t("pagination")}
              className="mt-10 flex flex-wrap items-center justify-center gap-2"
            >
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label={t("previousPage")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-beige bg-cream text-ink-soft transition-colors hover:border-palm hover:text-palm-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-palm focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-beige disabled:hover:text-ink-soft"
              >
                <ChevronLeft size={18} />
              </button>

              {pageNumbers(totalPages).map((number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => goToPage(number)}
                  aria-current={number === currentPage ? "page" : undefined}
                  aria-label={`${t("goToPage")} ${number}`}
                  className={`h-10 w-10 rounded-full border text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-palm focus-visible:ring-offset-2 ${
                    number === currentPage
                      ? "border-palm bg-palm text-cream"
                      : "border-beige bg-cream text-ink-soft hover:border-palm hover:text-palm-deep"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label={t("nextPage")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-beige bg-cream text-ink-soft transition-colors hover:border-palm hover:text-palm-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-palm focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-beige disabled:hover:text-ink-soft"
              >
                <ChevronRight size={18} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
