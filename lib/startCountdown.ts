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
export function dayNumber(value: string | null | undefined): number | null {
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

/** The challenge is 7 working days; Friday and Sunday are the off days (communication still goes
 *  out on them, as a half day). Change these and every cohort follows. */
export const CHALLENGE_LENGTH_DAYS = 7;
const OFF_WEEKDAYS = [0, 5]; // 0 = Sunday, 5 = Friday

const isOffDay = (dayN: number) => OFF_WEEKDAYS.includes(new Date(dayN * 86_400_000).getUTCDay());

/**
 * Which day of the challenge it is, as the text saved in Kit's `challenge_day` field. Only the
 * person's own start date is read, so every cohort works without any per-cohort setup.
 *   "0"        before day 1 (including a start date that is still ahead)
 *   "1".."7"   a working day of the challenge. Day 1 is the start date itself (the kickoff day)
 *              and each following working day adds one.
 *   an off day the last working day's number plus .5 ("3.5" on the Friday after day 3), so the
 *              field changes every day and an automation can send on it
 *   "done"     every day after the last working day
 * Returns null when the start date is missing or invalid.
 */
export function computeChallengeDay(
  startDate: string | null | undefined,
  today: string | Date = new Date(),
): string | null {
  const start = dayNumber(startDate);
  const now = dayNumber(typeof today === "string" ? today : chicagoToday(today));
  if (start === null || now === null) return null;
  if (now < start) return "0";
  let worked = 0;
  for (let d = start; d <= now; d++) {
    if (isOffDay(d)) continue;
    if (worked === CHALLENGE_LENGTH_DAYS) return "done"; // a working day after the last one
    worked++;
  }
  // Only off days remain after the last working day: the challenge is over, not "held".
  if (worked === CHALLENGE_LENGTH_DAYS) {
    // an off day after day 7 is done; day 7 itself is "7"
    return isOffDay(now) ? "done" : String(worked);
  }
  if (isOffDay(now)) return worked === 0 ? "0" : `${worked}.5`;
  return String(worked);
}

/** When the day number flips, in Chicago time, and an automation sends the moment it changes:
 *  every day at 9:00 AM, except Day 1 (the kickoff day), which opens at 2:15 PM, after the call. */
export const CHALLENGE_DAILY_MINUTE = 9 * 60;
export const CHALLENGE_DAY_ONE_MINUTE = 14 * 60 + 15;

const chicagoMinute = new Intl.DateTimeFormat("en-US", {
  timeZone: CHICAGO,
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

function chicagoMinuteOfDay(now: Date): number {
  const parts = chicagoMinute.formatToParts(now);
  return Number(parts.find((p) => p.type === "hour")!.value) * 60 + Number(parts.find((p) => p.type === "minute")!.value);
}

/** The date the daily number should be worked out for right now: today once it is past 9:00 AM,
 *  otherwise yesterday (the number everyone already has). */
export function challengeDayDate(now: Date = new Date()): string {
  return chicagoToday(chicagoMinuteOfDay(now) >= CHALLENGE_DAILY_MINUTE ? now : new Date(now.getTime() - 86_400_000));
}

/**
 * `challenge_day` for this person at this moment. It is computeChallengeDay for challengeDayDate(),
 * except that Day 1 stays "0" until 2:15 PM, so nobody gets the Day 1 email before the kickoff
 * call is over. Anyone who signs up after that moment lands on today's number, and its email,
 * immediately; a morning signup waits and flips with everyone else.
 */
export function challengeDayFor(startDate: string | null | undefined, now: Date = new Date()): string | null {
  const date = challengeDayDate(now);
  const value = computeChallengeDay(startDate, date);
  // Day 1 opens at 2:15 PM on its own date. Before 9 AM the next day date is still Day 1's, and by
  // then the 2:15 PM moment has long passed, so it only applies while "today" is Day 1.
  if (value === "1" && date === chicagoToday(now) && chicagoMinuteOfDay(now) < CHALLENGE_DAY_ONE_MINUTE) return "0";
  return value;
}
