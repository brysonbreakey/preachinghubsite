import { Icon } from "@/components/Icon";

// The three things worth knowing before signing up, phrased as promises. The full list
// lives in the "See all features" dropdown below it — this is what makes the page say
// what PreachingHub does without pushing the form out of sight. On a phone only the
// coaching report keeps its explanation; the other two are just their promise line.
const HIGHLIGHTS: { tag: string; promise: string; body: string; icon: string | string[]; showBodyOnPhone?: boolean }[] = [
  {
    tag: "Coaching Report",
    promise: "Know exactly how to improve your next sermon",
    body: "Submit any sermon and get a written report in minutes: what's working, how to grow, and your top priority, across 7 areas.",
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
    showBodyOnPhone: true, // the one that most needs explaining
  },
  {
    tag: "Sermon Builder",
    promise: "Walk into the pulpit prepared",
    body: "A full editor and guided prep steps, from your first idea to notes you're ready to preach from.",
    icon: ["M12 20h9", "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"],
  },
  {
    tag: "Delivery Analysis",
    promise: "Hear how you actually come across",
    body: "Pace, tone, volume, and filler words from your audio, plus body language from video.",
    icon: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  },
];

export function FeatureHighlights() {
  return (
    <div className="grid sm:grid-cols-3 gap-3 mb-3 text-left">
      {HIGHLIGHTS.map((h) => (
        <div key={h.tag} className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <span className="w-7 h-7 rounded-lg bg-[#3760ad]/10 flex items-center justify-center shrink-0">
              <Icon d={h.icon} size={14} color="#3760ad" strokeWidth={2} />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3760ad]">{h.tag}</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 leading-snug">{h.promise}</p>
          <p className={`text-xs text-slate-500 leading-relaxed mt-1.5 ${h.showBodyOnPhone ? "" : "hidden sm:block"}`}>{h.body}</p>
        </div>
      ))}
    </div>
  );
}
