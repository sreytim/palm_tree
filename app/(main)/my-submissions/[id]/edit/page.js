import { notFound, redirect } from "next/navigation";
import SubmissionEditor from "@/components/contribute/SubmissionEditor";
import { getCurrentUser } from "@/lib/auth-session";
import {
  EDITABLE_ENTRY_COLUMNS,
  toContributionForm,
} from "@/lib/entry-mapping";
import { canOwnerEdit, isEntryId } from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

export const metadata = {
  title: "Edit submission | Palm-Leaf Archive",
};

/**
 * The author corrects a pending or returned submission. Row Level Security
 * (`entries_owner_update`) only allows writes while the entry is pending or
 * returned, so this page refuses to open for a published entry. Saving a
 * returned entry puts it back in the review queue.
 */
export default async function EditSubmissionPage({ params }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify edit-submission session:", authError);
  }

  if (!user || authError) {
    redirect(`/login?next=%2Fmy-submissions%2F${encodeURIComponent(id)}%2Fedit`);
  }

  if (!isEntryId(id)) {
    notFound();
  }

  const { data: entry, error: entryError } = await supabase
    .from("entries")
    .select(EDITABLE_ENTRY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (entryError) {
    console.error("Could not load the submission being edited:", entryError);
    notFound();
  }

  // RLS already hides other authors' rows; the owner check keeps the reason
  // explicit if a policy ever widens read access.
  if (!entry || entry.owner !== user.id) {
    notFound();
  }

  if (!canOwnerEdit(entry.status)) {
    redirect("/my-submissions");
  }

  return (
    <SubmissionEditor
      entryId={entry.id}
      initialEntry={toContributionForm(entry)}
      status={entry.status}
      reviewNote={entry.review_note}
    />
  );
}
