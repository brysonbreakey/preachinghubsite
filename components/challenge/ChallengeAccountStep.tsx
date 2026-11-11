"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { APP_URL } from "@/lib/urls";

const INPUT_CLASS =
  "w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#4F46E5]";
const BUTTON_CLASS =
  "block w-full rounded-2xl bg-[#4F46E5] hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-4 transition-colors disabled:opacity-60 [color:#fff]";

// Shown on /challenge/joined right after the $7 payment: pick a password, get a PreachingHub account
// with the challenge pass on the spot, and go straight to the pre-challenge homework. The same
// account step the free cohort's popup had. The claim comes from the server after it has checked
// with Stripe that the payment went through; the app only uses it to CREATE an account for an email
// that has none. An email that already has an account signs in instead, and the pass is added then.
// "I'll do it later" falls back to the access link in the welcome email.
export function ChallengeAccountStep({ claim, firstName }: { claim: string; firstName: string }) {
  const [account, setAccount] = useState<"create" | "creating" | "existing" | "later">("create");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError("Choose a password with at least 6 characters.");
      return;
    }
    setError("");
    setAccount("creating");
    try {
      const res = await fetch(`${APP_URL}/api/challenge/account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, password }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 409) {
        posthog.capture("challenge_account_existing", { paid: true });
        setAccount("existing");
        return;
      }
      if (!res.ok || !data?.token_hash) throw new Error("account_failed");
      posthog.capture("challenge_account_created", { paid: true });
      const params = new URLSearchParams({ token_hash: data.token_hash, type: "magiclink", next: "/evaluate?from=challenge" });
      window.location.assign(`${APP_URL}/auth/callback?${params.toString()}`);
    } catch {
      setAccount("create");
      setError("We couldn't create your account just now. Try again, or tap “I'll do it later” and use the link we email you.");
    }
  }

  if (account === "later") {
    return (
      <p className="text-base font-medium leading-relaxed text-[#64748B]">
        No problem. In a few minutes you&apos;ll get an email with your PreachingHub access link, which opens your account and your homework. Check your spam folder if you don&apos;t see it.
      </p>
    );
  }

  if (account === "existing") {
    return (
      <div className="space-y-5 text-left">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">You already have an account</h2>
        <p className="text-center text-sm leading-relaxed text-slate-500">
          Sign in with your PreachingHub email and we&apos;ll add your challenge access and take you to your homework.
        </p>
        <a
          href={`${APP_URL}/auth/login?mode=login&next=${encodeURIComponent(`/evaluate?from=challenge&c=${claim}`)}`}
          onClick={() => posthog.capture("challenge_existing_signin_clicked", { paid: true })}
          className={BUTTON_CLASS + " text-center"}
        >
          Sign in to start
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-left">
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
        {firstName ? `You're in, ${firstName}! ` : "You're in! "}Let&apos;s start your homework.
      </h2>
      <p className="text-center text-sm leading-relaxed text-slate-500">
        Choose a password to open your PreachingHub account. Your pre-challenge homework takes less than 5 minutes: upload a sermon and get your first coaching report.
      </p>
      <form onSubmit={handleCreate} noValidate className="space-y-3">
        {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div>
          <label htmlFor="challenge-password" className="mb-1.5 block text-sm font-medium text-slate-700">Choose a password</label>
          <input id="challenge-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" autoFocus className={INPUT_CLASS} />
        </div>
        <button type="submit" disabled={account === "creating"} className={BUTTON_CLASS}>
          {account === "creating" ? "Creating…" : "Start my homework"}
        </button>
      </form>
      <div className="text-center">
        <button type="button" onClick={() => { posthog.capture("challenge_account_later", { paid: true }); setAccount("later"); }} className="text-sm font-medium text-slate-400 hover:text-slate-600">
          I&apos;ll do it later
        </button>
      </div>
    </div>
  );
}
