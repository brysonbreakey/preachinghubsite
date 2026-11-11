import { createHmac, timingSafeEqual } from "crypto";

// The little bit of Stripe the challenge needs, over Stripe's plain REST API (no SDK, so no new
// dependency): create a one-time Checkout Session, and check a webhook's signature.
// STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are set in this project's Vercel environment.

/** True when this deployment can take payments. The challenge page and signup route use it to fall
 *  back to the waitlist automatically if the Stripe settings aren't in place. */
export function stripePaymentsConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET);
}

export async function createCheckoutSession(params: Record<string, string>): Promise<{ id: string; url: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("stripe: STRIPE_SECRET_KEY not configured");
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.url) throw new Error(`stripe: checkout session failed (${res.status}): ${data?.error?.message ?? "no url"}`);
  return { id: data.id, url: data.url };
}

export type CheckoutSessionInfo = {
  payment_status?: string;
  customer_email?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
};

/** Looks a Checkout Session up by id (null if Stripe doesn't know it or can't be reached). */
export async function retrieveCheckoutSession(id: string): Promise<CheckoutSessionInfo | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(id)) return null;
  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${id}`, { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" });
    return res.ok ? ((await res.json()) as CheckoutSessionInfo) : null;
  } catch {
    return null;
  }
}

/** Verifies a `Stripe-Signature` header against the raw request body (5-minute tolerance). */
export function verifyStripeSignature(rawBody: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header) return false;
  const parts = header.split(",").map((p) => p.split("=") as [string, string]);
  const t = parts.find(([k]) => k === "t")?.[1];
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!t || signatures.length === 0) return false;
  if (Math.abs(now / 1000 - Number(t)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest();
  return signatures.some((sig) => {
    const given = Buffer.from(sig, "hex");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
}
