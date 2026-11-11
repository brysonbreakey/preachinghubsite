import { NextRequest, NextResponse } from "next/server";
import { CHALLENGE_START_DATE_LABEL } from "@/lib/challenge";
import { createChallengeLink, createChallengePaymentAlert } from "@/lib/challengeToken";
import { APP_URL } from "@/lib/urls";
import { addSevenDayChallengeContact } from "@/lib/kit";
import { verifyStripeSignature } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";

// Stripe calls this when the $7 challenge payment goes through. It is what lets someone into the
// challenge: the "7-day-challenge" tag, the start/pass-end/day fields and the emailed access link
// are all set here and nowhere else. Configure it in Stripe (Developers > Webhooks) for the
// events checkout.session.completed and checkout.session.async_payment_succeeded.
// A non-2xx answer makes Stripe retry; everything below is safe to run twice.
export const dynamic = "force-dynamic";

type CheckoutSession = {
  payment_status?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
};

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text();
  if (!secret || !verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret)) {
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }
  let event: { type?: string; data?: { object?: CheckoutSession } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }
  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ ok: true, ignored: event.type });
  }
  const session = event.data?.object;
  // Only this cohort's challenge payments, and only once the money has actually arrived.
  if (!session || session.metadata?.challenge_start !== CHALLENGE_START_DATE_LABEL) {
    return NextResponse.json({ ok: true, ignored: "not a challenge payment" });
  }
  if (session.payment_status !== "paid") {
    return NextResponse.json({ ok: true, ignored: "not paid yet" });
  }
  const email = (session.customer_details?.email || session.customer_email || "").trim();
  if (!email) {
    console.error("challenge webhook: paid session without an email");
    return NextResponse.json({ ok: true, ignored: "no email" });
  }
  const firstName = session.metadata?.first_name ?? "";
  const lastName = session.metadata?.last_name ?? "";
  const phone = session.metadata?.phone ?? "";

  try {
    const challengeLink = createChallengeLink({ email, firstName, lastName });
    await addSevenDayChallengeContact({ email, firstName, lastName, phone, challengeLink });
  } catch (err) {
    console.error("challenge webhook: kit failed", err);
    return NextResponse.json({ error: "kit failed" }, { status: 500 }); // Stripe will retry
  }

  // Tell Bryson right away ("New Challenge Member!"). The app is what sends email, so ask it to.
  // Best effort: a failure here must never undo or block letting the person in.
  try {
    const token = createChallengePaymentAlert({ email, firstName, lastName });
    if (token) {
      await fetch(`${APP_URL}/api/challenge/payment-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(5000),
      });
    }
  } catch (err) {
    console.error("challenge webhook: payment alert failed", err);
  }

  // The challenge run roster in the app's database (best effort: the tag above is what matters).
  try {
    const { data: activeRun } = await supabaseAdmin().from("challenge_runs").select("id").eq("is_active", true).maybeSingle();
    if (activeRun?.id) {
      await supabaseAdmin()
        .from("challenge_participants")
        .upsert(
          {
            challenge_run_id: activeRun.id,
            email: email.toLowerCase(),
            first_name: firstName || null,
            last_name: lastName || null,
            phone: phone || null,
            signed_up_at: new Date().toISOString(),
          },
          { onConflict: "challenge_run_id,email", ignoreDuplicates: true },
        );
    }
  } catch (err) {
    console.error("challenge webhook: roster add failed", err);
  }
  return NextResponse.json({ ok: true });
}
