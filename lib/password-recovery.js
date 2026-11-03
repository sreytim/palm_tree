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

// Reads the one-time code - and the optional PKCE flow id - that Supabase
// appends to the password reset link.
export function parseRecoveryCallback(search) {
  const params =
    search instanceof URLSearchParams
      ? search
      : new URLSearchParams(typeof search === "string" ? search : "");
  const code = params.get(PKCE_CODE_PARAM);
  const flowId = params.get(PKCE_FLOW_ID_PARAM);

  return {
    code: code ? code : null,
    flowId: flowId && PKCE_FLOW_ID_PATTERN.test(flowId) ? flowId : null,
  };
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
