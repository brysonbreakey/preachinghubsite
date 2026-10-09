"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Footer } from "@/components/Footer";
import { WhatsIncluded } from "@/components/WhatsIncluded";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { APP_URL } from "@/lib/urls";

const PREFILL_KEY = "ph_checklist_thank_you_prefill";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

// Replaces the $1-offer version on /checklist/thank-you — this is now a
// straight-to-trial page, encouraging them toward their NEXT sermon rather
// than selling a specific offer. Same inline account-creation pattern as the
// $1-offer pages (create the account here, no bounce to a separate signup
// page), just without an offer token — /api/auth/offer-signup and
// offer-login both treat a missing offer as a plain 7-day-trial signup.
// Shown the moment they hit "Start My Free Trial". Creating the account and the trial
// takes a few seconds (the app sets up their plan before it hands them over), and the
// form just sitting there reads as stuck — this makes the wait read as progress. It's
// dismissed on any error, since `submitting` goes back to false.
const SETUP_STEPS = ["Creating your account", "Starting your 7-day trial", "Opening your workspace"];

function SettingUpOverlay({ firstName }: { firstName: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= SETUP_STEPS.length - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), 1800);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-full max-w-sm text-center">
        {/* Always-moving: a spinner and a sliding bar, so even a slow few seconds can't look frozen. */}
        <style>{`@keyframes ph-slide { 0% { transform: translateX(-110%); } 100% { transform: translateX(310%); } }`}</style>
        <div aria-hidden className="mx-auto mb-6 w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#3760ad] animate-spin" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}
        </h2>
        <p className="text-slate-500 mt-2">Setting up your trial…</p>
        <ol className="mt-8 space-y-3 text-left inline-block">
          {SETUP_STEPS.map((label, i) => (
            <li key={label} className={`flex items-center gap-3 text-sm ${i < active ? "text-slate-400" : i === active ? "text-slate-900 font-medium" : "text-slate-300"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${i < active ? "bg-green-500 border-green-500" : i === active ? "border-[#3760ad]" : "border-slate-200"}`}>
                {i < active ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                ) : i === active ? (
                  <span className="w-2 h-2 rounded-full bg-[#3760ad] animate-pulse" />
                ) : null}
              </span>
              {label}
              {i === active ? "…" : ""}
            </li>
          ))}
        </ol>
        <div aria-hidden className="mt-8 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
          <div className="h-full w-1/3 rounded-full bg-[#3760ad]" style={{ animation: "ph-slide 1.3s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

export function ChecklistThankYouTrial() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PREFILL_KEY);
      if (raw) {
        const prefill = JSON.parse(raw) as { name?: string; email?: string };
        if (prefill.name) setName(prefill.name);
        if (prefill.email) setEmail(prefill.email);
      }
    } catch {
      // Best-effort only — worst case the fields start blank.
    }
  }, []);

  function proceedWithTokenHash(tokenHash: string) {
    window.location.href = `${APP_URL}/auth/callback?${new URLSearchParams({
      token_hash: tokenHash,
      type: "magiclink",
      next: "/",
    }).toString()}`;
  }

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorCode(null);

    if (!name.trim()) return setErrorCode("name_required");
    if (!EMAIL_RE.test(email.trim())) return setErrorCode("invalid_email");
    if (password.length < 6) return setErrorCode("weak_password");

    setSubmitting(true);
    posthog.capture("checklist_trial_signup_submitted");
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

  const forgotPasswordHref = `${APP_URL}/auth/login?mode=forgot`;

  return (
    <main>
      {submitting && <SettingUpOverlay firstName={splitName(name).firstName} />}
      {/* Same confirmation banner as before — unchanged. */}
      <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-6 text-center">
        <p className="text-sm text-blue-900">
          🎉 Your checklist is on its way — check your inbox (and spam folder) in a few minutes.
        </p>
      </div>

      <section className="bg-slate-50 pt-12 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-3 mt-3">
              Make Your Next Sermon Your Best One Yet
            </h1>
            <p className="text-sm font-bold uppercase tracking-wide mb-5" style={{ color: "#3760ad" }}>
              Free Trial · No Card Required
            </p>
            <p className="text-lg text-slate-500 leading-relaxed mb-4">
              Use the Sermon Builder to work through your message step by step with actionable coaching feedback
              along the way, before you ever step into the pulpit.
            </p>
            <p className="text-lg text-slate-500 leading-relaxed">
              Try it free.{" "}
              <strong className="font-semibold text-slate-700">No card required.</strong>
            </p>
          </div>

          <FeatureHighlights />
          <WhatsIncluded label="See all features" />

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {errorCode === "wrong_password" ? (
                <div className="rounded-lg bg-amber-50 border border-amber-100 text-amber-800 text-sm px-4 py-3">
                  You already have an account with this email, but that password doesn&apos;t match.{" "}
                  <a href={forgotPasswordHref} className="font-semibold underline">Reset your password →</a>
                </div>
              ) : errorCode ? (
                <div className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
                  {errorCode === "invalid_email" && "Enter a valid email address."}
                  {errorCode === "weak_password" && "Password must be at least 6 characters."}
                  {errorCode === "name_required" && "Enter your name."}
                  {errorCode === "rate_limited" && "Too many attempts — please wait a few minutes and try again."}
                  {(errorCode === "signup_failed" || errorCode === "login_failed") &&
                    "Something went wrong on our end. Please try again."}
                </div>
              ) : null}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3760ad]/30 focus:border-[#3760ad]"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3760ad]/30 focus:border-[#3760ad]"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Create a Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3760ad]/30 focus:border-[#3760ad]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white disabled:opacity-60"
                style={{ backgroundColor: "#3760ad" }}
              >
                {submitting ? "Starting your trial…" : "Start My Free Trial →"}
              </button>
            </form>
            <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
              7-day free trial, <strong className="font-semibold text-slate-500">no card required.</strong> Full access to the entire PreachingHub platform.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
