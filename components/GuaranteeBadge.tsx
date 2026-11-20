import { GUARANTEE_SHORT } from "@/lib/guarantee";

// A small shield + line, for sprinkling under call-to-action buttons.
export function GuaranteeBadge({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <p className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold ${light ? "text-white/85" : "text-slate-600"} ${className}`}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={light ? "white" : "#4F46E5"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      {GUARANTEE_SHORT}
    </p>
  );
}
