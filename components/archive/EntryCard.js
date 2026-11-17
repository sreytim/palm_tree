import ArchiveCard from "./ArchiveCard";

/**
 * Kept as the archive's card entry point. Every caller passes a loaded entry,
 * so there is no untranslated fallback copy here: a missing item renders
 * nothing rather than a half-English card.
 */
export default function EntryCard({ item, view = "grid" }) {
  if (!item) {
    return null;
  }

  return <ArchiveCard item={item} view={view} />;
}
