"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";
import EntryCard from "./EntryCard";
import { useLanguage } from "./LanguageProvider";
import { localizeLabel } from "@/lib/i18n";
export default function ArchiveBrowser({ items }) {
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [query, setQuery] = useState("");
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
    const normalizedQuery = query.trim().toLowerCase();
    return items
      .map((item) => {
        const title = localizeLabel(item.title, language).toLowerCase();
        const description = localizeLabel(
          item.description,
          language,
        ).toLowerCase();
        const contributor = item.contributor.toLowerCase();
        const searchableText = [title, description, contributor].join(" ");
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
  return (
    <div>
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <EntryCard key={item.id} item={item} view="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
