import { Icon } from "@/components/Icon";

// The three things worth knowing before signing up, phrased as promises. The full list
// lives in the "See all features" dropdown below — this just says what PreachingHub does
// without pushing the form out of sight. Unboxed on purpose — the dropdown and the form
// below are the boxes. On a phone it's three columns of icon + promise, no explanations.
const HIGHLIGHTS: { promise: string; body: string; icon: string | string[]; }[] = [
  {
    promise: "Get unlimited coaching feedback instantly.",
    body: "A written report on any sermon, available in minutes.",
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
  },
  {
    promise: "Walk into the pulpit prepared.",
    body: "A full editor and prep steps, from idea to pulpit.",
    icon: ["M12 20h9", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"],
  },
  {
    promise: "Keep every sermon organized.",
    body: "One place to track prep for every sermon you're working on.",
    icon: ["M8 2v4", "M16 2v4", "M3 10h18", "M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"],
  },
];

export function FeatureHighlights() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-8 mt-2 mb-8 text-center">
      {HIGHLIGHTS.map((h) => (
        <div key={h.promise} className="flex flex-col items-center">
          <span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#3760ad]/10 flex items-center justify-center">
            <Icon d={h.icon} size={26} color="#3760ad" strokeWidth={1.75} className="sm:w-8 sm:h-8" />
          </span>
          <p className="mt-3 text-xs sm:text-[15px] font-semibold text-slate-900 leading-snug">{h.promise}</p>
          <p className="hidden sm:block mt-1.5 text-xs text-slate-500 leading-relaxed">{h.body}</p>
        </div>
      ))}
    </div>
  );
}
