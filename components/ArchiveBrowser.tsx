"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { ArchiveItem } from "@/lib/types";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import EntryCard from "./EntryCard";
import { useLanguage } from "./LanguageProvider";

const categories = [
  "Palm Leaf Preparation",
  "Weaving Techniques",
  "House Construction",
  "Attachment Techniques",
  "Maintenance & Repair",
  "Personal Stories",
  "Traditional Houses",
];

export default function ArchiveBrowser({ items }: { items: ArchiveItem[] }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : "All",
  );
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q.length === 0 ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.contributor.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [items, category, query]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex items-center gap-1 self-start sm:self-auto rounded-full border border-beige p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            aria-label="Grid view"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              view === "grid"
                ? "bg-palm text-cream"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            aria-pressed={view === "list"}
            aria-label="List view"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              view === "list"
                ? "bg-palm text-cream"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5">
        <CategoryFilter
          categories={categories}
          active={category}
          onChange={setCategory}
        />
      </div>

      <p className="mt-6 text-sm text-ink-soft" role="status">
        {filtered.length}{" "}
        {filtered.length === 1 ? t("entryFound") : t("entriesFound")}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-beige py-16 text-center">
          <p className="text-ink-soft">{t("noMatches")}</p>
        </div>
      ) : view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <EntryCard key={item.id} item={item} view="grid" />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {filtered.map((item) => (
            <EntryCard key={item.id} item={item} view="list" />
          ))}
        </div>
      )}
    </div>
  );
}
