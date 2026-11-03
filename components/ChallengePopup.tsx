"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { challengePhase } from "@/lib/challenge";

// Site-wide pop-up for the Free 7-Day Preaching Growth Challenge. Appears a few seconds after a
// visitor lands, once: dismissing it (or clicking through) keeps it away for 14 days. It never
// shows on the challenge, checklist, accelerator or sign-up-flow pages, or once enrollment closes
// (the waitlist state is meant to be handled by the page itself). Retire it with the challenge.

const DELAY_MS = 8000;
const SNOOZE_MS = 14 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "ph_challenge_popup_until";
const HIDDEN_PREFIXES = ["/challenge", "/checklist", "/accelerator", "/try", "/privacy", "/terms", "/sms"];

function snoozed(): boolean {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) > Date.now();
  } catch {
    return false;
  }
}

function snooze() {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // storage blocked: it just may show again on the next visit
  }
}

export default function ChallengePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (hidden) return;
    const id = setTimeout(() => {
      if (snoozed() || challengePhase(Date.now()) === "closed") return;
      setOpen(true);
      posthog.capture("challenge_popup_shown", { path: pathname });
    }, DELAY_MS);
    return () => clearTimeout(id);
  }, [hidden, pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    snooze();
    setOpen(false);
    posthog.capture("challenge_popup_dismissed", { path: pathname });
  }

  if (!open || hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 py-6"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Free 7-Day Preaching Growth Challenge"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-white px-6 pb-7 pt-10 text-center shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <Image
          src="/images/challenge-title.webp"
          alt="Free 7-Day Preaching Growth Challenge"
          width={2000}
          height={770}
          className="mx-auto mb-5 h-auto w-full max-w-[22rem] mix-blend-multiply"
        />
        <p className="mb-6 text-base font-medium leading-relaxed text-slate-600">
          A free week to take your preaching to the next level. Starts Tuesday, November 10. About 15 minutes a day, with free access to PreachingHub and a free 1:1 call with Bryson when you finish.
        </p>
        <Link
          href="/challenge?utm_source=site_popup"
          onClick={() => {
            snooze();
            posthog.capture("challenge_popup_clicked", { path: pathname });
          }}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#4F46E5] px-8 py-4 text-sm font-black uppercase tracking-widest [color:#fff] hover:bg-[#4338CA] transition-colors"
        >
          See the free challenge
        </Link>
        <button type="button" onClick={dismiss} className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-600">
          No thanks
        </button>
      </div>
    </div>
  );
}
