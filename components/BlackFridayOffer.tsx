"use client";

import { useEffect, useState } from "react";
import { buildSignupUrl } from "@/lib/urls";
import { BF_ANNUAL_CODE, BF_ENDS_LABEL, BF_MONTHLY_CODE, isBlackFridayNow } from "@/lib/blackFriday";
import { Accent, H, INDIGO } from "@/components/FeatureBits";

// Inline Black Friday offer for the pricing page (the popup is hidden here). Renders nothing
// outside the promo window.
export function BlackFridayOffer() {
  const [bf, setBf] = useState(false);
  useEffect(() => setBf(isBlackFridayNow()), []);
  if (!bf) return null;

  const options = [
    { big: "$29/mo", sub: "for 6 months, then $49/mo", plan: "Monthly plan", code: BF_MONTHLY_CODE },
    { big: "50% off", sub: "your first year of the annual plan", plan: "Annual plan", code: BF_ANNUAL_CODE },
  ];

  return (
    <section className="pb-12 px-6 bg-white">
      <div className="max-w-lg mx-auto rounded-3xl p-7 sm:p-8 text-center" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}>
        <p className="inline-block rounded-full bg-white/15 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white mb-4">Black Friday</p>
        <h2 className={`${H} text-3xl sm:text-4xl leading-[1.08] text-white mb-2`}>
          Try it free, then <span className="font-[family-name:var(--font-lora)] italic font-semibold tracking-[-0.01em]">save.</span>
        </h2>
        <p className="text-white/85 mb-6">Start your 14-day free trial, then enter a code at checkout.</p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6 text-left">
          {options.map((o) => (
            <div key={o.code} className="rounded-2xl bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">{o.plan}</p>
              <p className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-2xl text-slate-900 leading-tight mt-1">{o.big}</p>
              <p className="text-sm text-slate-500 mb-3">{o.sub}</p>
              <span className="inline-block rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-3 py-1.5 font-mono text-sm font-bold tracking-wider" style={{ color: INDIGO }}>
                Code {o.code}
              </span>
            </div>
          ))}
        </div>
        <a href={buildSignupUrl("black_friday_pricing")} className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-bold" style={{ color: INDIGO }}>
          Start My Free 14 Days &rarr;
        </a>
        <p className="mt-3 text-xs text-white/80">Credit card required · $0 today · Offer ends {BF_ENDS_LABEL}</p>
      </div>
    </section>
  );
}
