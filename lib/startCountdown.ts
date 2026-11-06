// Whole-calendar-day countdown to a start date. Pure and dependency-free so the Kit client, the
// daily job and the tests can all share it. Named generically ("start") so other kinds of start
// dates (a challenge, a cohort, a launch) can reuse it later.

const CHICAGO = "America/Chicago";

/** How far past the start date the countdown keeps writing (day -14), so the same field can drive
 *  emails during the challenge. Beyond this the job leaves the field alone. */
export const MIN_COUNTDOWN_DAY = -14;

const chicagoDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: CHICAGO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const chicagoHour = new Intl.DateTimeFormat("en-US", {
  timeZone: CHICAGO,
  hour: "numeric",
  hourCycle: "h23",
});

/** Today's calendar date in America/Chicago as "yyyy-mm-dd" (not UTC's date). */
export function chicagoToday(now: Date = new Date()): string {
  return chicagoDate.format(now);
}

/** The current hour (0-23) in America/Chicago. */
export function chicagoHourNow(now: Date = new Date()): number {
  return Number(chicagoHour.format(now));
}

/** Days since the epoch for a strict "yyyy-mm-dd" string, or null if it isn't a real date. */
function dayNumber(value: string | null | undefined): number | null {
  if (typeof value !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const ms = Date.UTC(y, mo - 1, d);
  const back = new Date(ms);
  // Round-trip so "2026-02-30" or "2026-13-01" are rejected instead of rolling over.
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return Math.round(ms / 86_400_000);
}

/**
 * Whole calendar days from `today` to `startDate`: 7 a week before, 1 the day before, 0 on the day,
 * negative after. `startDate` is "yyyy-mm-dd". `today` is a "yyyy-mm-dd" string, or a Date, which
 * is read as a calendar date in America/Chicago (never UTC). Both sides are compared as plain
 * calendar dates, so daylight-saving changes can't shift the answer by a day.
 * Returns null when either date is missing or invalid.
 */
export function computeDaysUntilChallengeStart(
  startDate: string | null | undefined,
  today: string | Date = new Date(),
): number | null {
  const start = dayNumber(startDate);
  const now = dayNumber(typeof today === "string" ? today : chicagoToday(today));
  if (start === null || now === null) return null;
  return start - now;
}
