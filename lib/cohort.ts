// Cohort schedule for the 30-Day Preaching Growth Accelerator: a new cohort starts on the FIRST
// and THIRD MONDAY of every month, each with 6 spots. When a cohort's start date passes, the next
// one is current with a fresh 6 spots. Dates are computed in Central time so "today" matches
// Bryson's calendar.
export const COHORT_SPOTS = 6;
const COHORT_MONDAYS = [1, 3]; // which Mondays of the month start a cohort
const TIME_ZONE = "America/Chicago";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// ISO date (YYYY-MM-DD) of the nth Monday of a month (month is 0-based; Date.UTC rolls over years).
function nthMonday(year: number, month: number, n: number): string {
  const first = new Date(Date.UTC(year, month, 1));
  const toMonday = (1 - first.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(year, month, 1 + toMonday + (n - 1) * 7)).toISOString().slice(0, 10);
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
  const [year, month] = today.split("-").map(Number);
  // The first start date on or after today, looking at this month and the next two.
  let key = "";
  for (let offset = 0; offset < 3 && !key; offset++) {
    for (const n of COHORT_MONDAYS) {
      const candidate = nthMonday(year, month - 1 + offset, n);
      if (candidate >= today) { key = candidate; break; }
    }
  }
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
