import { createHmac } from "crypto";

// Must match the app's lib/offerToken.ts (same secret, same format) — the app
// verifies the signature and enforces the expiry at checkout.
const OFFER_ID = "first_month_1";
export const OFFER_TTL_HOURS = 24;

export function createOfferToken(): { token: string; expiresAt: number } {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) throw new Error("OFFER_SIGNING_SECRET not configured");
  const expiresAt = Date.now() + OFFER_TTL_HOURS * 60 * 60 * 1000;
  const sig = createHmac("sha256", secret).update(`${OFFER_ID}:${expiresAt}`).digest("hex");
  return { token: `${expiresAt}.${sig}`, expiresAt };
}
