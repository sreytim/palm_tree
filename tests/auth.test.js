import test from "node:test";
import assert from "node:assert/strict";
import { translations } from "../lang/i18n.js";
import { getSafeRedirectPath } from "../lib/safe-redirect.js";
import { getCurrentUser } from "../lib/auth-session.js";

const missingSessionClient = {
  auth: {
    async getUser() {
      return {
        data: { user: null },
        error: {
          name: "AuthSessionMissingError",
          message: "Auth session missing!",
        },
      };
    },
  },
};

const missingSessionCodeClient = {
  auth: {
    async getUser() {
      return {
        data: { user: null },
        error: { name: "AuthApiError", code: "session_not_found" },
      };
    },
  },
};

test("login shows the English invalid credentials message", () => {
  assert.equal(
    translations.en.invalidCredentials,
    "Invalid email or password.",
  );
});

test("safe redirect paths keep their path, query, and hash", () => {
  assert.equal(getSafeRedirectPath("/"), "/");
  assert.equal(getSafeRedirectPath("/archive"), "/archive");
  assert.equal(
    getSafeRedirectPath("/contribute?draft=1#photos"),
    "/contribute?draft=1#photos",
  );
  assert.equal(getSafeRedirectPath("/admin/review", "/login"), "/admin/review");
});

test("safe redirect paths fall back when the value is missing or empty", () => {
  for (const value of [undefined, null, "", "archive"]) {
    assert.equal(getSafeRedirectPath(value), "/");
    assert.equal(getSafeRedirectPath(value, "/login"), "/login");
  }
});

test("unsafe redirect paths are rejected in favor of the fallback", () => {
  const unsafeValues = [
    "//evil.example",
    "https://evil.example/archive",
    "http://evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "/archive\tmalformed",
    "/archive\nSet-Cookie: session=stolen",
  ];

  for (const value of unsafeValues) {
    assert.equal(getSafeRedirectPath(value), "/");
    assert.equal(getSafeRedirectPath(value, "/login"), "/login");
  }
});

test("getCurrentUser returns { user: null, error: null } without a session", async () => {
  assert.deepEqual(await getCurrentUser(missingSessionClient), {
    user: null,
    error: null,
  });
});

test("getCurrentUser treats a session_not_found error as signed out", async () => {
  assert.deepEqual(await getCurrentUser(missingSessionCodeClient), {
    user: null,
    error: null,
  });
});
