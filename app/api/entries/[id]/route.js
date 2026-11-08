import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { describeContributionWriteError } from "@/lib/contribution-errors";
import { validateContribution } from "@/lib/contribution-rules";
import { EDITABLE_ENTRY_COLUMNS } from "@/lib/entry-mapping";
import {
  getPhotoStoragePath,
  MAX_CONTRIBUTION_PHOTO_SIZE,
  validateContributionPhoto,
} from "@/lib/photo-validation";
import {
  isSameOriginRequest,
  ORIGIN_MISMATCH_MESSAGE,
} from "@/lib/request-origin";
import {
  canManageEntries,
  canOwnerEdit,
  isAdminRole,
  isEntryId,
} from "@/lib/submission-status";
import { createSupabaseServerClient } from "@/lib/supabase";

const BUCKET = "photos";

function responseError(message, status, errorKey) {
  return NextResponse.json(
    errorKey ? { error: message, errorKey } : { error: message },
    { status },
  );
}

/**
 * Session + profile role for a mutating request. Returns `failure` when the
 * caller cannot be identified, so the handler can answer and stop.
 */
async function readSession() {
  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify entry session:", authError);
    return {
      failure: {
        message: "We couldn't verify your session. Please try again.",
        status: 503,
      },
    };
  }

  if (!user) {
    return {
      failure: {
        message: "Please log in to manage this entry.",
        status: 401,
        errorKey: "contributionSessionExpired",
      },
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not verify entry permissions:", profileError);
    return {
      failure: {
        message: "We couldn't verify your account permissions. Please try again.",
        status: 500,
      },
    };
  }

  return { supabase, user, role: profile?.role ?? null };
}

async function readEntry(supabase, id) {
  const { data, error } = await supabase
    .from("entries")
    .select(EDITABLE_ENTRY_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  return { entry: data ?? null, error };
}

/**
 * Authors manage their own unapproved entries; editors and admins manage any
 * entry. Row Level Security enforces the same rule a second time.
 */
function canManageEntry(entry, user, role) {
  if (canManageEntries(role)) {
    return true;
  }

  return entry.owner === user.id && canOwnerEdit(entry.status);
}

async function removePhotoPath(supabase, path) {
  if (!path) {
    return;
  }

  try {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      console.error("Could not remove a contribution photo:", error);
    }
  } catch (error) {
    console.error("Could not remove a contribution photo:", error);
  }
}

async function removeUnreferencedPhoto(supabase, photoUrl) {
  await removePhotoPath(supabase, getPhotoStoragePath(photoUrl));
}

/**
 * Edit an entry.
 *
 * The author may correct a pending or returned submission; saving a returned
 * entry puts it back in the review queue automatically (the database trigger
 * moves `returned` to `pending` and clears the old review note). Editors and
 * admins may correct any entry, including a published one.
 *
 * The request is multipart when a new photo is attached, JSON otherwise.
 */
export async function PATCH(request, { params }) {
  if (!isSameOriginRequest(request)) {
    return responseError(ORIGIN_MISMATCH_MESSAGE, 403);
  }

  const session = await readSession();
  if (session.failure) {
    return responseError(
      session.failure.message,
      session.failure.status,
      session.failure.errorKey,
    );
  }

  const { supabase, user, role } = session;
  const { id } = await params;
  if (!isEntryId(id)) {
    return responseError("Choose a valid entry to edit.", 400);
  }

  const { entry, error: entryError } = await readEntry(supabase, id);
  if (entryError) {
    console.error("Could not load the entry being edited:", entryError);
    return responseError("We couldn't load this entry. Please try again.", 500);
  }
  if (!entry) {
    return responseError("This entry could not be found.", 404);
  }
  if (!canManageEntry(entry, user, role)) {
    return responseError(
      "This entry can no longer be edited. Published entries are managed by the archive team.",
      403,
      "contributionNotEditable",
    );
  }

  let payload = null;
  let photo = null;

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      console.error("Could not read the entry edit form:", error);
      return responseError("The form could not be read. Please try again.", 400);
    }

    try {
      payload = JSON.parse(String(formData.get("entry") || ""));
    } catch {
      return responseError(
        "Some entry details are missing. Please review the form.",
        400,
      );
    }

    const candidate = formData.get("photo");
    if (candidate instanceof File && candidate.size > 0) {
      photo = candidate;
    }
  } else {
    try {
      payload = await request.json();
    } catch (error) {
      console.error("Could not read the entry edit request:", error);
      return responseError("The edit request could not be read.", 400);
    }
  }

  const { value, errors } = validateContribution(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors: errors },
      { status: 400 },
    );
  }

  const update = {
    title: value.title,
    description: value.description,
    category: value.category,
    topic_slugs: value.topicSlugs,
    contributor: value.contributor,
    location: value.location || null,
    entry_date: value.entryDate || null,
    image_alt: value.imageAlt,
    introduction: value.introduction,
    steps: value.steps,
    tips: value.tips,
    contributor_story: value.contributorStory || null,
  };

  let uploadedPath = null;
  if (photo) {
    if (photo.size > MAX_CONTRIBUTION_PHOTO_SIZE) {
      return responseError("The photo must be 10 MB or smaller.", 413);
    }

    let photoBytes;
    try {
      photoBytes = Buffer.from(await photo.arrayBuffer());
    } catch (error) {
      console.error("Could not read the replacement photo:", error);
      return responseError(
        "We couldn't read that photo. Please choose another file.",
        400,
      );
    }

    const photoValidation = validateContributionPhoto({
      mime: photo.type,
      size: photo.size,
      bytes: photoBytes,
    });
    if (photoValidation.error === "photoSize") {
      return responseError("The photo must be 10 MB or smaller.", 413);
    }
    if (photoValidation.error) {
      return responseError("Choose a valid JPEG, PNG, or WebP photo.", 400);
    }

    uploadedPath = `${user.id}/${randomUUID()}.${photoValidation.detectedType.extension}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uploadedPath, photoBytes, {
        contentType: photoValidation.detectedType.mime,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Replacement photo upload failed:", uploadError);
      return responseError(
        "We couldn't upload the photo. Please choose another image and try again.",
        502,
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(uploadedPath);
    update.image_path = publicUrl;
  }

  const { data: saved, error: updateError } = await supabase
    .from("entries")
    .update(update)
    .eq("id", id)
    .select("id, slug, status")
    .maybeSingle();

  if (updateError || !saved) {
    if (uploadedPath) {
      await removePhotoPath(supabase, uploadedPath);
    }

    if (!updateError) {
      return responseError("This entry could not be updated.", 409);
    }

    const failure = describeContributionWriteError(updateError);
    return responseError(failure.message, failure.status, failure.errorKey);
  }

  if (uploadedPath && entry.image_path) {
    await removeUnreferencedPhoto(supabase, entry.image_path);
  }

  return NextResponse.json({
    id: saved.id,
    slug: saved.slug,
    status: saved.status,
  });
}


/**
 * Withdraw or delete an entry.
 *
 * - the author may withdraw a pending or returned submission;
 * - an editor may remove a pending or returned submission (spam, duplicates);
 * - an admin may delete any entry, including a published one.
 *
 * The attached photo is removed afterwards: once no entry references it, the
 * `photos_owner_delete` storage policy allows the delete.
 */
export async function DELETE(request, { params }) {
  if (!isSameOriginRequest(request)) {
    return responseError(ORIGIN_MISMATCH_MESSAGE, 403);
  }

  const session = await readSession();
  if (session.failure) {
    return responseError(
      session.failure.message,
      session.failure.status,
      session.failure.errorKey,
    );
  }

  const { supabase, user, role } = session;
  const { id } = await params;
  if (!isEntryId(id)) {
    return responseError("Choose a valid entry to delete.", 400);
  }

  const { entry, error: entryError } = await readEntry(supabase, id);
  if (entryError) {
    console.error("Could not load the entry being deleted:", entryError);
    return responseError("We couldn't load this entry. Please try again.", 500);
  }
  if (!entry) {
    return responseError("This entry could not be found.", 404);
  }

  const isOwner = entry.owner === user.id;
  // Removing a row is the archive owner's call; an author may only withdraw
  // their own unapproved submission.
  const allowedToDelete = isAdminRole(role)
    ? true
    : isOwner && canOwnerEdit(entry.status);

  if (!allowedToDelete) {
    return responseError(
      isOwner
        ? "A published entry cannot be withdrawn. Please contact the archive team."
        : "You cannot delete this entry.",
      403,
      "contributionNotDeletable",
    );
  }

  const { data: deleted, error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    console.error("Could not delete the entry:", deleteError);
    return responseError(
      "We couldn't delete this entry. Please try again.",
      500,
    );
  }
  if (!deleted) {
    return responseError("This entry could not be deleted.", 409);
  }

  await removeUnreferencedPhoto(supabase, entry.image_path);

  return NextResponse.json({ deleted: true });
}

