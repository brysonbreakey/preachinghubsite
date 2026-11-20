import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Testimonial } from "@/components/Testimonial";
import { BRENT_GARRARD } from "@/lib/testimonials";
import { Cta, Eyebrow, Accent, SERIF, H, INDIGO } from "@/components/FeatureBits";
import { FaqSection } from "@/components/FaqSection";
import { COACHING_FAQ_IDS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "Instant Coaching — PreachingHub",
  description:
    "Get specific, private coaching on every sermon you preach: what's working, how to grow, and what to work on next. Try it free for 14 days.",
};

// A compact, hand-built look at a report. Sample content only.
function ReportPreview() {
  const rows: [string, string, boolean][] = [
    ["Textual Faithfulness", "Strong", true],
    ["Main Idea Clarity", "How to grow", false],
    ["Introduction", "Strong", true],
    ["Movement & Structure", "How to grow", false],
    ["Illustration Clarity", "Strong", true],
  ];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-6 sm:p-7 w-full max-w-md mx-auto select-none">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Sermon coaching report</p>
      <p className="font-[family-name:var(--font-inter)] font-black tracking-[-0.04em] text-2xl text-slate-900 mt-1 mb-5">Grace That Finds Us</p>
      <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-1">Your biggest win</p>
        <p className="text-sm font-semibold text-slate-800">Gospel clarity in the third movement.</p>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">Protect this instinct. It&apos;s the heart of your preaching.</p>
      </div>
      <div className="space-y-2">
        {rows.map(([label, tag, strong]) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-2.5">
            <span className="text-sm text-slate-700">{label}</span>
            <span
              className={`text-[11px] font-semibold rounded-full px-2.5 py-0.5 ${
                strong ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
              }`}
            >
              {tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


// A hand-built look at the voice memo player. Sample content only.
function VoiceMemoPlayer() {
  const bars = [30,55,40,70,50,85,60,45,75,90,65,50,80,55,40,70,60,35,65,85,50,40,60,30,45,25,35,20,30,18];
  const played = 12;
  return (
    <div className="rounded-3xl bg-white p-6 sm:p-7 shadow-2xl shadow-indigo-900/30 w-full max-w-md mx-auto select-none">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: INDIGO }}>AI</div>
        <div>
          <p className="text-sm font-bold text-slate-900 leading-tight">Voice memo from your AI coach</p>
          <p className="text-xs text-slate-500">Grace That Finds Us</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center" style={{ backgroundColor: INDIGO }} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
        </div>
        <div className="flex-1 flex items-center gap-[3px] h-12" aria-hidden="true">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-full" style={{ height: `${h}%`, backgroundColor: i < played ? INDIGO : "#C7D2FE" }} />
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-3 tabular-nums">
        <span>0:24</span>
        <span>1:05</span>
      </div>
    </div>
  );
}

const PACING = [18, 22, 28, 35, 40, 38, 42, 45, 50, 48, 52, 58, 62, 60, 65, 68, 70, 65, 72, 75, 78, 80, 76, 74, 70, 68, 72, 74, 78, 82, 85, 80, 76, 70, 65, 60, 52, 45, 38, 28];

const SHOWS = [
  "A clear win to protect, so you know what to keep doing",
  "Feedback across 7 areas of preaching, from your text to your close",
  "Specific ways to grow, with your top coaching priority first",
  "Questions to consider that deepen your preaching",
  "Pacing, tone, and volume from your audio or video",
  "Body language and facial expressions, if you submit video",
  "A full transcript and a PDF you can keep",
  "A short voice memo from your AI coach with your top takeaway",
];

const WAYS = [
  { title: "Paste a YouTube link", body: "Posted it online? Paste the link and we do the rest.", bg: "bg-red-500/10", color: "#ef4444", d: "M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM10 9.5l4 2.5-4 2.5z" },
  { title: "Upload a file", body: "Audio, video, a PDF, or a Word doc. Audio uploads fastest.", bg: "bg-indigo-500/10", color: "#6366f1", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" },
  { title: "Paste your notes", body: "Drop in your outline or manuscript to get feedback before you preach.", bg: "bg-blue-500/10", color: "#3b82f6", d: "M4 7V4h16v3M9 20h6M12 4v16" },
];

export default function SermonFeedbackPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pb-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Instant Coaching</Eyebrow>
            <h1 className={`${H} text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-slate-900 mb-6`}>
              See what&apos;s landing. Fix what <span className={`${SERIF} italic font-semibold tracking-[-0.01em] text-[1.08em]`} style={{ color: INDIGO }}>isn&apos;t.</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
              Submit any sermon and get a clear, private coaching report in minutes: what&apos;s working, where to grow, and what to focus on first.
            </p>
            <Cta />
          </div>
          <ReportPreview />
        </div>
      </section>

      {/* The problem */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-6`}>
            Most feedback stops at <span className={`${SERIF} italic font-semibold tracking-[-0.01em]`} style={{ color: INDIGO }}>&ldquo;nice job.&rdquo;</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Friends are kind and congregations are gracious. But almost no one sits down with you to say which point was unclear, where the energy dipped, or what to change next week. That&apos;s the gap this closes.
          </p>
        </div>
      </section>

      {/* Voice memo spotlight */}
      <section className="py-16 sm:py-24 px-6 overflow-hidden" style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white mb-5">
              New · Voice memo
            </p>
            <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-white mb-5`}>
              Don&apos;t just read your feedback. <span className={`${SERIF} italic font-semibold tracking-[-0.01em] text-[1.05em]`}>Hear it.</span>
            </h2>
            <p className="text-lg text-white/85 leading-relaxed mb-6 max-w-lg">
              With your report comes a short voice memo from your AI coach, with your most important takeaway said out loud. Listen on the drive home, on a walk, or right before you preach again.
            </p>
            <ul className="space-y-3 text-white">
              {["Your top takeaway, in a human voice", "Listen anywhere. No reading, no scrolling", "Feels like a coach talking to you, not a score"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <svg className="mt-1 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <VoiceMemoPlayer />
        </div>
      </section>

      {/* Ways in */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-3`}>
            Submit it your way.
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-xl">Use whatever you already have. No special setup.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {WAYS.map(({ title, body, bg, color, d }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${bg}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
                </div>
                <h3 className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-xl text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery analysis */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Delivery analysis</Eyebrow>
            <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
              Hear how you <Accent>sound,</Accent> too.
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-6">
              Submit audio or video and your report goes beyond the words. See how your tone, volume, and pace move through the sermon, and where filler words creep in.
            </p>
            <div className="flex flex-wrap gap-2.5 mb-5">
              {["Tone", "Volume", "Pace", "Filler words", "Pacing chart"].map((t) => (
                <span key={t} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{t}</span>
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed max-w-lg">
              Submit video and you also get feedback on body language and facial expressions.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-7 w-full max-w-md mx-auto select-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Pacing analysis</p>
            <div className="flex items-end gap-[2px] h-28 mb-2">
              {PACING.map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: h > 72 ? INDIGO : h > 45 ? "#A5B4FC" : "#E0E7FF" }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-4 tabular-nums"><span>0:00</span><span>19:00</span><span>38:00</span></div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              {[["Avg pace", "145 wpm"], ["Peak", "Min 28–35"], ["Pauses", "7"]].map(([k, v]) => (
                <span key={k}>{k} <span className="font-semibold text-slate-800">{v}</span></span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4">Sample data</p>
          </div>
        </div>
      </section>

      {/* What the report shows */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-8`}>
            What&apos;s inside your report
          </h2>
          <ul className="space-y-4">
            {SHOWS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-lg text-slate-700">
                <svg className="mt-1.5 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <Testimonial {...BRENT_GARRARD} left />
        </div>
      </section>

      <FaqSection ids={COACHING_FAQ_IDS} bg="bg-slate-50" />

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>
            Make your next sermon your <span className={`${SERIF} italic font-semibold tracking-[-0.01em]`} style={{ color: INDIGO }}>best.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Submit a recent sermon and see exactly where to grow, starting today.
          </p>
          <Cta />
        </div>
      </section>

      <Footer />
    </main>
  );
}
