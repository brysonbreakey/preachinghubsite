import { Icon } from "@/components/Icon";
import type { PlanFeature } from "@/lib/planFeatures";

export function FeatureList({
  features,
  columns = 1,
  compact = false,
  className = "",
}: {
  features: PlanFeature[];
  columns?: 1 | 2;
  compact?: boolean;
  className?: string;
}) {
  const text = compact ? "text-xs" : "text-sm";
  return (
    <ul className={`${columns === 2 ? "grid sm:grid-cols-2 gap-x-8 gap-y-4" : "space-y-4"} ${className}`}>
      {features.map((f) => (
        <li key={f.name} className="flex items-start gap-3 text-left">
          <span className="mt-1 shrink-0">
            <Icon d="M20 6 9 17l-5-5" size={compact ? 13 : 15} color="#16a34a" strokeWidth={2.5} />
          </span>
          <div>
            <p className={`${text} font-semibold text-slate-900`}>{f.name}</p>
            {f.description && <p className={`${text} text-slate-500 leading-relaxed`}>{f.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}
