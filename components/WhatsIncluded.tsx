"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { FeatureList } from "@/components/FeatureList";
import { PLAN_FEATURES } from "@/lib/planFeatures";

export function WhatsIncluded({ label, defaultOpen = false }: { label: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-slate-800 tracking-wide uppercase hover:bg-slate-50 transition-colors"
      >
        {label}
        <Icon
          d="m6 9 6 6 6-6"
          size={16}
          color="#94a3b8"
          strokeWidth={2}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-200">
          <FeatureList features={PLAN_FEATURES} columns={2} compact className="pt-4" />
        </div>
      )}
    </div>
  );
}
