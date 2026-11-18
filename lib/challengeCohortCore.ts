import { CHALLENGE_MEET_URL_DEFAULT } from "@/lib/challenge";

// The cohort the challenge page is showing: kickoff moment, when enrollment closes, when the free
// pass ends, and the words built from them. The admin Challenge Tracker saves these on the run
// (challenge_runs: start_date, kickoff_time, close_date, pass_end_date, description, meet_url);
// the site shows the newest run that has its settings saved. With nothing saved (or no database)
// it uses DEFAULT_COHORT, which is cohort 2 exactly as it was before the admin controlled it, so
// the page never breaks. Everything here is plain data (safe to hand to a browser component).
//
// Times are written in Central. Dates are plain "yyyy-mm-dd"; the kickoff is a "HH:MM" Central time.

const TZ = "America/Chicago";

export type PublicCohort = {
  /** The kickoff day as "2026-11-17"; the key a cohort is known by (Kit's challenge_start_date). */
  startDate: string;
  /** Kickoff moment, ms since the epoch. */
  kickoff: number;
  /** First moment enrollment is closed (the start of the day after the close date, Central). */
  closes: number;
  /** First moment the free pass is over (the start of the day after the pass end date, Central). */
  passUntil: number;
  /** "1PM" / "1:30PM": Kit's challenge_start_time. */
  startTimeLabel: string;
  /** "November 29": Kit's challenge_pass_end. */
  passEndLabel: string;
  /** "Tuesday, November 17 at 1 PM CST". */
  kickoffWhen: string;
  /** "November 17, 2026". */
  startDateLong: string;
  /** "November 17": the kickoff day. */
  startMonthDay: string;
  /** "Tuesday". */
  startWeekday: string;
  /** "Monday": the weekday of Day 7. */
  endWeekday: string;
  /** "November 17–23" (or "November 28 – December 4"). */
  rangeLabel: string;
  /** "Nov 17 – 23" (or "Nov 28 – Dec 4"). */
  rangeShort: string;
  /** "Nov 24 – 29": the extra week of access, or "" when the pass ends with the challenge. */
  extraWeekShort: string;
  /** "11:59 PM CST on November 17". */
  closesLabel: string;
  /** "11:59 PM CST" */
  closesTime: string;
  /** The closing day as "2026-11-17". */
  closeDate: string;
  /** "November 17" … "November 23": Day 1 to Day 7. */
  dayDates: string[];
  /** The kickoff call's link. */
  meetUrl: string;
  /** Extra text for the calendar item, or "". */
  description: string;
};

// ---- Central-time helpers (pure) ------------------------------------------------------------

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const TIME_RE = /^([01]?\d|2[0-3]):([0-5]\d)$/;

function parseDate(v: unknown): [number, number, number] | null {
  if (typeof v !== "string") return null;
  const m = DATE_RE.exec(v.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const back = new Date(Date.UTC(y, mo - 1, d));
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return [y, mo, d];
}

export function addDays(date: string, n: number): string {
  const p = parseDate(date);
  if (!p) throw new Error(`bad date ${date}`);
  const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

const zoneParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

/** Central's offset from UTC at this instant, in ms (negative: -6h in winter, -5h in summer). */
function centralOffsetMs(utcMs: number): number {
  const parts = zoneParts.formatToParts(new Date(utcMs));
  const g = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(g("year"), g("month") - 1, g("day"), g("hour"), g("minute"), g("second"));
  return asUtc - Math.floor(utcMs / 1000) * 1000;
}

/** The instant (ms) at this Central wall-clock moment. */
export function centralToUtc(date: string, hour: number, minute: number): number {
  const p = parseDate(date);
  if (!p) throw new Error(`bad date ${date}`);
  const naive = Date.UTC(p[0], p[1] - 1, p[2], hour, minute);
  let guess = naive - centralOffsetMs(naive);
  guess = naive - centralOffsetMs(guess);
  return guess;
}

const monthDay = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", day: "numeric" });
const monthShort = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric" });
const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", weekday: "long" });
const dateAt = (date: string) => {
  const p = parseDate(date)!;
  return new Date(Date.UTC(p[0], p[1] - 1, p[2]));
};
const month = (date: string) => parseDate(date)![1];
const dayOfMonth = (date: string) => parseDate(date)![2];

function timeWords(hour: number, minute: number, compact: boolean): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ap = hour < 12 ? "AM" : "PM";
  const mm = minute === 0 ? "" : `:${String(minute).padStart(2, "0")}`;
  return compact ? `${h12}${mm}${ap}` : `${h12}${mm} ${ap}`;
}

// ---- Building a cohort ----------------------------------------------------------------------

export type CohortSettings = {
  startDate: string;
  /** "13:00" (Central, 24-hour). */
  kickoffTime: string;
  /** Last day people can join; defaults to the kickoff day. */
  closeDate?: string | null;
  /** Last day of the free pass. */
  passEndDate: string;
  meetUrl?: string | null;
  description?: string | null;
};

/** Builds a cohort from its settings, or null when they don't make sense (bad date or time, a pass
 *  that ends before the kickoff, enrollment that closes before it opens). */
export function buildCohort(s: CohortSettings): PublicCohort | null {
  if (!parseDate(s.startDate) || !parseDate(s.passEndDate)) return null;
  const t = TIME_RE.exec((s.kickoffTime ?? "").trim());
  if (!t) return null;
  const closeDate = s.closeDate && parseDate(s.closeDate) ? s.closeDate : s.startDate;
  if (closeDate < s.startDate || s.passEndDate < s.startDate) return null;

  const hour = Number(t[1]);
  const minute = Number(t[2]);
  const kickoff = centralToUtc(s.startDate, hour, minute);
  const tz = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "short" }).formatToParts(new Date(kickoff)).find((p) => p.type === "timeZoneName")?.value ?? "CT";
  const closes = centralToUtc(addDays(closeDate, 1), 0, 0);
  const passUntil = centralToUtc(addDays(s.passEndDate, 1), 0, 0);

  const dayDates = Array.from({ length: 7 }, (_, i) => monthDay.format(dateAt(addDays(s.startDate, i))));
  const last = addDays(s.startDate, 6);
  const sameMonth = month(s.startDate) === month(last);
  const rangeLabel = sameMonth ? `${monthDay.format(dateAt(s.startDate))}–${dayOfMonth(last)}` : `${monthDay.format(dateAt(s.startDate))} – ${monthDay.format(dateAt(last))}`;
  const rangeShort = sameMonth ? `${monthShort.format(dateAt(s.startDate))} – ${dayOfMonth(last)}` : `${monthShort.format(dateAt(s.startDate))} – ${monthShort.format(dateAt(last))}`;

  const extraFrom = addDays(s.startDate, 7);
  const extraWeekShort =
    s.passEndDate >= extraFrom
      ? month(extraFrom) === month(s.passEndDate)
        ? `${monthShort.format(dateAt(extraFrom))} – ${dayOfMonth(s.passEndDate)}`
        : `${monthShort.format(dateAt(extraFrom))} – ${monthShort.format(dateAt(s.passEndDate))}`
      : "";

  const meet = typeof s.meetUrl === "string" && /^https:\/\/\S+$/.test(s.meetUrl.trim()) ? s.meetUrl.trim() : CHALLENGE_MEET_URL_DEFAULT;

  return {
    startDate: s.startDate,
    kickoff,
    closes,
    passUntil,
    startTimeLabel: timeWords(hour, minute, true),
    passEndLabel: monthDay.format(dateAt(s.passEndDate)),
    kickoffWhen: `${weekday.format(dateAt(s.startDate))}, ${monthDay.format(dateAt(s.startDate))} at ${timeWords(hour, minute, false)} ${tz}`,
    startDateLong: `${monthDay.format(dateAt(s.startDate))}, ${parseDate(s.startDate)![0]}`,
    startMonthDay: monthDay.format(dateAt(s.startDate)),
    startWeekday: weekday.format(dateAt(s.startDate)),
    endWeekday: weekday.format(dateAt(last)),
    rangeLabel,
    rangeShort,
    extraWeekShort,
    closesLabel: `11:59 PM ${tz} on ${monthDay.format(dateAt(closeDate))}`,
    closesTime: `11:59 PM ${tz}`,
    closeDate,
    dayDates,
    meetUrl: meet,
    description: typeof s.description === "string" ? s.description.trim() : "",
  };
}

/** Cohort 2 exactly as it was hard-coded before the admin controlled it (see lib/challenge.ts). */
export const DEFAULT_COHORT: PublicCohort = buildCohort({
  startDate: "2026-11-17",
  kickoffTime: "13:00",
  closeDate: "2026-11-17",
  passEndDate: "2026-11-29",
  meetUrl: CHALLENGE_MEET_URL_DEFAULT,
})!;

/** A challenge_runs row's settings as a cohort, or null when the row has no (usable) settings. */
export function cohortFromRow(row: Record<string, unknown> | null | undefined): PublicCohort | null {
  if (!row) return null;
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const startDate = str(row.start_date);
  const kickoffTime = str(row.kickoff_time);
  const passEndDate = str(row.pass_end_date);
  if (!startDate || !kickoffTime || !passEndDate) return null;
  // Postgres returns "13:00:00" for a time column; keep the hour and minute.
  return buildCohort({
    startDate,
    kickoffTime: kickoffTime.slice(0, 5),
    closeDate: str(row.close_date),
    passEndDate,
    meetUrl: str(row.meet_url),
    description: str(row.description),
  });
}

/** "tonight at 11:59 PM CST" when enrollment closes today (Central), else "at 11:59 PM CST on November 17". */
export function closesPhrase(c: Pick<PublicCohort, "closeDate" | "closesTime" | "closesLabel">, now: number): string {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(now));
  return today === c.closeDate ? `tonight at ${c.closesTime}` : `at ${c.closesLabel}`;
}
