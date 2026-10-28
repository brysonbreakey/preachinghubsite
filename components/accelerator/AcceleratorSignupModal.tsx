"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { APP_URL } from "@/lib/urls";

// Two paths through the same popup:
//  - "accelerator" (Claim my slot): account details, then the card on the next step, then $49 is
//    charged and they're signed straight into the app with their coaching slot claimed.
//  - "trial" (the small "no thanks, free week" link): the original no-card account creation, the
//    same flow the old /checklist/thank-you page used (ChecklistThankYouTrial). Kept as its own copy so the new
//    page can be built and tested without touching the live one.
// The app does the real work (/api/accelerator/start and /finish); this file is the screens.

const PREFILL_KEY = "ph_checklist_thank_you_prefill";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const TRIAL_SETUP_STEPS = ["Creating your account", "Starting your 7-day trial", "Opening your workspace"];
const PAID_SETUP_STEPS = ["Payment received", "Reserving your coaching slot", "Opening your workspace"];

type Mode = "accelerator" | "trial";
type PayData = { clientSecret: string; claimToken: string; subscriptionId: string; skipTokenHash: string | null };

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

// Formats as the person types: digits only, shown as 555-123-4567. A leading country code "1" (from
// autofill or a pasted +1 number) is dropped so it doesn't push the real number past ten digits.
function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function SettingUpOverlay({ firstName, steps, heading }: { firstName: string; steps: string[]; heading?: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= steps.length - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), 1800);
    return () => clearTimeout(t);
  }, [active, steps.length]);
  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-full max-w-sm text-center">
        <style>{`@keyframes ph-slide { 0% { transform: translateX(-110%); } 100% { transform: translateX(310%); } }`}</style>
        <div aria-hidden className="mx-auto mb-6 w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#4F46E5] animate-spin" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {heading ?? (firstName ? `Welcome, ${firstName}.` : "Welcome.")}
        </h2>
        <p className="text-slate-500 mt-2">Setting up your account…</p>
        <ol className="mt-8 space-y-3 text-left inline-block">
          {steps.map((label, i) => (
            <li key={label} className={`flex items-center gap-3 text-sm ${i < active ? "text-slate-400" : i === active ? "text-slate-900 font-medium" : "text-slate-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${i < active ? "bg-green-500 border-green-500" : i === active ? "border-[#4F46E5]" : "border-slate-200"}`}>
                {i < active ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : i === active ? (
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
                ) : null}
              </span>
              {label}
              {i === active ? "…" : ""}
            </li>
          ))}
        </ol>
        <div aria-hidden className="mt-8 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-[#4F46E5]" style={{ animation: "ph-slide 1.3s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

function proceedWithTokenHash(tokenHash: string) {
  window.location.href = `${APP_URL}/auth/callback?${new URLSearchParams({
    token_hash: tokenHash,
    type: "magiclink",
    next: "/",
  }).toString()}`;
}

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]";
const PRIMARY_BUTTON_CLASS =
  "mt-2 w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors disabled:opacity-60 [color:#fff]";

// ── Step 2 of the accelerator path: the card ────────────────────────────────────────────────
function PayStep({
  pay,
  email,
  name,
  onBack,
  onPaid,
  onSkipTrial,
  startsOn,
}: {
  pay: PayData;
  email: string;
  name: string;
  onBack: () => void;
  onPaid: () => void;
  onSkipTrial: () => void;
  startsOn?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    posthog.capture("accelerator_card_step_viewed");
  }, []);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setSubmitting(true);
    posthog.capture("accelerator_pay_clicked");

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: { billing_details: { name, email } },
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Your card couldn't be charged. Please try another card.");
      setSubmitting(false);
      posthog.capture("accelerator_pay_failed", { code: confirmError.code ?? confirmError.type });
      return;
    }
    if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
      posthog.capture("accelerator_pay_succeeded");
      onPaid();
      return;
    }
    setError("Your payment needs one more step. Please try again.");
    setSubmitting(false);
  }

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm space-y-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-700 font-medium">PreachingHub membership</span>
          <span className="font-black text-slate-900 shrink-0">$49 today</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-700 font-medium">1:1 coaching session{startsOn ? ` (round of ${startsOn})` : ""}</span>
          <span className="shrink-0"><span className="text-slate-400 line-through text-xs mr-2">$225</span><span className="font-black text-emerald-600">FREE</span></span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-700 font-medium">30-Day Growth Sprint Plan</span>
          <span className="shrink-0"><span className="text-slate-400 line-through text-xs mr-2">$125</span><span className="font-black text-emerald-600">FREE</span></span>
        </div>
      </div>

      {error && <div role="alert" className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{error}</div>}

      <PaymentElement onReady={() => setReady(true)} options={{ layout: "tabs" }} />

      <button type="submit" disabled={!stripe || !ready || submitting} className={PRIMARY_BUTTON_CLASS}>
        {submitting ? "Processing…" : "Pay $49 and claim my slot"}
      </button>
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        Then $49/month. Cancel anytime. 30-day money-back guarantee, even after your coaching session.
      </p>
      <div className="flex flex-col items-center gap-2 text-sm pt-1">
        {pay.skipTokenHash && (
          <button type="button" onClick={onSkipTrial} disabled={submitting} className="text-center text-slate-500 hover:text-slate-900 underline underline-offset-2 disabled:opacity-50">
            No thanks, start my free week instead
            <br />
            (No 1:1 coaching or 30-Day Growth Plan)
          </button>
        )}
        <button type="button" onClick={onBack} disabled={submitting} className="text-slate-400 hover:text-slate-900 underline underline-offset-2 disabled:opacity-50">← Back</button>
      </div>
    </form>
  );
}

export function AcceleratorSignupModal({
  intent,
  onClose,
  startsOn,
}: {
  intent: "accelerator" | "trial";
  onClose: () => void;
  /** Round start date for the card step's summary, e.g. "November 2nd". */
  startsOn?: string;
}) {
  // Name/email carried over from /checklist via sessionStorage. The modal only ever mounts after a
  // click (never on the server), so reading it in the initial state is safe.
  const [prefill] = useState(() => {
    try {
      const raw = sessionStorage.getItem(PREFILL_KEY);
      return raw ? (JSON.parse(raw) as { name?: string; email?: string }) : {};
    } catch {
      return {} as { name?: string; email?: string };
    }
  });
  const [mode, setMode] = useState<Mode>(intent);
  const [name, setName] = useState(prefill.name ?? "");
  const [email, setEmail] = useState(prefill.email ?? "");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paid, setPaid] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [pay, setPay] = useState<PayData | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = useMemo(() => (publishableKey ? loadStripe(publishableKey) : null), [publishableKey]);

  useEffect(() => {
    nameRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !submitting && !paid) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function attemptLogin() {
    try {
      const res = await fetch(`${APP_URL}/api/auth/offer-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token_hash) {
        setErrorCode(data?.error === "invalid_credentials" ? "wrong_password" : (data?.error ?? "signup_failed"));
        setSubmitting(false);
        return;
      }
      proceedWithTokenHash(data.token_hash);
    } catch {
      setErrorCode("signup_failed");
      setSubmitting(false);
    }
  }

  function validate(): boolean {
    if (!name.trim()) { setErrorCode("name_required"); return false; }
    if (!EMAIL_RE.test(email.trim())) { setErrorCode("invalid_email"); return false; }
    if (mode === "accelerator" && phone.replace(/\D/g, "").length < 10) { setErrorCode("invalid_phone"); return false; }
    if (password.length < 6) { setErrorCode("weak_password"); return false; }
    return true;
  }

  // Accelerator path, step 1: make the account and the unpaid $49 subscription, then show the card.
  async function startPayment() {
    setSubmitting(true);
    posthog.capture("checklist_trial_signup_submitted", { variant: "accelerator", intent: "accelerator" });
    const { firstName, lastName } = splitName(name);
    try {
      const res = await fetch(`${APP_URL}/api/accelerator/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, first_name: firstName, last_name: lastName, phone }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.client_secret) {
        if (data?.error === "already_subscribed") { await attemptLogin(); return; }
        setErrorCode(data?.error ?? "signup_failed");
        setSubmitting(false);
        return;
      }
      setPay({ clientSecret: data.client_secret, claimToken: data.claim_token, subscriptionId: data.subscription_id, skipTokenHash: data.skip_token_hash ?? null });
      setSubmitting(false);
    } catch {
      setErrorCode("signup_failed");
      setSubmitting(false);
    }
  }

  // Accelerator path, step 3: the card is charged; confirm with the app and sign them in.
  async function finishPayment() {
    if (!pay) return;
    setPaid(true);
    try {
      const res = await fetch(`${APP_URL}/api/accelerator/finish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim_token: pay.claimToken, subscription_id: pay.subscriptionId }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token_hash) {
        setPaid(false);
        setPay(null);
        setErrorCode("paid_login_failed");
        return;
      }
      proceedWithTokenHash(data.token_hash);
    } catch {
      setPaid(false);
      setPay(null);
      setErrorCode("paid_login_failed");
    }
  }

  // Free-week path (the original flow): account only, no card.
  async function startTrial() {
    setSubmitting(true);
    // Same event name the funnel already counts for the form-submitted step; `variant` tells the pages apart.
    posthog.capture("checklist_trial_signup_submitted", { variant: "accelerator", intent: "trial" });
    const { firstName, lastName } = splitName(name);
    try {
      const res = await fetch(`${APP_URL}/api/auth/offer-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, first_name: firstName, last_name: lastName }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.token_hash) {
        if (data?.error === "account_exists") {
          await attemptLogin();
          return;
        }
        setErrorCode(data?.error ?? "signup_failed");
        setSubmitting(false);
        return;
      }
      proceedWithTokenHash(data.token_hash);
    } catch {
      setErrorCode("signup_failed");
      setSubmitting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorCode(null);
    if (!validate()) return;
    if (mode === "accelerator") await startPayment();
    else await startTrial();
  }

  const forgotPasswordHref = `${APP_URL}/auth/login?mode=forgot`;
  const isPaidMode = mode === "accelerator";
  const onPayStep = isPaidMode && pay !== null && !paid;

  return (
    <>
      {submitting && !isPaidMode && <SettingUpOverlay firstName={splitName(name).firstName} steps={TRIAL_SETUP_STEPS} />}
      {paid && <SettingUpOverlay firstName={splitName(name).firstName} steps={PAID_SETUP_STEPS} heading={splitName(name).firstName ? `You're in, ${splitName(name).firstName}.` : "You're in."} />}
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-[2px] sm:p-6"
        onMouseDown={(e) => { if (e.target === e.currentTarget && !submitting && !paid) onClose(); }}
      >
        <div role="dialog" aria-modal="true" aria-labelledby="acc-signup-title" className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-7 sm:p-9 max-h-[100dvh] overflow-y-auto">
          <button type="button" onClick={onClose} disabled={submitting || paid} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>

          <h2 id="acc-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight pr-8">
            {onPayStep ? "Secure your coaching slot" : isPaidMode ? "Claim your coaching slot" : "Start your free 7-day trial"}
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            {onPayStep
              ? `Almost done, ${splitName(name).firstName || "Pastor"}. Your card is charged $49 today.`
              : isPaidMode
                ? "$49 today includes your platform access, 1:1 coaching session, and 30-day growth plan."
                : "Try PreachingHub first. No card is needed to get started, and you'll choose how to continue when you're ready."}
          </p>

          {errorCode === "paid_login_failed" && (
            <div role="alert" className="mb-4 rounded-lg bg-amber-50 border border-amber-100 text-amber-900 text-sm px-4 py-3">
              Your payment went through, and your slot is being saved. We just couldn&apos;t sign you in automatically.{" "}
              <a href={`${APP_URL}/auth/login`} className="font-semibold underline">Sign in with your email and password →</a>
            </div>
          )}

          {onPayStep && stripePromise ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: pay!.clientSecret,
                appearance: { theme: "stripe", variables: { colorPrimary: "#4F46E5", borderRadius: "12px", fontFamily: "Inter, system-ui, sans-serif" } },
              }}
            >
              <PayStep
                pay={pay!}
                email={email.trim()}
                name={name.trim()}
                startsOn={startsOn}
                onBack={() => setPay(null)}
                onPaid={finishPayment}
                onSkipTrial={() => pay?.skipTokenHash && proceedWithTokenHash(pay.skipTokenHash)}
              />
            </Elements>
          ) : onPayStep ? (
            <div role="alert" className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
              Payments are temporarily unavailable. Please try again in a few minutes, or{" "}
              {pay?.skipTokenHash ? <button type="button" onClick={() => proceedWithTokenHash(pay.skipTokenHash!)} className="font-semibold underline">start your free week</button> : "start your free week"} for now.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {errorCode === "wrong_password" ? (
                <div className="rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-sm px-4 py-3">
                  You already have an account with this email, but that password doesn&apos;t match.{" "}
                  <a href={forgotPasswordHref} className="font-semibold underline">Reset your password →</a>
                </div>
              ) : errorCode === "round_full" ? (
                <div className="rounded-lg bg-amber-50 border border-amber-100 text-amber-900 text-sm px-4 py-3">
                  This round just filled up, so there&apos;s no coaching slot to claim right now. You can still{" "}
                  <button type="button" onClick={() => { setMode("trial"); setErrorCode(null); }} className="font-semibold underline">start your free week</button>.
                </div>
              ) : errorCode && errorCode !== "paid_login_failed" ? (
                <div className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
                  {errorCode === "invalid_email" && "Enter a valid email address."}
                  {errorCode === "weak_password" && "Password must be at least 6 characters."}
                  {errorCode === "name_required" && "Enter your name."}
                  {errorCode === "invalid_phone" && "Enter a valid mobile number."}
                  {errorCode === "rate_limited" && "Too many attempts. Please wait a few minutes and try again."}
                  {(errorCode === "signup_failed" || errorCode === "login_failed" || errorCode === "payment_setup_failed") && "Something went wrong on our end. Please try again."}
                </div>
              ) : null}

              <div>
                <label htmlFor="acc-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input id="acc-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="acc-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={INPUT_CLASS} />
              </div>
              {isPaidMode && (
                <div>
                  <label htmlFor="acc-phone" className="block text-sm font-medium text-slate-700 mb-1.5">Mobile number</label>
                  <input id="acc-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} autoComplete="tel" placeholder="555-123-4567" className={INPUT_CLASS} />
                  <p className="mt-1.5 text-[11px] leading-snug text-slate-400">
                    By continuing, you agree to receive text messages from PreachingHub about your coaching session and your account. Msg frequency varies. Msg &amp; data rates may apply. Reply STOP to cancel, HELP for help. See our{" "}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a> and{" "}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>.
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="acc-password" className="block text-sm font-medium text-slate-700 mb-1.5">Create a Password</label>
                <input id="acc-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 6 characters" className={INPUT_CLASS} />
              </div>

              <button type="submit" disabled={submitting} className={PRIMARY_BUTTON_CLASS}>
                {isPaidMode
                  ? (submitting ? "One moment…" : "Continue to payment →")
                  : (submitting ? "Creating your account…" : "Create my account →")}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
