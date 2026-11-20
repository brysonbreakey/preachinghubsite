import { SIGNUP_URL } from "@/lib/urls";
import { TrialDisclosure, TRIAL_CTA_LABEL } from "@/components/TrialDisclosure";
import { GuaranteeBadge } from "@/components/GuaranteeBadge";

// Shared building blocks for the /features/* pages.
export const SERIF = "font-[family-name:var(--font-lora)]";
export const H = "font-[family-name:var(--font-inter)] font-black tracking-[-0.05em]";
export const INDIGO = "#4F46E5";

export function Cta({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <a
        href={SIGNUP_URL}
        className="cta-btn inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-semibold text-white"
        style={{ backgroundColor: INDIGO }}
      >
        {TRIAL_CTA_LABEL}
      </a>
      <TrialDisclosure className="mt-3 text-xs text-slate-500" />
      <GuaranteeBadge className="mt-2" />
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: INDIGO }}>
      {children}
    </p>
  );
}

// The one serif-italic indigo word that closes a headline.
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${SERIF} italic font-semibold tracking-[-0.01em] text-[1.06em]`} style={{ color: INDIGO }}>
      {children}
    </span>
  );
}

export function IconTile({ d, bg, color }: { d: string; bg: string; color: string }) {
  return (
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bg}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
      </svg>
    </div>
  );
}
