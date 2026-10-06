export function getSafeRedirectPath(value, fallback = "/") {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(value)
  ) {
    return fallback;
  }

  const parsed = new URL(value, "https://local-redirect.invalid");
  if (parsed.origin !== "https://local-redirect.invalid") {
    return fallback;
  }

  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
