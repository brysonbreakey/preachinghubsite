"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// The scrollable sample report. Once it reaches the top or bottom, further wheel / trackpad
// movement (including momentum) is handed to the page, so the scroll never hits a hard stop.
function ScrollableReport({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((e.deltaY > 0 && atBottom) || (e.deltaY < 0 && atTop)) {
        e.preventDefault();
        window.scrollBy(0, e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY);
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  return (
    <div ref={ref} className="h-[360px] overflow-y-auto sm:h-[480px]" tabIndex={0} role="region" aria-label="Sample coaching report, scrollable">
      {children}
    </div>
  );
}

export function SampleReportShowcase() {
  return (
    <section className="py-16 sm:py-24 px-6 bg-slate-50">
      <div className="max-w-3xl mx-auto text-center" data-animate="fade-up">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#3760ad" }}>Sample Report</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">See what you&rsquo;ll get</h2>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto">
          Scroll through a real PreachingHub coaching report: what you did well, and practical ways to grow for your next preaching moment.
        </p>
        <figure className="mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-[#F8FAFC] text-left shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)]">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
              <span className="mx-auto rounded-md bg-gray-100 px-4 py-1 text-[11px] font-medium text-[#64748B]">app.preachinghub.com</span>
              <span className="w-[42px]" />
            </div>
            <div className="relative">
              <ScrollableReport>
                <Image
                  src="/images/sample-coaching-report-v5.jpg"
                  alt="A PreachingHub coaching report: an overall summary, strengths and growth areas across the sermon, and the biggest wins"
                  width={1800}
                  height={3889}
                  sizes="(min-width: 672px) 672px, 100vw"
                  className="h-auto w-full"
                />
              </ScrollableReport>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/90 to-transparent" />
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
