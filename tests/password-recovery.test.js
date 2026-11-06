import test from "node:test";
import assert from "node:assert/strict";
import {
  getApplicationStorageKey,
  getRecoveryRedirectUrl,
  getRecoveryStorageKey,
  getStrayRecoveryRedirect,
  isRecoveryPath,
  parseRecoveryCallback,
  parseRecoveryTokens,
} from "../lib/password-recovery.js";

const PROJECT_URL = "https://abcdefghijklmnop.supabase.co";

test("the recovery redirect always points at the reset page", () => {
  assert.equal(
    getRecoveryRedirectUrl("https://palm-tree-gilt.vercel.app"),
    "https://palm-tree-gilt.vercel.app/reset-password",
  );
  assert.equal(
    getRecoveryRedirectUrl("http://localhost:3000"),
    "http://localhost:3000/reset-password",
  );
});

test("the recovery redirect rejects missing and non-http origins", () => {
  for (const origin of [
    undefined,
    null,
    "",
    "  ",
    "nomad",
    "javascript:alert(1)",
    "ftp://example.com",
  ]) {
    assert.equal(getRecoveryRedirectUrl(origin), null);
  }
});

test("only the reset page counts as the recovery path", () => {
  assert.equal(isRecoveryPath("/reset-password"), true);
  assert.equal(isRecoveryPath("/reset-password/"), true);
  assert.equal(isRecoveryPath("/reset-password/extra"), false);
  assert.equal(isRecoveryPath("/"), false);
  assert.equal(isRecoveryPath(undefined), false);
});

test("the default PKCE reset link yields its code and flow id", () => {
  assert.deepEqual(parseRecoveryCallback("?code=abc123&sb_flow_id=flow_1234567890"), {
    code: "abc123",
    flowId: "flow_1234567890",
    tokenHash: null,
    type: null,
  });
});

test("a malformed PKCE flow id is dropped instead of trusted", () => {
  assert.equal(
    parseRecoveryCallback("?code=abc123&sb_flow_id=bad%20flow%20id").flowId,
    null,
  );
});

test("a token hash reset template link yields its hash and type", () => {
  assert.deepEqual(parseRecoveryCallback("?token_hash=pkce_1234&type=recovery"), {
    code: null,
    flowId: null,
    tokenHash: "pkce_1234",
    type: "recovery",
  });
});

test("a token hash link joined with `?` to the flow id is still read", () => {
  // A reset template written as `{{ .RedirectTo }}?token_hash=...` produces a
  // second `?`, because the Supabase client appends `sb_flow_id` to the
  // redirect URL before sending it.
  assert.deepEqual(
    parseRecoveryCallback(
      "?sb_flow_id=flow_1234567890?token_hash=pkce_1234&type=recovery",
    ),
    {
      code: null,
      flowId: "flow_1234567890",
      tokenHash: "pkce_1234",
      type: "recovery",
    },
  );
});

test("an empty callback carries no recovery credentials", () => {
  const empty = {
    code: null,
    flowId: null,
    tokenHash: null,
    type: null,
  };

  assert.deepEqual(parseRecoveryCallback(""), empty);
  assert.deepEqual(parseRecoveryCallback(undefined), empty);
});

test("implicit flow recovery tokens are read from the url fragment", () => {
  assert.deepEqual(parseRecoveryTokens("#access_token=at&refresh_token=rt&type=recovery"), {
    accessToken: "at",
    refreshToken: "rt",
    type: "recovery",
  });
});

test("a fragment without recovery tokens yields no credentials", () => {
  const empty = { accessToken: null, refreshToken: null, type: null };

  assert.deepEqual(parseRecoveryTokens("#section-2"), empty);
  assert.deepEqual(parseRecoveryTokens(undefined), empty);
});

test("the recovery session is stored apart from the archive session", () => {
  assert.equal(getRecoveryStorageKey(PROJECT_URL), "sb-abcdefghijklmnop-recovery");
  assert.equal(
    getApplicationStorageKey(PROJECT_URL),
    "sb-abcdefghijklmnop-auth-token",
  );
  assert.notEqual(
    getRecoveryStorageKey(PROJECT_URL),
    getApplicationStorageKey(PROJECT_URL),
  );
});

test("a recovery code that lands on the home page is sent to the reset form", () => {
  const recoveryKey = getRecoveryStorageKey(PROJECT_URL);

  assert.equal(
    getStrayRecoveryRedirect(
      "/",
      "?code=abc123&sb_flow_id=flow_1234567890",
      [`${recoveryKey}-flow-flow_1234567890-code-verifier`],
      PROJECT_URL,
    ),
    "/reset-password?code=abc123&sb_flow_id=flow_1234567890",
  );
  assert.equal(
    getStrayRecoveryRedirect(
      "/",
      "?code=abc123",
      [`${recoveryKey}-code-verifier.0`],
      PROJECT_URL,
    ),
    "/reset-password?code=abc123",
  );
});

test("a token hash recovery link on another page is sent to the reset form", () => {
  assert.equal(
    getStrayRecoveryRedirect("/", "?token_hash=pkce_1234&type=recovery", [], PROJECT_URL),
    "/reset-password?token_hash=pkce_1234&type=recovery",
  );
});

test("a malformed token hash recovery link is forwarded with clean parameters", () => {
  assert.equal(
    getStrayRecoveryRedirect(
      "/",
      "?sb_flow_id=flow_1234567890?token_hash=pkce_1234&type=recovery",
      [],
      PROJECT_URL,
    ),
    "/reset-password?sb_flow_id=flow_1234567890&token_hash=pkce_1234&type=recovery",
  );
});

test("sign-up confirmation codes and normal pages are left alone", () => {
  const appKey = getApplicationStorageKey(PROJECT_URL);

  // A code that belongs to the archive client (sign-up confirmation).
  assert.equal(
    getStrayRecoveryRedirect(
      "/",
      "?code=abc123",
      [`${appKey}-code-verifier`],
      PROJECT_URL,
    ),
    null,
  );
  // A code without any pending verifier.
  assert.equal(getStrayRecoveryRedirect("/", "?code=abc123", [], PROJECT_URL), null);
  // A signup token hash is not a recovery link.
  assert.equal(
    getStrayRecoveryRedirect("/", "?token_hash=x&type=signup", [], PROJECT_URL),
    null,
  );
  assert.equal(getStrayRecoveryRedirect("/archive", "", [], PROJECT_URL), null);
});

test("requests already on the reset page are never redirected again", () => {
  assert.equal(
    getStrayRecoveryRedirect(
      "/reset-password",
      "?token_hash=pkce_1234&type=recovery",
      [],
      PROJECT_URL,
    ),
    null,
  );
});

test("storage keys fall back safely when the project url is missing", () => {
  assert.equal(getRecoveryStorageKey(""), "sb-recovery");
  assert.equal(getApplicationStorageKey(undefined), "");
});
