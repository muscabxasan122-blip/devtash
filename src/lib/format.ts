/** Formatting helpers shared by the dashboard views. */

const SHORT_DATE = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * "Jan 15" for a timestamp. Pinned to UTC so the server-rendered string never
 * disagrees with the client's locale or timezone.
 */
export function formatShortDate(timestamp: string): string {
  return SHORT_DATE.format(new Date(timestamp));
}
