"use client";

import { useCallback, useEffect, useRef } from "react";
import posthog from "posthog-js";
import { Icon } from "@/components/Icon";
import { PacingChart } from "@/components/PacingChart";
import { SAMPLE_PACING, SAMPLE_REPORT, SAMPLE_TITLE } from "@/lib/sampleReport";

export type CloseMethod = "x" | "outside" | "esc" | "cta";

const DEPTHS = [25, 50, 75, 100] as const;
const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// The sample report, inline: an overlay on desktop, a full-screen sheet on mobile.
// Never a new tab or route; closes via X, click outside, Esc, or the bottom button.
export function SampleReportModal({ onClose }: { onClose: (method: CloseMethod) => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fired = useRef<Set<number>>(new Set());
  const closed = useRef(false);

  const close = useCallback((method: CloseMethod) => {
    if (closed.current) return;
    closed.current = true;
    onClose(method);
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); close("esc"); return; }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [close]);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return;
    const pct = (el.scrollTop / scrollable) * 100;
    for (const d of DEPTHS) {
      if (pct >= (d === 100 ? 98 : d) && !fired.current.has(d)) {
        fired.current.add(d);
        posthog.capture("try_sample_modal_scroll_depth", { depth: d, page: window.location.pathname });
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch sm:items-center justify-center sm:p-6 bg-slate-900/60 backdrop-blur-[2px]"
      onMouseDown={(e) => { if (e.target === e.currentTarget) close("outside"); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sample-report-title"
        aria-describedby="sample-report-intro"
        className="flex flex-col w-full sm:max-w-3xl h-full sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="shrink-0 flex items-start justify-between gap-4 px-5 sm:px-8 pt-5 pb-4 border-b border-slate-200 bg-white">
          <p id="sample-report-intro" className="text-sm text-slate-600 leading-relaxed pt-1">
            This is a real evaluation of a real sermon. Here&apos;s exactly what you&apos;ll get for yours.
          </p>
          <button
            type="button"
            data-autofocus
            onClick={() => close("x")}
            aria-label="Close sample report"
            className="shrink-0 w-9 h-9 -mr-2 -mt-1 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3760ad]"
          >
            <Icon d="M18 6 6 18M6 6l12 12" size={20} strokeWidth={2} />
          </button>
        </div>

        <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8 py-6 bg-white">
          <div className="pb-5 mb-6 border-b border-slate-200">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#3760ad] mb-1">Sermon Feedback Report</p>
            <h2 id="sample-report-title" className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">{SAMPLE_TITLE}</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3760ad] mb-2">Overall Summary</p>
              <p className="text-sm text-slate-700 leading-relaxed">{SAMPLE_REPORT.overall_summary}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Breakdown by Criteria</p>
              <div className="space-y-2">
                {SAMPLE_REPORT.categories.map((cat) => (
                  <div key={cat.key} className="rounded-xl border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3.5">
                      <span className="font-medium text-slate-900 text-sm">{cat.label}</span>
                      {!cat.growth_area && (
                        <span className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">Strong</span>
                      )}
                    </div>
                    <div className="px-5 pb-5 pt-1 space-y-4 border-t border-slate-100">
                      <div className="flex gap-3 pt-3">
                        <Icon d={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"]} size={16} color="#16a34a" strokeWidth={2} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-green-700 mb-1 uppercase tracking-wide">Strength</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{cat.strength}</p>
                        </div>
                      </div>
                      {cat.growth_area && (
                        <div className="flex gap-3">
                          <Icon d={["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"]} size={16} color="#d97706" strokeWidth={2} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">How to Grow</p>
                            <p className="text-sm text-slate-600 leading-relaxed">{cat.growth_area}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {SAMPLE_REPORT.biggest_wins && (
              <div className="rounded-xl border border-slate-200 border-l-4 border-l-green-500 p-5">
                <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-3">Biggest Wins</p>
                <ul className="space-y-2">
                  {SAMPLE_REPORT.biggest_wins.map((w) => (
                    <li key={w} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="text-green-600 font-bold shrink-0">✓</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {SAMPLE_REPORT.top_coaching_priority && (
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Top Coaching Priority</p>
                <p className="text-sm text-slate-600 leading-relaxed">{SAMPLE_REPORT.top_coaching_priority}</p>
              </div>
            )}

            {SAMPLE_REPORT.questions_worth_considering && (
              <div className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Questions to Consider</p>
                <p className="text-xs text-slate-500 mb-3">Questions to help deepen your preaching</p>
                <ul className="space-y-2.5">
                  {SAMPLE_REPORT.questions_worth_considering.map((q) => (
                    <li key={q} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                      <span className="text-slate-400 shrink-0 mt-0.5">—</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Pacing Analysis</p>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">Avg {SAMPLE_PACING.average_wpm} wpm · 60-second intervals</p>
              <PacingChart result={SAMPLE_PACING} />
            </div>

            <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-4">
              <Icon d={["M2 12h2", "M6 8v8", "M10 4v16", "M14 7v10", "M18 9v6", "M22 12h-2"]} size={18} color="#3760ad" strokeWidth={2} className="shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Submit audio or video and you get even more</p>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Upload a recording and your report adds pacing, tone and volume, and visual delivery feedback on how you came across.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => close("cta")}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors"
            >
              See this for your sermon
            </button>
            <p className="text-xs text-slate-500 mt-2">Takes two minutes. Even a rough draft works.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
