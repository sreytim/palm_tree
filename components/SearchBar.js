"use client";
import { Search, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search the archive…",
}) {
  const { t } = useLanguage();
  return (
    <div className="search-bar relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          placeholder === "Search the archive…"
            ? t("searchArchive")
            : placeholder
        }
        aria-label={t("searchArchive")}
        className="search-bar-input w-full rounded-full border border-beige bg-cream pl-11 pr-12 py-3.5 text-sm text-ink placeholder:text-ink-soft/70 appearance-none shadow-none rounded-[9999px] transition-shadow focus:outline-none focus:ring-0 focus:border-beige"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("clearSearch")}
          className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-ink-soft transition-colors hover:bg-beige/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-palm"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
