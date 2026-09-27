import { createHmac } from "crypto";

// Must match the app's lib/offerToken.ts (same secret, same format) — the app
// verifies the signature and enforces the expiry at checkout.
const OFFER_ID = "first_month_1";
export const OFFER_TTL_HOURS = 24;

// September 30, 2026, 11:59 PM Central. That date falls under daylight time
// (CDT, UTC-5), not CST — DST doesn't end until early November — so this is
// the correct UTC instant for that wall-clock time, not a UTC-6 guess.
export const FIXED_CAMPAIGN_DEADLINE = new Date("2026-10-01T04:59:00.000Z").getTime();

function signToken(expiresAt: number): { token: string; expiresAt: number } {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) throw new Error("OFFER_SIGNING_SECRET not configured");
  const sig = createHmac("sha256", secret).update(`${OFFER_ID}:${expiresAt}`).digest("hex");
  return { token: `${expiresAt}.${sig}`, expiresAt };
}

// The rolling 24-hours-per-visitor offer — /checklist/thank-you only.
export function createOfferToken(): { token: string; expiresAt: number } {
  return signToken(Date.now() + OFFER_TTL_HOURS * 60 * 60 * 1000);
}

// The fixed-deadline campaign offer — /1-dollar-month and
// /returning-1-dollar-month. Deliberately not client-configurable (no
// arbitrary expiresAt accepted from a request body) — a single server-side
// constant, so nobody can extend their own offer window by calling the
// minting endpoint with a made-up date.
export function createFixedOfferToken(): { token: string; expiresAt: number } {
  return signToken(FIXED_CAMPAIGN_DEADLINE);
}
