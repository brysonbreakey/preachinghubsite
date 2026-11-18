import { createHmac, timingSafeEqual } from "crypto";
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

/**
 * Checks a "claim" this site handed the browser after a challenge signup (see createChallengeClaim).
 * It proves the browser that signed up is the one asking, so a later step (choosing a track) can act
 * on that email without letting anyone tag someone else's address. Null if it isn't one of ours or
 * has expired (one hour).
 */
export function verifyChallengeClaim(token: unknown): { email: string; firstName: string; lastName: string } | null {
  const secret = process.env.OFFER_SIGNING_SECRET;
  if (!secret || typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret).update(`challengeclaim:${payload}`).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const { e, f, l, x } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof e !== "string" || !e.includes("@") || typeof x !== "number" || Date.now() > x) return null;
    return { email: e, firstName: typeof f === "string" ? f : "", lastName: typeof l === "string" ? l : "" };
  } catch {
    return null;
  }
}
