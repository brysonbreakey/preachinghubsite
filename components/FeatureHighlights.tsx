import { Icon } from "@/components/Icon";

// The three things worth knowing before signing up, phrased as promises. The full list
// lives in the "See all features" dropdown below — this just says what PreachingHub does
// without pushing the form out of sight. On a phone only the coaching report keeps its
// one-line explanation; the other two are just their promise.
const HIGHLIGHTS: { promise: string; body: string; icon: string | string[]; showBodyOnPhone?: boolean }[] = [
  {
    promise: "Get unlimited coaching feedback instantly.",
    body: "A written report on any sermon: what's working and how to grow.",
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
    showBodyOnPhone: true, // the one that most needs explaining
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
    <div className="grid sm:grid-cols-3 gap-2 mb-3 text-left">
      {HIGHLIGHTS.map((h) => (
        <div key={h.promise} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-md bg-[#3760ad]/10 flex items-center justify-center shrink-0">
              <Icon d={h.icon} size={13} color="#3760ad" strokeWidth={2} />
            </span>
            <p className="text-[13px] font-semibold text-slate-900 leading-snug pt-0.5">{h.promise}</p>
          </div>
          <p className={`text-xs text-slate-500 leading-snug mt-1.5 sm:pl-8 ${h.showBodyOnPhone ? "pl-8" : "hidden sm:block"}`}>{h.body}</p>
        </div>
      ))}
    </div>
  );
}
