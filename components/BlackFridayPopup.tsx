"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { buildSignupUrl } from "@/lib/urls";
import { BF_ANNUAL_CODE, BF_ENDS_LABEL, BF_END, BF_MONTHLY_CODE } from "@/lib/blackFriday";
import { GuaranteeBadge } from "@/components/GuaranteeBadge";

// Black Friday offer popup. Same behavior as the free-evaluation popup it replaces for the week:
// never opens on arrival (scroll depth, or exit intent on desktop), shown at most once a day, and
// not again once someone clicks through. Pages where someone is already deciding or paying are
// excluded; /pricing carries the offer inline.

const SCROLL_DESKTOP = 0.5;
const SCROLL_MOBILE = 0.6;
const DAY_MS = 24 * 60 * 60 * 1000;
const SHOWN_COOLDOWN_MS = DAY_MS;
const SHOWN_KEY = "ph_bf26_popup_until_v1";
const CLICKED_KEY = "ph_bf26_popup_clicked_until_v1";
const HIDDEN_PREFIXES = [
  "/pricing",
  "/try",
  "/challenge",
  "/checklist",
  "/accelerator",
  "/1-dollar-month",
  "/returning-1-dollar-month",
  "/o",
  "/c",
  "/privacy",
  "/terms",
  "/sms",
];
const SIGNUP_HREF = buildSignupUrl("black_friday_popup");

function suppressed(): boolean {
  try {
    const now = Date.now();
    return Number(localStorage.getItem(SHOWN_KEY)) > now || Number(localStorage.getItem(CLICKED_KEY)) > now;
  } catch {
    return false;
  }
}

function remember(key: string, until: number) {
  try {
    localStorage.setItem(key, String(until));
  } catch {
    // storage blocked: it just may show again on the next visit
  }
}

function CodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(code).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }).catch(() => {});
      }}
      className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-[#4F46E5] hover:bg-indigo-100"
      aria-label={`Copy code ${code}`}
    >
      {copied ? "Copied" : code}
    </button>
  );
}

export default function BlackFridayPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const shownRef = useRef(false);
  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  useEffect(() => {
    if (hidden || shownRef.current || suppressed()) return;
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const threshold = desktop ? SCROLL_DESKTOP : SCROLL_MOBILE;
    let raf = 0;

    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      cleanup();
      remember(SHOWN_KEY, Date.now() + SHOWN_COOLDOWN_MS);
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setMobile(!desktop);
      setOpen(true);
      posthog.capture("bf_popup_viewed", { path: pathname, device: desktop ? "desktop" : "mobile" });
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
      if (reason === "dismissed") posthog.capture("bf_popup_dismissed", { path: pathname });
      returnFocusRef.current?.focus?.();
    },
    [pathname],
  );

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
        aria-labelledby="bf-popup-title"
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white text-center shadow-2xl ${mobile ? "mx-auto px-5 pb-6 pt-8" : "px-8 pb-8 pt-10"} ${motion} ${visible ? "translate-y-0" : "translate-y-3"}`}
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

        <p className="mb-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]">Black Friday</p>
        <h2
          id="bf-popup-title"
          className="mb-2 font-[family-name:var(--font-inter)] text-[1.75rem] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-900 sm:text-[2rem]"
        >
          Try it free, then{" "}
          <span className="font-[family-name:var(--font-lora)] font-semibold italic tracking-normal text-[#4F46E5]">save.</span>
        </h2>
        <p className="mb-5 text-base leading-relaxed text-slate-600">Start your 14-day free trial and use a code at checkout.</p>

        <div className="mb-5 space-y-3 text-left">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-lg font-extrabold tracking-[-0.02em] text-slate-900">$29/mo for 6 months</p>
              <p className="text-sm text-slate-500">Monthly plan, then $49/mo</p>
            </div>
            <CodeChip code={BF_MONTHLY_CODE} />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
            <div>
              <p className="font-[family-name:var(--font-inter)] text-lg font-extrabold tracking-[-0.02em] text-slate-900">50% off annual</p>
              <p className="text-sm text-slate-500">On the annual plan</p>
            </div>
            <CodeChip code={BF_ANNUAL_CODE} />
          </div>
        </div>

        <a
          href={SIGNUP_HREF}
          onClick={() => {
            remember(CLICKED_KEY, BF_END.getTime());
            posthog.capture("bf_popup_clicked", { path: pathname });
            close("clicked");
          }}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#4F46E5] px-8 py-4 text-base font-bold [color:#fff] transition-colors hover:bg-[#4338CA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5]"
        >
          Start My Free 14 Days &rarr;
        </a>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Credit card required · $0 today. Enter your code at checkout. Offer ends {BF_ENDS_LABEL}.
        </p>
        <GuaranteeBadge className="mt-2" />
      </div>
    </div>
  );
}
