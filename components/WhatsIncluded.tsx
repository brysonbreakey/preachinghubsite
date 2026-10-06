"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

// Same list as the app's account/plan "What's included" dropdown.
const PRO_FEATURES: { label: string; sublabel?: string }[] = [
  { label: "Sermon Builder" },
  { label: "Preaching Calendar" },
  { label: "Unlimited Coaching Reports" },
  { label: "Expert evaluations across 7 categories" },
  { label: "Full Timestamped Transcript" },
  { label: "Visual Delivery Evaluation", sublabel: "Body language & facial expressions" },
  { label: "Tone & Volume Analysis" },
  { label: "Filler Word Analysis" },
  { label: "Pulpit Mode for live preaching" },
  { label: "Free Research Tools Library" },
];

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
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 pt-4">
            {PRO_FEATURES.map((f) => (
              <li key={f.label} className="flex items-start gap-2">
                <Icon d="M20 6 9 17l-5-5" size={13} color="#16a34a" strokeWidth={2.5} className="shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-slate-600">
                  <span>{f.label}</span>
                  {f.sublabel && <span className="block text-[10px] text-slate-400 mt-0.5">{f.sublabel}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
