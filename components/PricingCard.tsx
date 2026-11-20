"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { SIGNUP_URL } from "@/lib/urls";
import { PLAN_FEATURES } from "@/lib/planFeatures";
import { FeatureList } from "@/components/FeatureList";
import { BillingToggle } from "@/components/BillingToggle";
import { PLAN_PRICING, type Billing } from "@/lib/pricing";
import { TrialDisclosure, TRIAL_CTA_LABEL } from "@/components/TrialDisclosure";
import { GuaranteeBadge } from "@/components/GuaranteeBadge";

const NAVY = "#4F46E5";

// The six things worth reading about; everything else is a quick name-only list.
const HEADLINE = ["Sermon Builder", "Coaching Reports", "Voice Memo from Your AI Coach", "Delivery Analysis", "Visual Delivery", "Preaching DNA"];
const MAIN = HEADLINE.map((n) => PLAN_FEATURES.find((f) => f.name === n)).filter((f): f is NonNullable<typeof f> => !!f);
const MORE = PLAN_FEATURES.filter((f) => !HEADLINE.includes(f.name));

export function PricingCard() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const plan = PLAN_PRICING[billing];

  const cta = (
    <>
      <a
        href={SIGNUP_URL}
        className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-3.5 rounded-full text-sm transition-colors"
        style={{ backgroundColor: NAVY }}
      >
        {TRIAL_CTA_LABEL}
      </a>
      <TrialDisclosure className="text-xs text-slate-500 text-center mt-3" />
      <div className="text-center mt-2"><GuaranteeBadge /></div>
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
          <h3 className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">PreachingHub All-Access</h3>
          <div className="flex items-end gap-1 mb-1">
            <span className="text-4xl font-extrabold text-slate-900">${plan.perMonth}</span>
            <span className="text-slate-500 mb-1">/mo</span>
          </div>
          <div className="mb-6">
            <p className="text-sm text-slate-500">{plan.fineprint}</p>
          </div>
          <div className="pb-6 mb-6 border-b border-slate-100">{cta}</div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">What&apos;s included &mdash; everything, one plan</p>
          <FeatureList features={MAIN} className="mb-5" />
          <details className="group border-t border-slate-100 pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
              <span>Plus more</span>
              <Icon d="M6 9l6 6 6-6" size={16} strokeWidth={2.2} className="transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {MORE.map((f) => (
                <li key={f.name} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <Icon d="M20 6 9 17l-5-5" size={14} color="#16a34a" strokeWidth={2.5} />
                  {f.name}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
