// Helpers for the password recovery flow.
//
// The recovery link must only be able to change the password. To keep that
// promise, the recovery flow runs on its own Supabase client, which keeps
// the session created from the recovery link in a separate cookie instead of
// the application's session cookie. Opening a recovery link therefore never
// signs the user in to the archive - the link only unlocks the form that
// sets a new password.
//
// These helpers are deliberately free of React and Supabase imports so the
// rules can be unit tested in isolation.

export const RECOVERY_REDIRECT_PATH = "/reset-password";

const FALLBACK_RECOVERY_STORAGE_KEY = "sb-recovery";
const PKCE_CODE_PARAM = "code";
const PKCE_FLOW_ID_PARAM = "sb_flow_id";
const TOKEN_HASH_PARAM = "token_hash";
const TYPE_PARAM = "type";
// Mirrors the pattern the Supabase client uses to validate a PKCE flow id.
const PKCE_FLOW_ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/;

function getProjectRef(supabaseUrl) {
  if (typeof supabaseUrl !== "string" || supabaseUrl.trim() === "") {
    return null;
  }

  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

export function getRecoveryStorageKey(supabaseUrl) {
  const projectRef = getProjectRef(supabaseUrl);
  return projectRef
    ? `sb-${projectRef}-recovery`
    : FALLBACK_RECOVERY_STORAGE_KEY;
}

export function getApplicationStorageKey(supabaseUrl) {
  const projectRef = getProjectRef(supabaseUrl);
  return projectRef ? `sb-${projectRef}-auth-token` : "";
}

export function getRecoveryRedirectUrl(origin) {
  if (typeof origin !== "string" || origin.trim() === "") {
    return null;
  }

  try {
    const url = new URL(RECOVERY_REDIRECT_PATH, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function isRecoveryPath(pathname) {
  if (typeof pathname !== "string") {
    return false;
  }

  return pathname.replace(/\/+$/, "") === RECOVERY_REDIRECT_PATH;
}

// Reads the query of a recovery callback as parameters.
//
// A Supabase reset template that builds its own link appends `token_hash` and
// `type` to the redirect URL. The Supabase client already appends
// `?sb_flow_id=...` to that URL before sending it, so a template written as
// `{{ .RedirectTo }}?token_hash=...` arrives with two `?` separators and the
// `token_hash` would end up buried inside the `sb_flow_id` value. Treat every
// `?` after the leading one as a parameter separator, so both template styles
// (`?` and `&`) read the same way.
function toSearchParams(search) {
  if (search instanceof URLSearchParams) {
    return search;
  }

  const raw = typeof search === "string" ? search : "";
  const body = raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(body.replace(/\?/g, "&"));
}

// Reads the credentials that a password reset link can carry:
//
// - `code` (plus the optional PKCE flow id Supabase appends) for the default
//   reset template, which is redeemed with exchangeCodeForSession;
// - `token_hash` and `type=recovery` for a template written with
//   `{{ .TokenHash }}`, which is redeemed with verifyOtp and therefore also
//   works when the link is opened in another browser or on another device.
export function parseRecoveryCallback(search) {
  const params = toSearchParams(search);
  const code = params.get(PKCE_CODE_PARAM);
  const flowId = params.get(PKCE_FLOW_ID_PARAM);
  const tokenHash = params.get(TOKEN_HASH_PARAM);
  const type = params.get(TYPE_PARAM);

  return {
    code: code ? code : null,
    flowId: flowId && PKCE_FLOW_ID_PATTERN.test(flowId) ? flowId : null,
    tokenHash: tokenHash ? tokenHash : null,
    type: type ? type : null,
  };
}

function hasCookie(cookieNames, name) {
  // @supabase/ssr may split a large value into `<name>.0`, `<name>.1`, ...
  return cookieNames.some(
    (cookieName) => cookieName === name || cookieName.startsWith(`${name}.`),
  );
}

// When Supabase does not accept the `redirectTo` of a reset email (it is not
// in the project's Redirect URLs), it falls back to the Site URL, so the
// one-time recovery credentials arrive on the home page instead of the reset
// form. This returns the reset page URL (path + query) that such a request
// should be forwarded to, or null when the request is not a stray recovery
// link.
//
// A `code` alone is not enough: sign-up confirmation links carry one too. It
// only counts as a recovery link when this browser holds a pending verifier
// of the recovery client, i.e. it requested the password reset.
export function getStrayRecoveryRedirect(
  pathname,
  search,
  cookieNames,
  supabaseUrl,
) {
  if (isRecoveryPath(pathname)) {
    return null;
  }

  const params = toSearchParams(search);
  const { code, flowId, tokenHash, type } = parseRecoveryCallback(params);
  const names = Array.isArray(cookieNames) ? cookieNames : [];

  let isRecoveryLink = false;
  if (tokenHash && type === "recovery") {
    isRecoveryLink = true;
  } else if (code) {
    const storageKey = getRecoveryStorageKey(supabaseUrl);
    isRecoveryLink = flowId
      ? hasCookie(names, `${storageKey}-flow-${flowId}-code-verifier`)
      : hasCookie(names, `${storageKey}-code-verifier`);
  }

  if (!isRecoveryLink) {
    return null;
  }

  const query = params.toString();
  return query ? `${RECOVERY_REDIRECT_PATH}?${query}` : RECOVERY_REDIRECT_PATH;
}

// Reads the session tokens that a recovery link carries in the URL fragment
// when the project delivers the link in the implicit flow.
export function parseRecoveryTokens(hash) {
  const params = new URLSearchParams(
    typeof hash === "string" ? hash.replace(/^#/, "") : "",
  );
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const type = params.get("type");

  return {
    accessToken: accessToken ? accessToken : null,
    refreshToken: refreshToken ? refreshToken : null,
    type: type ? type : null,
  };
}
