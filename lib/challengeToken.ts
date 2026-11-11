import { createHmac } from "crypto";
import { CHALLENGE_PASS_UNTIL } from "@/lib/challenge";

// The signed "Open PreachingHub" link for challenge signups. The app (lib/challengeToken.ts there)
// verifies it, creates the account if there isn't one, grants the free pass and signs them in.
// Same secret and format as the app's copy; the "challenge:" prefix keeps it from ever being
// interchangeable with the offer tokens. The link is only ever put in the Kit email, never shown
// on the page or returned to the browser: anyone can type any email into the form, so the link
// must only reach the person who owns that mailbox.
const APP_URL = "https://app.preachinghub.com";

function b64url(s: string): string {
  return Buffer.from(s, "utf8").toString("base64url");
}

export function createChallengeLink({ email, firstName, lastName }: { email: string; firstName?: string; lastName?: string }): string | null {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) {
    console.error("challenge: OFFER_SIGNING_SECRET not configured; signing up without an access link");
    return null;
  }
  const payload = b64url(JSON.stringify({ e: email.trim().toLowerCase(), f: firstName ?? "", l: lastName ?? "", x: CHALLENGE_PASS_UNTIL }));
  const sig = createHmac("sha256", secret).update(`challenge:${payload}`).digest("hex");
  return `${APP_URL}/api/challenge/start?t=${payload}.${sig}`;
}

// Sent by the Stripe webhook to the app the moment a $7 payment goes through, so Bryson gets the
// "New Challenge Member!" email before the person has made an account. Ten minutes, its own prefix,
// so it can't be used as a link or a claim.
export function createChallengePaymentAlert({ email, firstName, lastName }: { email: string; firstName?: string; lastName?: string }): string | null {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) return null;
  const payload = b64url(JSON.stringify({ e: email.trim().toLowerCase(), f: firstName ?? "", l: lastName ?? "", x: Date.now() + 10 * 60 * 1000 }));
  const sig = createHmac("sha256", secret).update(`challengepaid:${payload}`).digest("hex");
  return `${payload}.${sig}`;
}

// A short-lived "claim" for the popup's second step (create the account with a chosen password). It
// is returned to the browser, so unlike the emailed link it can never sign anyone in: the app only
// accepts it to CREATE an account for an email that has none (/api/challenge/account), or from
// someone already signed in as that email (/api/challenge/claim). Different prefix, one hour.
export function createChallengeClaim({ email, firstName, lastName }: { email: string; firstName?: string; lastName?: string }): string | null {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret) return null;
  // u: this cohort's pass end, so the app grants the right pass (x here is only the claim's own expiry).
  const payload = b64url(JSON.stringify({ e: email.trim().toLowerCase(), f: firstName ?? "", l: lastName ?? "", x: Date.now() + 60 * 60 * 1000, u: CHALLENGE_PASS_UNTIL }));
  const sig = createHmac("sha256", secret).update(`challengeclaim:${payload}`).digest("hex");
  return `${payload}.${sig}`;
}
