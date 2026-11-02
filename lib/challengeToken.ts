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
