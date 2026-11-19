"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

// Site-wide invitation to the free sermon evaluation (/try), for visitors who aren't ready to
// start the 14-day trial. It never opens on arrival: on desktop it waits for ~50% scroll or exit
// intent (whichever comes first), on mobile for ~60% scroll. Shown at most once every 7 days, and
// not again for 30 days after a click-through. Pages where someone is already deciding, paying,
// or in a funnel of their own are excluded.

const SCROLL_DESKTOP = 0.5;
const SCROLL_MOBILE = 0.6;
const DAY_MS = 24 * 60 * 60 * 1000;
const SHOWN_COOLDOWN_MS = 7 * DAY_MS;
const CLICKED_COOLDOWN_MS = 30 * DAY_MS;
// Each key holds a "don't show again until" timestamp. v1 of this offer; the old challenge pop-up
// used ph_challenge_popup_until_v2 and is intentionally not read.
const SHOWN_KEY = "ph_eval_popup_until_v1";
const CLICKED_KEY = "ph_eval_popup_clicked_until_v1";
const HIDDEN_PREFIXES = [
  "/try",
  "/challenge",
  "/checklist",
  "/accelerator",
  "/pricing",
  "/1-dollar-month",
  "/returning-1-dollar-month",
  "/o",
  "/c",
  "/privacy",
  "/terms",
  "/sms",
];
const TRY_HREF = "/try?utm_source=site_popup&utm_medium=popup&utm_campaign=free_evaluation";

function suppressed(): boolean {
  try {
    const now = Date.now();
    return Number(localStorage.getItem(SHOWN_KEY)) > now || Number(localStorage.getItem(CLICKED_KEY)) > now;
  } catch {
    return false;
  }
}

function remember(key: string, ms: number) {
  try {
    localStorage.setItem(key, String(Date.now() + ms));
  } catch {
    // storage blocked: it just may show again on the next visit
  }
}

export default function EvaluationPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const shownRef = useRef(false);
  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // Triggers: scroll depth, plus exit intent on devices with a real pointer.
  useEffect(() => {
    if (hidden || shownRef.current || suppressed()) return;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const threshold = desktop ? SCROLL_DESKTOP : SCROLL_MOBILE;
    let raf = 0;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      cleanup();
      remember(SHOWN_KEY, SHOWN_COOLDOWN_MS);
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setMobile(!desktop);
      setOpen(true);
      posthog.capture("evaluation_popup_viewed", { path: pathname, device: desktop ? "desktop" : "mobile" });
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollable > 0 && window.scrollY / scrollable >= threshold) show();
      });
    };
    const onMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget === null && e.clientY <= 0) show();
    };
    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onMouseOut);
      if (raf) cancelAnimationFrame(raf);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    if (desktop) document.addEventListener("mouseout", onMouseOut);
    return cleanup;
  }, [hidden, pathname]);

  const close = useCallback(
    (reason: "dismissed" | "clicked") => {
      setVisible(false);
      setOpen(false);
      if (reason === "dismissed") posthog.capture("evaluation_popup_dismissed", { path: pathname });
      returnFocusRef.current?.focus?.();
    },
    [pathname],
  );

  // While open: fade in, lock background scroll (without shifting the layout), keep focus inside,
  // and close on Escape.
  useEffect(() => {
    if (!open || hidden) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close("dismissed");
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open, hidden, close]);

  if (!open || hidden) return null;

  const motion = "transition duration-200 ease-out motion-reduce:transition-none";

  return (
    <div
      className={`fixed inset-0 z-[100] flex bg-slate-900/50 px-4 ${mobile ? "items-end pb-4" : "items-center justify-center py-6"} ${motion} ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={() => close("dismissed")}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="eval-popup-title"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md rounded-3xl bg-white text-center shadow-2xl ${mobile ? "mx-auto px-5 pb-6 pt-8" : "px-8 pb-8 pt-10"} ${motion} ${visible ? "translate-y-0" : "translate-y-3"}`}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => close("dismissed")}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4F46E5]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M9 17v-2M12 17v-4M15 17v-6" />
          </svg>
        </div>

        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]">Free preaching feedback</p>
        <h2
          id="eval-popup-title"
          className="mb-3 font-[family-name:var(--font-inter)] text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-[2rem]"
        >
          Want to know how your preaching could{" "}
          <span className="font-[family-name:var(--font-lora)] font-semibold italic tracking-normal text-[#4F46E5]">improve?</span>
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Upload a sermon and get a personalized evaluation of your strengths and growth opportunities. Completely free.
        </p>
        <Link
          href={TRY_HREF}
          onClick={() => {
            remember(CLICKED_KEY, CLICKED_COOLDOWN_MS);
            posthog.capture("evaluation_popup_clicked", { path: pathname });
            close("clicked");
          }}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#4F46E5] px-8 py-4 text-base font-bold [color:#fff] transition-colors hover:bg-[#4338CA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
        >
          Evaluate My Sermon Free &rarr;
        </Link>
        <p className="mt-3 text-sm text-slate-500">No credit card required.</p>
      </div>
    </div>
  );
}
