import { NextRequest, NextResponse } from "next/server";
import { resolveMx } from "dns/promises";
import { addSevenDayChallengeContact, addSevenDayChallengeWaitlistContact } from "@/lib/kit";
import { challengePhase, serverNow } from "@/lib/challenge";
import { createChallengeLink, createChallengeClaim } from "@/lib/challengeToken";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

async function hasMailServer(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

// Signup for the Free 7-Day Preaching Growth Challenge. Same validation as /api/checklist-signup.
// The SERVER decides what the signup is, from the clock (lib/challenge.ts), never the browser:
//  - until enrollment closes (midnight CST on November 10): tagged "7-day-challenge", with their
//    personal signed PreachingHub access link saved to Kit's challenge_link field for the welcome
//    email (the link is never returned here: it must only reach the owner of that mailbox);
//  - after: tagged "7-day-challenge-waitlist", no link.
// Kit's upsert and tag are idempotent, so a double-click or a resubmit just re-applies the tag.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body?.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!firstName) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length !== 10) {
    return NextResponse.json({ error: "Enter a valid 10-digit phone number." }, { status: 400 });
  }
  if (!(await hasMailServer(email))) {
    return NextResponse.json({ error: "That email address doesn't look like it can receive mail. Double-check it and try again." }, { status: 400 });
  }

  const waitlist = challengePhase(serverNow(req.headers.get("x-challenge-now"))) === "closed";
  try {
    if (waitlist) {
      await addSevenDayChallengeWaitlistContact({ email, firstName, lastName, phone });
    } else {
      const challengeLink = createChallengeLink({ email, firstName, lastName });
      await addSevenDayChallengeContact({ email, firstName, lastName, phone, challengeLink });
    }
  } catch (err) {
    console.error("challenge-signup: kit failed", err);
    return NextResponse.json({ error: "Something went wrong on our end. Please try again." }, { status: 500 });
  }

  // The popup's second step (create the account right now) needs a short-lived claim; see
  // createChallengeClaim for why returning it is safe when returning the emailed link is not.
  const claim = waitlist ? null : createChallengeClaim({ email, firstName, lastName });
  return NextResponse.json({ ok: true, mode: waitlist ? "waitlist" : "joined", ...(claim ? { claim } : {}) });
}
