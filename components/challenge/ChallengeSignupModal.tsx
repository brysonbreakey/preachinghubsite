"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { SmsConsentNotice } from "@/components/SmsConsentNotice";
import type { ChallengePhase } from "@/lib/challenge";
import { APP_URL } from "@/lib/urls";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]";

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

// 555-123-4567 as they type, ten digits max (same as the other lead forms).
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean).join("-");
}

// The signup popup for the Free 7-Day Preaching Growth Challenge: name, email, phone, then a
// confirmation right in the popup. The server (/api/challenge-signup) adds them to Kit: tagged
// 7-day-challenge (with their personal access link, emailed by Kit) until enrollment closes, and
// 7-day-challenge-waitlist after. The server decides which, so the confirmation follows its answer.
// Joining before enrollment closes continues to a second step in the same popup: pick a password
// and get a PreachingHub account on the spot, signed in and sent to the pre-challenge homework (the
// app's /evaluate). An email that already has an account is sent to sign in instead; "later" falls
// back to the emailed access link.
export function ChallengeSignupModal({ phase, onClose }: { phase: ChallengePhase; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"form" | "loading" | "error" | "done">("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<"joined" | "waitlist" | null>(null);
  const [claim, setClaim] = useState<string | null>(null);
  const [account, setAccount] = useState<"create" | "creating" | "existing" | "later">("create");
  const [password, setPassword] = useState("");
  const [accountError, setAccountError] = useState("");
  const waitlistView = result ? result === "waitlist" : phase === "closed";
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fail = (message: string) => { setStatus("error"); setErrorMessage(message); };
    if (!name.trim()) return fail("Enter your name.");
    if (!EMAIL_RE.test(email.trim())) return fail("Enter a valid email address.");
    if (phone.replace(/\D/g, "").length !== 10) return fail("Enter a valid 10-digit phone number.");

    setStatus("loading");
    const { firstName, lastName } = splitName(name);
    try {
      const res = await fetch("/api/challenge-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email.trim(), phone: phone.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "submit_failed");
      const mode: "joined" | "waitlist" = data?.mode === "waitlist" ? "waitlist" : "joined";
      setResult(mode);
      setClaim(typeof data?.claim === "string" ? data.claim : null);
      posthog.capture(mode === "waitlist" ? "challenge_waitlist_submitted" : "challenge_signup_submitted", { phase });
      // So the accelerator signup popup, if they open it later, doesn't make them retype these.
      try {
        sessionStorage.setItem("ph_checklist_thank_you_prefill", JSON.stringify({ name: name.trim(), email: email.trim() }));
      } catch {
        // Best-effort only.
      }
      setStatus("done");
    } catch (err) {
      fail(err instanceof Error && err.message !== "submit_failed" ? err.message : "Something went wrong on our end. Please try again.");
    }
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    if (!claim) return;
    if (password.length < 6) {
      setAccountError("Choose a password with at least 6 characters.");
      return;
    }
    setAccountError("");
    setAccount("creating");
    try {
      const res = await fetch(`${APP_URL}/api/challenge/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, password }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 409) {
        posthog.capture("challenge_account_existing", { phase });
        setAccount("existing");
        return;
      }
      if (!res.ok || !data?.token_hash) throw new Error("account_failed");
      posthog.capture("challenge_account_created", { phase });
      // A normal top-level redirect, the same handoff the other marketing sign-ups use.
      const params = new URLSearchParams({ token_hash: data.token_hash, type: "magiclink", next: "/evaluate?from=challenge" });
      window.location.assign(`${APP_URL}/auth/callback?${params.toString()}`);
    } catch {
      setAccount("create");
      setAccountError("We couldn't create your account just now. Try again, or tap \u201cI'll do it later\u201d and use the link we email you.");
    }
  }

  // After joining, before enrollment closes: step 2 of the popup.
  const accountStep = status === "done" && result === "joined" && !!claim && account !== "later";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-[2px] sm:p-6"
      onMouseDown={(e) => { if (e.target === e.currentTarget && status !== "loading") onClose(); }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="challenge-signup-title" className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl p-7 sm:p-9 max-h-[100dvh] overflow-y-auto">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        {accountStep ? (
          <div className="text-center py-2">
            <p className="text-5xl mb-4">🎉</p>
            {account === "existing" ? (
              <>
                <h2 id="challenge-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">You already have an account</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  Sign in with your PreachingHub email and we&apos;ll add your free challenge access and take you to your homework.
                </p>
                <a
                  href={`${APP_URL}/auth/login?mode=login&next=${encodeURIComponent(`/evaluate?from=challenge&c=${claim}`)}`}
                  onClick={() => posthog.capture("challenge_existing_signin_clicked", { phase })}
                  className="block w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors [color:#fff]"
                >
                  Sign in to start
                </a>
              </>
            ) : (
              <>
                <h2 id="challenge-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">You&apos;re in! Let&apos;s start your homework.</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">
                  Choose a password to open your free PreachingHub account. Your pre-challenge homework takes less than 5 minutes: upload a sermon and get your first coaching report.
                </p>
                <form onSubmit={handleCreateAccount} noValidate className="space-y-3 text-left">
                  {accountError && <div role="alert" className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{accountError}</div>}
                  <div>
                    <label htmlFor="challenge-password" className="block text-sm font-medium text-slate-700 mb-1.5">Choose a password</label>
                    <input id="challenge-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" autoFocus className={INPUT_CLASS} />
                  </div>
                  <button
                    type="submit"
                    disabled={account === "creating"}
                    className="mt-1 w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors disabled:opacity-60 [color:#fff]"
                  >
                    {account === "creating" ? "Creating…" : "Start my homework"}
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => { posthog.capture("challenge_account_later", { phase }); setAccount("later"); }}
                  className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-600"
                >
                  I&apos;ll do it later
                </button>
              </>
            )}
          </div>
        ) : status === "done" ? (
          <div className="text-center py-4">
            <p className="text-5xl mb-4">🎉</p>
            <h2 id="challenge-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
              {waitlistView ? "You\u2019re on the waitlist" : "You\u2019re in!"}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              {waitlistView
                ? "We'll email you if a spot opens or when we run it again."
                : phase === "before"
                  ? "Watch your inbox (and your spam folder) for your PreachingHub access link, your pre-challenge homework (it's not a lot, don't worry) and what happens next. The challenge starts Tuesday, November 17."
                  : "Watch your inbox (and your spam folder) for your PreachingHub access link and what happens next."}
            </p>
            <button type="button" onClick={onClose} className="w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors [color:#fff]">
              Done
            </button>
          </div>
        ) : (
          <>
            <h2 id="challenge-signup-title" className="text-2xl font-extrabold text-slate-900 tracking-tight pr-8">
              {waitlistView ? "Join the waitlist" : "Join the free challenge"}
            </h2>
            <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
              {phase === "closed"
                ? "Enrollment for this challenge has closed. Join the waitlist and we'll let you know if a spot opens or when we run it again."
                : phase === "started"
                  ? "The challenge has started, and you can still join until 11:59 PM CST tonight. All of it is free, and no card is required. Join if you're ready to show up for the week."
                  : "Starts Tuesday, November 17. All of it is free, and no card is required. Sign up now to receive the pre-challenge homework. Join if you're ready to show up for the week."}
            </p>
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {status === "error" && (
                <div role="alert" className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">{errorMessage}</div>
              )}
              <div>
                <label htmlFor="challenge-name" className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input id="challenge-name" ref={nameRef} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="challenge-email" className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input id="challenge-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={INPUT_CLASS} />
              </div>
              <div>
                <label htmlFor="challenge-phone" className="block text-sm font-medium text-slate-700 mb-1.5">Mobile number</label>
                <input id="challenge-phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} autoComplete="tel" placeholder="555-123-4567" className={INPUT_CLASS} />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors disabled:opacity-60 [color:#fff]"
              >
                {status === "loading" ? "Joining…" : phase === "closed" ? "Join the Waitlist" : "Join the Challenge"}
              </button>
              <SmsConsentNotice buttonLabel={phase === "closed" ? "Join the Waitlist" : "Join the Challenge"} className="pt-1" />
            </form>
          </>
        )}
      </div>
    </div>
  );
}
