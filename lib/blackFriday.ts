// Black Friday 2026 offer on the marketing site. Everything that shows or hides it reads from this
// one file, so ending it early or extending it is a single edit.
//
// The codes are redeemed in the app (see the app repo's lib/blackFriday.ts), after the 14-day trial.
export const BF_START = new Date("2026-11-23T00:00:00Z");
// Midnight Central at the end of Monday, Nov 30, 2026 (Cyber Monday). CST is UTC-6.
export const BF_END = new Date("2026-12-01T06:00:00Z");

export const BF_MONTHLY_CODE = "PREACH29"; // $29/mo for 6 months, then $49/mo
export const BF_ANNUAL_CODE = "PREACH50"; // 50% off the annual plan
export const BF_ENDS_LABEL = "Monday, Nov 30";

// Evaluate on the client only: the pages are statically generated, so a server-side date check
// would freeze at build time.
export function isBlackFridayNow(now: Date = new Date()): boolean {
  return now >= BF_START && now < BF_END;
}
