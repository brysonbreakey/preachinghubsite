"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { APP_URL } from "@/lib/urls";

const BENEFITS = [
  "Prep and organize your sermons in one place",
  "Get AI expert coaching on every sermon you preach",
  "Access templates, research tools, and more",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const PREFILL_KEY = "ph_checklist_thank_you_prefill";

function useCountdown(expiresAt: number): number {
  const [msLeft, setMsLeft] = useState(() => Math.max(0, expiresAt - Date.now()));
  useEffect(() => {
    const id = setInterval(() => setMsLeft(Math.max(0, expiresAt - Date.now())), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  return msLeft;
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

export function ChecklistThankYouOffer({
  token,
  expiresAt,
  fromChecklist = true,
}: {
  token: string;
  expiresAt: number;
  // False for the standalone /1-dollar-month page, which people can be sent
  // to directly with no checklist download involved — just the copy that
  // references the checklist, everything else (form, checkout, countdown)
  // is identical.
  fromChecklist?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    posthog.capture("checklist_offer_viewed");
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

  const msLeft = useCountdown(expiresAt);
  const expired = msLeft <= 0;

  function proceedWithTokenHash(tokenHash: string) {
    const next = `/account/plan?offer=${encodeURIComponent(token)}`;
    window.location.href = `${APP_URL}/auth/callback?${new URLSearchParams({
      token_hash: tokenHash,
      type: "magiclink",
      next,
    }).toString()}`;
  }

  // Tries to create the account first. If that email already has one, this
  // page doubles as a login instead of bouncing to a separate page — retries
  // the SAME password as a sign-in, transparently, no second click. Only a
  // wrong password (or no account failing both ways) surfaces as an error.
  async function attemptLogin() {
    try {
      const res = await fetch(`${APP_URL}/api/auth/offer-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, offer: token }),
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
    posthog.capture("checklist_offer_signup_submitted");
    const { firstName, lastName } = splitName(name);

    try {
      const res = await fetch(`${APP_URL}/api/auth/offer-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          first_name: firstName,
          last_name: lastName,
          offer: token,
        }),
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

  const forgotPasswordHref = `${APP_URL}/auth/login?${new URLSearchParams({
    mode: "forgot",
    next: `/account/plan?offer=${token}`,
  }).toString()}`;

  return (
    <main>
      {/* Slim confirmation banner — no nav, nothing to click away to, so the
          only thing on this page to do is the offer below. */}
      {fromChecklist && (
        <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-6 text-center">
          <p className="text-sm text-blue-900">
            🎉 Your checklist is on its way — check your inbox (and spam folder) in a few minutes.
          </p>
        </div>
      )}

      <section className="bg-slate-50 pt-12 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "#3760ad" }}>
              {expired ? (
                "SPECIAL OFFER · ENDED"
              ) : (
                <>
                  SPECIAL OFFER · expires in{" "}
                  <span className="font-mono tabular-nums">{formatCountdown(msLeft)}</span>
                </>
              )}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Your first month of PreachingHub for $1
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              {fromChecklist
                ? "You just grabbed the checklist. Here's a way to put it to work: your first month of full access to the platform built for preachers."
                : "Your first month of full access to the platform built for preachers — sermon prep, AI coaching, templates, and more."}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">
            <ul className="space-y-3 mb-6">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 shrink-0"><Icon d="M20 6 9 17l-5-5" size={18} color="#16a34a" strokeWidth={2.5} /></span>
                  {b}
                </li>
              ))}
            </ul>

            {expired ? (
              <div className="w-full text-center px-6 py-4 rounded-xl bg-slate-100 text-slate-500 text-sm">
                This offer has ended, but you can still start a free 14-day trial.
                <br />
                <a href={`${APP_URL}/auth/login?mode=signup&source=checklist_offer_expired`} className="font-semibold underline" style={{ color: "#3760ad" }}>
                  Start your free trial →
                </a>
              </div>
            ) : (
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
                    {errorCode === "offer_expired" && "This offer has ended — refresh the page to see your free trial option."}
                    {(errorCode === "signup_failed" || errorCode === "offer_invalid") &&
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
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters — or your existing password"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3760ad]/30 focus:border-[#3760ad]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white disabled:opacity-60"
                  style={{ backgroundColor: "#3760ad" }}
                >
                  {submitting ? "Starting your $1 month…" : "Start my $1 month →"}
                </button>
              </form>
            )}
            <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
              You&apos;ll be taken to secure checkout to add a card. $1 today for your first month, $49/month after that unless you cancel first.
              <br />
              {fromChecklist
                ? "A one-time offer for checklist readers, available for 24 hours after you download it."
                : "A one-time offer, available for 24 hours from when you first view this page."}
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
