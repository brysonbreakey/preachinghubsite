"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { buildSignupUrl } from "@/lib/urls";
import { BF_ANNUAL_CODE, BF_ENDS_LABEL, BF_MONTHLY_CODE, isBlackFridayNow } from "@/lib/blackFriday";
import { Accent, H, INDIGO, Eyebrow } from "@/components/FeatureBits";
import { GuaranteeBadge } from "@/components/GuaranteeBadge";
import { GUARANTEE_LONG } from "@/lib/guarantee";

// /blackfriday: one simple page for the deal. Date-gated on the client (the page is static), and
// after the window it points visitors to the free evaluation instead.
const OFFERS = [
  { plan: "Monthly plan", big: "$29/mo", sub: "for your first 6 months, then $49/mo", code: BF_MONTHLY_CODE },
  { plan: "Annual plan", big: "50% off", sub: "your first year of the annual plan", code: BF_ANNUAL_CODE },
];

const STEPS = [
  { n: "1", title: "Start your free trial", body: "14 days of full access. Card required, $0 today." },
  { n: "2", title: "Upload a sermon", body: "Get a coaching report on structure, clarity, application, and more." },
  { n: "3", title: "Enter your code", body: "Your discount applies when the trial ends. Cancel anytime before." },
];

const GET = [
  "Instant Coaching Reports on every sermon",
  "A Voice Memo from Your AI Coach",
  "Sermon Builder, from passage to pulpit",
  "Delivery analysis: pacing, pauses, and filler words",
  "Your Preaching DNA, tracked over time",
];

export function BlackFridayLanding() {
  const [state, setState] = useState<"loading" | "live" | "over">("loading");
  const [copied, setCopied] = useState("");
  useEffect(() => setState(isBlackFridayNow() ? "live" : "over"), []);

  const copy = (code: string) => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(""), 1800);
    }).catch(() => {});
  };

  if (state === "over") {
    return (
      <section className="pt-36 pb-24 px-6 bg-slate-50 text-center">
        <div className="max-w-xl mx-auto">
          <Eyebrow>Black Friday</Eyebrow>
          <h1 className={`${H} text-4xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>This offer has <Accent>ended.</Accent></h1>
          <p className="text-slate-600 mb-8">You can still try PreachingHub free for 14 days, or get a free sermon evaluation first.</p>
          <a href={buildSignupUrl("black_friday_page_ended")} className="inline-flex rounded-full px-8 py-4 font-semibold text-white" style={{ backgroundColor: INDIGO }}>Try it Free for 14 Days</a>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="pt-32 pb-16 sm:pb-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Black Friday · Ends {BF_ENDS_LABEL}</Eyebrow>
          <h1 className={`${H} text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-slate-900 mb-5`}>
            Try it free, then <Accent>save.</Accent>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto mb-10">
            Get honest, specific coaching on every sermon you preach. Start your 14-day free trial, then lock in a Black Friday price.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 text-left mb-8">
            {OFFERS.map((o) => (
              <div key={o.code} className="group relative rounded-3xl bg-white border border-slate-200 p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{o.plan}</p>
                <p className={`${H} text-4xl text-slate-900 mt-1`}>{o.big}</p>
                <p className="text-sm text-slate-500 mb-4">{o.sub}</p>
                <button
                  type="button"
                  onClick={() => copy(o.code)}
                  className="relative z-10 rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wider"
                  style={{ color: INDIGO }}
                  aria-label={`Copy code ${o.code}`}
                >
                  {copied === o.code ? "Copied ✓" : `Code ${o.code}`}
                </button>
                <a
                  href={buildSignupUrl("black_friday_page")}
                  className="mt-5 flex items-center justify-between text-sm font-bold after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                  style={{ color: INDIGO }}
                >
                  Start free 14-day trial <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            ))}
          </div>

          <a href={buildSignupUrl("black_friday_page")} className="cta-btn inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white" style={{ backgroundColor: INDIGO }}>
            Start My Free 14 Days &rarr;
          </a>
          <p className="mt-3 text-xs text-slate-500">Credit card required · $0 today · Enter your code at checkout</p>
          <GuaranteeBadge className="mt-2" />
        </div>
      </section>

      <section className="py-16 sm:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-4xl text-slate-900 text-center mb-10`}>How it <Accent>works.</Accent></h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl bg-slate-50 p-6">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold mb-3" style={{ backgroundColor: INDIGO }}>{s.n}</div>
                <p className="font-bold text-slate-900 mb-1">{s.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto rounded-3xl bg-slate-50 p-8">
          <h2 className={`${H} text-2xl sm:text-3xl text-slate-900 mb-1`}>PreachingHub All-Access</h2>
          <p className="text-slate-600 mb-5">Everything is included. No tiers, no add-ons.</p>
          <ul className="space-y-2.5 mb-6">
            {GET.map((g) => (
              <li key={g} className="flex gap-2.5 text-slate-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                {g}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-600 border-t border-slate-200 pt-4">{GUARANTEE_LONG}</p>
          <p className="text-xs text-slate-500 mt-3">
            Not ready to start a trial? <Link href="/try" className="underline">Get a free sermon evaluation</Link> instead.
          </p>
        </div>
      </section>
    </>
  );
}
