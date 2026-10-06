"use client";

import { SAMPLE_REPORT, SAMPLE_TITLE } from "@/lib/sampleReport";

// Three stacked, slightly fanned report pages with the real report's category list on
// the top page, so it reads as a document you can open rather than a generic button.
// Same mockup (and hover lift) as the app's welcome screen.
export function SampleReportTeaser({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`See a real sermon, fully evaluated: open the sample report for “${SAMPLE_TITLE}”`}
      className="group w-full text-left rounded-2xl bg-white border border-slate-200 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3760ad] focus-visible:ring-offset-2"
    >
      <div className="relative mx-auto w-full max-w-[15rem] h-[18rem] transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-focus-visible:-translate-y-1.5">
        <div aria-hidden className="absolute inset-x-2 top-3 bottom-0 rounded-xl bg-white border border-slate-200 shadow-sm rotate-[-7deg] origin-bottom transition-transform duration-300 group-hover:rotate-[-9deg]" />
        <div aria-hidden className="absolute inset-x-2 top-2 bottom-0 rounded-xl bg-white border border-slate-200 shadow-sm rotate-[5deg] origin-bottom transition-transform duration-300 group-hover:rotate-[7deg]" />

        <div aria-hidden className="absolute inset-x-1 top-0 bottom-0 rounded-xl bg-white border border-slate-200 shadow-lg group-hover:shadow-xl transition-shadow duration-300 px-4 py-4 overflow-hidden">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-[#3760ad]">Sermon Feedback Report</p>
          <p className="text-[15px] font-semibold text-slate-900 leading-snug mt-0.5 mb-3">{SAMPLE_TITLE}</p>
          <div className="space-y-1.5">
            {SAMPLE_REPORT.categories.map((cat) => {
              const strong = !cat.growth_area;
              return (
                <div key={cat.key} className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/70 px-2 py-1.5">
                  <span className="text-[11px] font-medium text-slate-800 truncate">{cat.label}</span>
                  <span className={`shrink-0 text-[9px] font-semibold rounded-full px-1.5 py-px border ${strong ? "text-green-700 bg-green-50 border-green-200" : "text-amber-700 bg-amber-50 border-amber-200"}`}>
                    {strong ? "Strong" : "How to grow"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="text-sm font-semibold text-slate-900 group-hover:text-[#3760ad] transition-colors">See a real sermon, fully evaluated</p>
        <p className="text-xs text-slate-500 mt-0.5">Seven categories of honest, specific feedback.</p>
      </div>
    </button>
  );
}
