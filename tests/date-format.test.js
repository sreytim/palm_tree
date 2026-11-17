import assert from "node:assert/strict";
import test from "node:test";
import { formatDate, formatDateTime } from "../lib/date-format.js";

test("dates render identically on the server and in the browser", () => {
  assert.equal(formatDate("2026-11-17T09:42:00Z"), "2026-11-17");
  assert.equal(formatDateTime("2026-11-17T09:42:00Z"), "2026-11-17 09:42 UTC");
  assert.equal(formatDate("2026-01-02T23:59:00Z"), "2026-01-02");
  assert.equal(formatDate(null), "");
  assert.equal(formatDateTime("not a date"), "");
});
