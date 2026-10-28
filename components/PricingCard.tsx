"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SIGNUP_URL } from "@/lib/urls";
import { PLAN_FEATURES } from "@/lib/planFeatures";
import { FeatureList } from "@/components/FeatureList";
import { BillingToggle } from "@/components/BillingToggle";
import { PLAN_PRICING, type Billing } from "@/lib/pricing";

const NAVY = "#3760ad";

export function PricingCard() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const plan = PLAN_PRICING[billing];

  const cta = (
    <>
      <a
        href={SIGNUP_URL}
        className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors"
        style={{ backgroundColor: NAVY }}
      >
        Start Your Free Trial
      </a>
      <p className="text-xs text-slate-400 text-center mt-3">7-day free trial. Start free, cancel anytime.</p>
    </>
  );

  return (
    <section className="pb-24 px-6 bg-white">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center mb-8" data-animate="fade-up">
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>

        <div
          className="relative rounded-2xl border-2 shadow-xl shadow-blue-100/50 p-8 flex flex-col"
          style={{ borderColor: NAVY }}
          data-animate="fade-up"
          data-delay="100"
        >
          <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">PreachingHub</h3>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-slate-900">${plan.perMonth}</span>
            <span className="text-slate-500 mb-1">/mo</span>
          </div>
          <div className="mb-6">
            <p className="text-sm text-slate-500">{plan.fineprint}</p>
          </div>
          <div className="pb-6 mb-6 border-b border-slate-100">{cta}</div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">What&apos;s included &mdash; everything, one plan</p>
          <FeatureList features={PLAN_FEATURES} className="mb-6" />
          {cta}
        </div>
      </div>
    </section>
  );
}
