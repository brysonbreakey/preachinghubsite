// Fallback schedule for the 30-Day Preaching Growth Accelerator ("rounds"): a new cohort starts on
// the FIRST and THIRD MONDAY of every month with 6 coaching slots, and enrollment for it closes the
// Sunday before. The app (GET /api/coaching/spaces) is the source of truth; this copy is used only
// when the app can't be reached, so keep it in step with lib/cohort.ts in the app repo. Dates are
// computed in Central time so "today" matches Bryson's calendar.
import { APP_URL } from "@/lib/urls";

export const COHORT_SPOTS = 6;
const COHORT_MONDAYS = [1, 3]; // which Mondays of the month start a cohort
const TIME_ZONE = "America/Chicago";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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
  key: string; // start date (a Monday), YYYY-MM-DD: also the id spots are counted against
  startsOn: string; // "November 2nd"
  startsToday: boolean;
  closesOn: string; // when enrollment closes (the Sunday before): "Sunday, November 1"
  closesToday: boolean;
};

function dayBefore(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().slice(0, 10);
}

export function todayCentral(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function describeCohort(key: string, today: string): Cohort {
  const [, m, d] = key.split("-").map(Number);
  const closes = dayBefore(key);
  const [cy, cm, cd] = closes.split("-").map(Number);
  const closesWeekday = WEEKDAYS[new Date(Date.UTC(cy, cm - 1, cd)).getUTCDay()];
  return {
    key,
    startsOn: `${MONTHS[m - 1]} ${ordinal(d)}`,
    startsToday: key === today,
    closesOn: `${closesWeekday}, ${MONTHS[cm - 1]} ${cd}`,
    closesToday: closes === today,
  };
}

export function currentCohort(now: Date = new Date()): Cohort {
  const today = todayCentral(now);
  const [year, month] = today.split("-").map(Number);
  // The first round still open (enrollment runs through the day before it starts), looking at this month and the next two.
  let key = "";
  for (let offset = 0; offset < 3 && !key; offset++) {
    for (const n of COHORT_MONDAYS) {
      const candidate = nthMonday(year, month - 1 + offset, n);
      if (dayBefore(candidate) >= today) { key = candidate; break; }
    }
  }
  return describeCohort(key, today);
}

export type LiveCohort = {
  cohort: Cohort;
  remaining: number;
  state: "open" | "full" | "downsell_only";
};

// The app is the source of truth for which cohort is current and how many spots are left
// (GET /api/coaching/spaces on the app, backed by the claims table). Cached for about a minute.
// Returns null if the app can't be reached or answers oddly, and the page then falls back to the
// local schedule above and "Limited spots", never a made-up number.
export async function getLiveCohort(): Promise<LiveCohort | null> {
  try {
    const res = await fetch(`${APP_URL}/api/coaching/spaces`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(2000) });
    if (!res.ok) return null;
    const d = await res.json();
    const c = d?.cohort;
    const valid =
      typeof c?.key === "string" && /^\d{4}-\d{2}-\d{2}$/.test(c.key) &&
      Number.isInteger(d?.remaining) && d.remaining >= 0 && ["open", "full", "downsell_only"].includes(d?.state);
    if (!valid) return null;
    // Labels are built here from the key, so the wording is always this site's.
    return { cohort: describeCohort(c.key, todayCentral()), remaining: d.remaining, state: d.state };
  } catch {
    return null;
  }
}
