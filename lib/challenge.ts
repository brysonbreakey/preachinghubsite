// The Free 7-Day Preaching Growth Challenge's clock. Every instant is written in UTC with the
// Central wall-clock time beside it (November 10 and 11, 2026 are after daylight time ends on
// November 1, so Central is CST, UTC-6). Both the page and the signup API read it, and the server
// decides what a signup is, so changing the page in a browser can't reopen the challenge.

/** The kickoff video call: Tuesday, November 10, 1:00 PM CST. The countdown runs to this. */
export const CHALLENGE_KICKOFF = Date.parse("2026-11-10T19:00:00Z");

/** The kickoff day as a plain date ("2026-11-10"), in Central time. Saved to each signup's
 *  `challenge_start_date` field in Kit so automations can use it. It follows CHALLENGE_KICKOFF,
 *  so changing the kickoff for a new cohort changes it too. */
export const CHALLENGE_START_DATE_LABEL = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(CHALLENGE_KICKOFF);

/** Enrollment closes: Wednesday, November 11, 12:00 AM CST. People who join during the kickoff
 *  call still have the rest of November 10 to sign up. After this, signups are waitlist signups. */
export const CHALLENGE_CLOSES = Date.parse("2026-11-11T06:00:00Z");

/** When the free PreachingHub pass ends: the end of Sunday, November 22, CST. The app enforces
 *  this too (see its lib/challengeAccess.ts); the signed link stops working after it. */
export const CHALLENGE_PASS_UNTIL = Date.parse("2026-11-23T06:00:00Z");

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
