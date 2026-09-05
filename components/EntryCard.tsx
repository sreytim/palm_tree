import type { ArchiveItem } from "@/lib/types";
import ArchiveCard from "./ArchiveCard";

export default function EntryCard({
  item,
  view = "grid",
}: {
  item: ArchiveItem;
  view?: "grid" | "list";
}) {
  return <ArchiveCard item={item} view={view} />;
}
