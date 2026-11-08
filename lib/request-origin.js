/**
 * Same-origin check for state-changing API routes.
 *
 * Session cookies are sent automatically by the browser, so a cross-site form
 * post could otherwise create or moderate entries on behalf of a signed-in
 * user. Every mutating route refuses requests whose `Origin` header does not
 * match the host that served the request.
 *
 * Behind a proxy (Vercel), `x-forwarded-host` / `x-forwarded-proto` carry the
 * address the browser actually used.
 */
export function getExpectedOrigin(request) {
  const requestUrl = new URL(request.url);
  const host =
    request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto");
  const protocol = forwardedProtocol
    ? forwardedProtocol.split(",")[0].trim()
    : requestUrl.protocol.slice(0, -1);

  return host ? `${protocol}://${host}` : requestUrl.origin;
}

export function isSameOriginRequest(request) {
  return request.headers.get("origin") === getExpectedOrigin(request);
}

export const ORIGIN_MISMATCH_MESSAGE =
  "Request could not be verified. Please reload and try again.";
