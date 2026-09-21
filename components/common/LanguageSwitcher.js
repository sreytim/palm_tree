"use client";
import { useLanguage } from "./LanguageProvider";
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  return (
    <div
      className="language-switcher"
      role="group"
      aria-label="Choose language"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("km")}
        aria-pressed={language === "km"}
      >
        ខ្មែរ
      </button>
    </div>
  );
}
