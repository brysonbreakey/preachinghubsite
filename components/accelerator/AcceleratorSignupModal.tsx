"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { APP_URL } from "@/lib/urls";

// Same inline account-creation flow as /checklist/thank-you (ChecklistThankYouTrial):
// create the account here, no card, then hand off to the app. Kept as its own copy so the
// new page can be built and tested without touching the live one; once this page replaces
// the old one, the old component can go.

const PREFILL_KEY = "ph_checklist_thank_you_prefill";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const SETUP_STEPS = ["Creating your account", "Starting your 7-day trial", "Opening your workspace"];

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

function SettingUpOverlay({ firstName }: { firstName: string }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= SETUP_STEPS.length - 1) return;
    const t = setTimeout(() => setActive((a) => a + 1), 1800);
    return () => clearTimeout(t);
  }, [active]);
  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 flex items-center justify-center px-6" role="status" aria-live="polite">
      <div className="w-full max-w-sm text-center">
        <style>{`@keyframes ph-slide { 0% { transform: translateX(-110%); } 100% { transform: translateX(310%); } }`}</style>
        <div aria-hidden className="mx-auto mb-6 w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#4F46E5] animate-spin" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {firstName ? `Welcome, ${firstName}.` : "Welcome."}
        </h2>
        <p className="text-slate-500 mt-2">Setting up your account…</p>
        <ol className="mt-8 space-y-3 text-left inline-block">
          {SETUP_STEPS.map((label, i) => (
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

export function AcceleratorSignupModal({ intent, onClose }: { intent: "accelerator" | "trial"; onClose: () => void }) {
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
  const [name, setName] = useState(prefill.name ?? "");
  const [email, setEmail] = useState(prefill.email ?? "");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !submitting) onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // Same event name the funnel already counts for the form-submitted step; `variant` tells the pages apart.
    posthog.capture("checklist_trial_signup_submitted", { variant: "accelerator", intent });
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
  const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]";

  return (
    <>
      {submitting && <SettingUpOverlay firstName={splitName(name).firstName} />}
      <div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-[2px] sm:p-6"
        onMouseDown={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
      >
        <div role="dialog" aria-modal="true" aria-labelledby="acc-signup-title" className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-7 sm:p-9 max-h-[100dvh] overflow-y-auto">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
          <h2 id="acc-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight pr-8">
            {intent === "trial" ? "Start your free 7-day trial" : "Create your free account"}
          </h2>
          <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
            Try PreachingHub first. No card is needed to get started, and you&apos;ll choose how to continue when you&apos;re ready.
          </p>

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
                {errorCode === "rate_limited" && "Too many attempts. Please wait a few minutes and try again."}
                {(errorCode === "signup_failed" || errorCode === "login_failed") && "Something went wrong on our end. Please try again."}
              </div>
            ) : null}

            <div>
              <label htmlFor="acc-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
              <input id="acc-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="acc-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input id="acc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="acc-password" className="block text-sm font-medium text-slate-700 mb-1.5">Create a Password</label>
              <input id="acc-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" className={inputClass} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors disabled:opacity-60 [color:#fff]"
            >
              {submitting ? "Creating your account…" : "Create my account →"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
