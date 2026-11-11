import { NextRequest, NextResponse } from "next/server";
import { resolveMx } from "dns/promises";
import { addSevenDayChallengeCheckoutStartedContact, addSevenDayChallengeWaitlistContact } from "@/lib/kit";
import { CHALLENGE_PRICE_ID, CHALLENGE_START_DATE_LABEL, challengePhase, serverNow } from "@/lib/challenge";
import { createCheckoutSession, stripePaymentsConfigured } from "@/lib/stripe";

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

// Signup for the 7-Day Preaching Growth Challenge ($7, one time). Same validation as
// /api/checklist-signup. The SERVER decides what the signup is, from the clock (lib/challenge.ts)
// and its own Stripe settings, never the browser:
//  - enrollment open and payments configured: the person is saved to Kit as
//    "7-day-challenge-checkout-started" and sent to Stripe Checkout. They are NOT tagged
//    "7-day-challenge" and get no access link here: that happens in /api/stripe/webhook once Stripe
//    says the payment went through (so nobody gets in without paying);
//  - enrollment open but Stripe isn't configured on this deployment: they are saved as a waitlist
//    signup ("reserve my spot"), so the page still works before checkout is switched on;
//  - enrollment closed: waitlist ("7-day-challenge-waitlist").
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

  const closed = challengePhase(serverNow(req.headers.get("x-challenge-now"))) === "closed";
  const checkout = !closed && stripePaymentsConfigured();
  try {
    if (!checkout) {
      await addSevenDayChallengeWaitlistContact({ email, firstName, lastName, phone });
      return NextResponse.json({ ok: true, mode: "waitlist", reserved: !closed });
    }
    await addSevenDayChallengeCheckoutStartedContact({ email, firstName, lastName, phone });
    const origin = "https://preachinghub.com";
    const session = await createCheckoutSession({
      mode: "payment",
      "line_items[0][price]": CHALLENGE_PRICE_ID,
      "line_items[0][quantity]": "1",
      customer_email: email,
      customer_creation: "always",
      success_url: `${origin}/challenge/joined?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/challenge?checkout=cancelled`,
      client_reference_id: email.toLowerCase(),
      "metadata[challenge_start]": CHALLENGE_START_DATE_LABEL,
      "metadata[first_name]": firstName,
      "metadata[last_name]": lastName,
      "metadata[phone]": phone,
      "payment_intent_data[metadata][challenge_start]": CHALLENGE_START_DATE_LABEL,
    });
    return NextResponse.json({ ok: true, mode: "checkout", url: session.url });
  } catch (err) {
    console.error("challenge-signup failed", err);
    return NextResponse.json({ error: "Something went wrong on our end. Please try again." }, { status: 500 });
  }
}
