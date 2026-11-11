// The 7-Day Preaching Growth Challenge's clock (cohort 2: November 17-23, 2026; cohort 1 was the
// free pilot of November 10-18, kept at the git tag `challenge-cohort1-page`). Every instant is written in UTC with the
// Central wall-clock time beside it (November 10 and 11, 2026 are after daylight time ends on
// November 1, so Central is CST, UTC-6). Both the page and the signup API read it, and the server
// decides what a signup is, so changing the page in a browser can't reopen the challenge.

/** The kickoff video call: Tuesday, November 17, 1:00 PM CST. The countdown runs to this. */
export const CHALLENGE_KICKOFF = Date.parse("2026-11-17T19:00:00Z");

/** The kickoff day as a plain date ("2026-11-10"), in Central time. Saved to each signup's
 *  `challenge_start_date` field in Kit so automations can use it. It follows CHALLENGE_KICKOFF,
 *  so changing the kickoff for a new cohort changes it too. */
export const CHALLENGE_START_DATE_LABEL = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(CHALLENGE_KICKOFF);

/** The kickoff time as words, saved to Kit's `challenge_start_time` field for the emails. It is
 *  1:00 PM Central, the same moment as CHALLENGE_KICKOFF; change both for a new cohort. */
export const CHALLENGE_START_TIME_LABEL = "1PM";

/** Enrollment closes at 11:59 PM CST on November 17 (the kickoff day): the instant below is the
 *  first moment of November 18. After this, signups are waitlist signups. */
export const CHALLENGE_CLOSES = Date.parse("2026-11-18T06:00:00Z");

/** When this cohort's complimentary PreachingHub access ends: the end of Sunday, November 29, CST.
 *  The app enforces it too (its lib/challengeAccess.ts lists every cohort's end); the signed link
 *  stops working after it. */
export const CHALLENGE_PASS_UNTIL = Date.parse("2026-11-30T06:00:00Z");

/** The same day as words, saved to Kit's `challenge_pass_end` field and used in the page copy. */
export const CHALLENGE_PASS_END_LABEL = "November 29";

/** The one-time $7 price in Stripe (live mode). */
export const CHALLENGE_PRICE_ID = "price_1UaSNuQ6oljt9nUgjCz4p3m8";

/** The current time on the server. The page reads it here (it is rendered per request, by design)
 *  rather than calling Date.now() in a component. For local testing only, `override` (an ISO time
 *  from ?now= or the x-challenge-now header) fakes the clock; it is ignored in production. */
export function serverNow(override?: string | null): number {
  if (process.env.NODE_ENV !== "production" && override) {
    const t = Date.parse(override);
    if (!Number.isNaN(t)) return t;
  }
  return Date.now();
}

export type ChallengePhase = "before" | "started" | "closed";

export function challengePhase(now: number): ChallengePhase {
  if (now < CHALLENGE_KICKOFF) return "before";
  if (now < CHALLENGE_CLOSES) return "started";
  return "closed";
}

/** "6d 3h 22m 10s" until the kickoff (never negative). */
export function formatCountdown(now: number): string {
  const total = Math.max(0, Math.floor((CHALLENGE_KICKOFF - now) / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${d}d ${h}h ${m}m ${s}s`;
}
