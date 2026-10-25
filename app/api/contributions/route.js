import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-session";
import { validateContribution } from "@/lib/contribution-rules";
import {
  MAX_CONTRIBUTION_PHOTO_SIZE,
  validateContributionPhoto,
} from "@/lib/photo-validation";
import { createSupabaseServerClient } from "@/lib/supabase";

const BUCKET = "photos";

function responseError(message, status) {
  return NextResponse.json({ error: message }, { status });
}

function makeSlug(title) {
  const base =
    title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "community-contribution";
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function POST(request) {
  const requestUrl = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol
    ? forwardedProtocol.split(",")[0].trim()
    : requestUrl.protocol.slice(0, -1);
  const expectedOrigin = host ? `${protocol}://${host}` : requestUrl.origin;
  if (request.headers.get("origin") !== expectedOrigin) {
    return responseError("Request could not be verified. Please reload and try again.", 403);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_CONTRIBUTION_PHOTO_SIZE + 256 * 1024) {
    return responseError("The photo must be 10 MB or smaller.", 413);
  }

  const supabase = await createSupabaseServerClient();
  const { user, error: authError } = await getCurrentUser(supabase);

  if (authError) {
    console.error("Could not verify contribution session:", authError);
    return responseError(
      "We couldn't verify your session. Please try again in a moment.",
      503,
    );
  }
  if (!user) {
    return responseError("Please log in before submitting a contribution.", 401);
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("Could not check contributor role:", profileError);
    return responseError("We couldn't verify your contributor account. Please try again.", 500);
  }
  if (!profile || !["contributor", "editor", "admin"].includes(profile.role)) {
    return responseError(
      "Your account is not enabled for contributions. Please contact the archive team.",
      403,
    );
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error("Could not read contribution form data:", error);
    return responseError("The form could not be read. Please try again.", 400);
  }

  let input;
  try {
    input = JSON.parse(String(formData.get("entry") || ""));
  } catch {
    return responseError("Some contribution details are missing. Please review the form.", 400);
  }

  const { value, errors } = validateContribution(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", fieldErrors: errors },
      { status: 400 },
    );
  }

  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return responseError("Choose a photo to upload.", 400);
  }
  if (photo.size > MAX_CONTRIBUTION_PHOTO_SIZE) {
    return responseError("The photo must be 10 MB or smaller.", 413);
  }

  let photoBytes;
  try {
    photoBytes = Buffer.from(await photo.arrayBuffer());
  } catch (error) {
    console.error("Could not read contribution photo:", error);
    return responseError("We couldn't read that photo. Please choose another file.", 400);
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
  const { detectedType } = photoValidation;

  const objectPath = `${user.id}/${randomUUID()}.${detectedType.extension}`;
  let uploadError;
  try {
    ({ error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(objectPath, photoBytes, {
        contentType: detectedType.mime,
        cacheControl: "3600",
        upsert: false,
      }));
  } catch (error) {
    console.error("Contribution photo upload request failed:", error);
    return responseError(
      "We couldn't upload the photo. Please choose another image and try again.",
      502,
    );
  }

  if (uploadError) {
    console.error("Contribution photo upload failed:", uploadError);
    return responseError(
      "We couldn't upload the photo. Please choose another image and try again.",
      502,
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);

  let entry;
  let insertError;
  try {
    ({ data: entry, error: insertError } = await supabase
      .from("entries")
      .insert({
        owner: user.id,
        slug: makeSlug(value.title),
        title: value.title,
        description: value.description,
        category: value.category,
        topic_slugs: value.topicSlugs,
        contributor: value.contributor,
        location: value.location || null,
        entry_date: value.entryDate || null,
        image_path: publicUrl,
        image_alt: value.imageAlt,
        introduction: value.introduction,
        steps: value.steps,
        tips: value.tips,
        contributor_story: value.contributorStory || null,
        status: "pending",
      })
      .select("slug")
      .single());
  } catch (insertRequestError) {
    insertError = insertRequestError;
  }

  if (insertError) {
    console.error("Could not save contribution entry:", insertError);
    try {
      const { error: cleanupError } = await supabase.storage
        .from(BUCKET)
        .remove([objectPath]);
      if (cleanupError) {
        console.error("Could not remove unlinked contribution photo:", cleanupError);
      }
    } catch (cleanupError) {
      console.error("Could not clean up unlinked contribution photo:", cleanupError);
    }
    return responseError(
      "The photo uploaded, but we couldn't save your entry. Please try submitting again.",
      500,
    );
  }

  return NextResponse.json({ slug: entry.slug }, { status: 201 });
}
