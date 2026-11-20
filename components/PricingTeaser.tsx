"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SIGNUP_URL } from "@/lib/urls";
import { FeatureList } from "@/components/FeatureList";
import { PLAN_FEATURES } from "@/lib/planFeatures";
import { BillingToggle } from "@/components/BillingToggle";
import { PLAN_PRICING, type Billing } from "@/lib/pricing";
import { TrialDisclosure, TRIAL_CTA_LABEL } from "@/components/TrialDisclosure";
import { GuaranteeBadge } from "@/components/GuaranteeBadge";

const NAVY = "#4F46E5";

const HIGHLIGHT_NAMES = ["Sermon Builder", "Coaching Reports", "Voice Memo from Your AI Coach", "Delivery Analysis", "Visual Delivery"];
const HIGHLIGHTS = PLAN_FEATURES.filter((f) => HIGHLIGHT_NAMES.includes(f.name));

export function PricingTeaser() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const plan = PLAN_PRICING[billing];
  return (
    <section className="py-16 sm:py-24 px-6 bg-slate-50">
      <div className="max-w-lg mx-auto text-center" data-animate="fade-up">
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>Pricing</p>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight text-balance">
          One plan. ${plan.perMonth}/mo.
        </h2>
        <p className="text-lg text-slate-500 mb-6 max-w-md mx-auto">
          No tiers, no locked features. PreachingHub All-Access is ${plan.perMonth}/mo, cancel anytime.
        </p>
        <div className="flex items-center justify-center mb-10">
          <BillingToggle billing={billing} onChange={setBilling} />
        </div>
        <FeatureList features={HIGHLIGHTS} columns={2} className="mb-10 max-w-md mx-auto" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={SIGNUP_URL} className="cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-4 rounded-full text-base shadow-lg" style={{ backgroundColor: NAVY }}>
            {TRIAL_CTA_LABEL}
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
          </a>
          <a href="/pricing" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-400 font-semibold px-7 py-4 rounded-full text-base transition-colors">
            See full plan details
          </a>
        </div>
        <TrialDisclosure className="text-xs text-slate-500 mt-5" />
        <GuaranteeBadge className="mt-2" />
      </div>
    </section>
  );
}
