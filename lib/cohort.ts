// Cohort schedule for the 30-Day Preaching Growth Accelerator: a new cohort starts every
// 2 weeks, each with 6 spots. When a cohort's start date passes, the next one is 2 weeks later
// with a fresh 6 spots. Dates are computed in Central time so "today" matches Bryson's calendar.
export const COHORT_ANCHOR = "2026-11-04"; // first cohort start (YYYY-MM-DD)
export const COHORT_LENGTH_DAYS = 14;
export const COHORT_SPOTS = 6;
const TIME_ZONE = "America/Chicago";

const DAY_MS = 86400000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

function isoFromDayNumber(n: number): string {
  return new Date(n * DAY_MS).toISOString().slice(0, 10);
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10]}`;
}

export type Cohort = {
  key: string; // start date, YYYY-MM-DD: also the id spots are counted against
  startsOn: string; // "November 4th"
  startsToday: boolean;
};

export function currentCohort(now: Date = new Date()): Cohort {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const diff = dayNumber(today) - dayNumber(COHORT_ANCHOR);
  const steps = diff <= 0 ? 0 : Math.ceil(diff / COHORT_LENGTH_DAYS);
  const start = dayNumber(COHORT_ANCHOR) + steps * COHORT_LENGTH_DAYS;
  const key = isoFromDayNumber(start);
  const [, m, d] = key.split("-").map(Number);
  return { key, startsOn: `${MONTHS[m - 1]} ${ordinal(d)}`, startsToday: key === today };
}

// How many of this cohort's spots are left. TODO: read the real count from the app (the claims
// table and GET /api/coaching/spaces in Documentation/coaching-offer-spec.md, with the cap
// COHORT_SPOTS per cohort key). Until that exists this returns null and the page says
// "Limited spots" rather than showing a number that isn't real.
export async function getSpotsLeft(cohortKey: string): Promise<number | null> {
  void cohortKey;
  return null;
}
