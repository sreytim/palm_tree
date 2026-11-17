/**
 * Dates shown in the app.
 *
 * `toLocaleDateString()` depends on the runtime's locale and time zone, so a
 * server-rendered client component can hydrate with a different string and log
 * a hydration warning. These formatters are locale-independent (UTC, ISO-like)
 * and therefore render the same on the server and in every browser.
 */
const pad = (value) => String(value).padStart(2, "0");

function asValidDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value) {
  const date = asValidDate(value);

  if (!date) {
    return "";
  }

  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(
    date.getUTCDate(),
  )}`;
}

export function formatDateTime(value) {
  const date = asValidDate(value);

  if (!date) {
    return "";
  }

  return `${formatDate(value)} ${pad(date.getUTCHours())}:${pad(
    date.getUTCMinutes(),
  )} UTC`;
}
