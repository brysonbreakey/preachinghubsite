import { FeedbackReportMockup } from "@/components/FeedbackReportMockup";

export function ChecklistVSL() {
  return (
    <div className="max-w-2xl mx-auto mb-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Your checklist is on its way 🎉
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        If you don&apos;t see it in a few minutes, check your spam folder.
      </p>
      <div className="rounded-2xl overflow-hidden shadow-xl shadow-blue-100/50 border border-slate-200 bg-black">
        <video className="w-full aspect-video" controls preload="metadata" poster="/video/checklist-vsl-poster.jpg" playsInline>
          <source src="/video/checklist-vsl.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}

export function ChecklistThankYouHero() {
  return (
    <div className="text-center mb-10 max-w-2xl mx-auto">
      <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "#3760ad" }}>
        While you wait
      </p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
        Get a free instant coaching report on your last sermon
      </h1>
      <p className="text-lg text-slate-500 leading-relaxed mb-3">
        Give us one sermon and we&apos;ll send back a personal coaching report in a few minutes — what&apos;s working, what to sharpen, and questions to think about before next Sunday. Free, no account needed.
      </p>
      <p className="text-base text-slate-500 leading-relaxed mb-8">
        <strong className="font-semibold text-slate-700">No recording handy?</strong> Just paste your notes or manuscript — that works too.
      </p>

      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Here&apos;s a sample report</p>
      <div className="relative max-w-md mx-auto overflow-hidden rounded-2xl" style={{ maxHeight: 340 }}>
        <FeedbackReportMockup />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{ background: "linear-gradient(to bottom, rgba(248,250,252,0), rgb(248,250,252))" }}
        />
      </div>
    </div>
  );
}
