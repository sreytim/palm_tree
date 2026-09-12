"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";
import EntryCard from "./EntryCard";
import { useLanguage } from "./LanguageProvider";
export default function ArchiveBrowser({ items }) {
  const { t } = useLanguage();
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
    return items.filter((item) => {
      const matchesCategory =
        initialCategory === null ||
        initialCategory === "All" ||
        item.category === initialCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.contributor.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, initialCategory, query]);
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
                onClick={() => setQuery(suggestion.search)}
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
