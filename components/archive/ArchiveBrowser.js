"use client";
import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "../common/SearchBar";
import EntryCard from "./EntryCard";
import { useLanguage } from "../common/LanguageProvider";
import { localizeLabel } from "@/lang/i18n";
import { getTopicBySlug } from "@/data/topics";
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
  const initialCategory = searchParams.get("category");
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
        const contributor = normalize(item.contributor);
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
            item.contributor,
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
          (description.includes(normalizedQuery) ? 1 : 0) +
          (contributor.includes(normalizedQuery) ? 1 : 0);

        return { item, matchesQuery, relevance };
      })
      .filter(({ item, matchesQuery }) => {
        const matchesCategory =
          initialCategory === null ||
          initialCategory === "All" ||
          item.category === initialCategory;
        return matchesCategory && matchesQuery;
      })
      .sort((first, second) => second.relevance - first.relevance)
      .map(({ item }) => item);
  }, [items, initialCategory, language, query]);

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

  return (
    <div ref={listTopRef}>
      <div className="w-full">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-beige px-6 py-12 text-center">
          <p className="font-display text-xl font-medium text-ink">
            {t("noResultsTitle")}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {t("noResultsPrompt")}
          </p>
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
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item) => (
              <EntryCard key={item.id} item={item} view="grid" />
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
