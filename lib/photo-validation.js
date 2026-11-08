export const MAX_CONTRIBUTION_PHOTO_SIZE = 10 * 1024 * 1024;

export function detectImageType(bytes) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return { mime: "image/jpeg", extension: "jpg" };
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes.toString("ascii", 1, 4) === "PNG" &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return { mime: "image/png", extension: "png" };
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mime: "image/webp", extension: "webp" };
  }
  return null;
}

export function validateContributionPhoto({ mime, size, bytes }) {
  if (size > MAX_CONTRIBUTION_PHOTO_SIZE) {
    return { error: "photoSize", detectedType: null };
  }

  const detectedType = detectImageType(bytes);
  if (!detectedType || mime !== detectedType.mime) {
    return { error: "photoType", detectedType: null };
  }

  return { error: null, detectedType };
}

// The `photos` bucket is public, so an entry stores the full public URL. The
// storage API (remove/update) needs the object path inside the bucket, which is
// everything after `/photos/`.
const PHOTOS_PUBLIC_MARKER = "/storage/v1/object/public/photos/";

/**
 * `https://<ref>.supabase.co/storage/v1/object/public/photos/<uid>/<file>.jpg`
 *   -> `<uid>/<file>.jpg`
 * Returns null for anything that is not a photo in that bucket.
 */
export function getPhotoStoragePath(url) {
  if (typeof url !== "string") {
    return null;
  }

  const markerIndex = url.indexOf(PHOTOS_PUBLIC_MARKER);
  if (markerIndex === -1) {
    return null;
  }

  const path = url
    .slice(markerIndex + PHOTOS_PUBLIC_MARKER.length)
    .split("?")[0]
    .split("#")[0];

  if (path === "") {
    return null;
  }

  try {
    return decodeURIComponent(path);
  } catch {
    return null;
  }
}

