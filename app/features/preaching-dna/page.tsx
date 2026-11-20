import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cta, Eyebrow, Accent, H, INDIGO } from "@/components/FeatureBits";

export const metadata: Metadata = {
  title: "Preaching DNA — PreachingHub",
  description:
    "A portrait of your preaching built from patterns across your whole sermon history: your style, your strengths, how you're growing, and what to work on next. Try it free for 14 days.",
};

const SECTIONS = [
  { n: "01", label: "Preaching Style", color: "#E0966A", tint: "bg-orange-50", body: "How you naturally build and deliver a sermon." },
  { n: "02", label: "Signature Strengths", color: "#6DB89C", tint: "bg-emerald-50", body: "What you do consistently well, with real examples." },
  { n: "03", label: "Growth Trajectory", color: "#7A82D8", tint: "bg-indigo-50", body: "How your preaching has changed over time." },
  { n: "04", label: "Focused Growth Areas", color: "#D6B65A", tint: "bg-yellow-50", body: "The one or two things most worth working on." },
  { n: "05", label: "Top Recommendations", color: "#A18BD3", tint: "bg-violet-50", body: "Practical next steps before your next sermon." },
];

// Muted versions of the five section colors.
const HELIX_COLORS = ["#E0966A", "#6DB89C", "#7A82D8", "#D6B65A", "#A18BD3"];

// A tilted double helix whose rungs carry the five parts of the report.
function DnaHelix() {
  const W = 470, Hh = 460, cx = 140, amp = 56, period = 184, tilt = 22;
  const c = Hh / 2;
  const rad = (tilt * Math.PI) / 180;
  const strand = (phase: number) => {
    const pts: string[] = [];
    for (let y = -40; y <= Hh + 40; y += 4) {
      const x = cx + amp * Math.sin((2 * Math.PI * y) / period + phase);
      pts.push(`${y === -40 ? "M" : "L"}${x.toFixed(1)} ${y}`);
    }
    return pts.join(" ");
  };
  const rungs: { y: number; x1: number; x2: number; depth: number }[] = [];
  for (let y = -34; y < Hh + 40; y += 14) {
    const t = (2 * Math.PI * y) / period;
    rungs.push({ y, x1: cx + amp * Math.sin(t), x2: cx - amp * Math.sin(t), depth: Math.abs(Math.cos(t)) });
  }
  const labels = ["Style", "Strengths", "Trajectory", "Growth areas", "Recommendations"];
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} className="w-full max-w-md mx-auto overflow-visible" role="img" aria-label="A tilted DNA double helix with five labeled parts: style, strengths, trajectory, growth areas, and recommendations">
      <defs>
        <linearGradient id="dnaA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#334155" />
          <stop offset="1" stopColor="#94A3B8" />
        </linearGradient>
        <radialGradient id="dnaGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E2E8F0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#E2E8F0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={c} r="220" fill="url(#dnaGlow)" />
      <g transform={`rotate(${tilt} ${cx} ${c})`}>
        {rungs.map((r, i) => (
          <line key={i} x1={r.x1} x2={r.x2} y1={r.y} y2={r.y} stroke={HELIX_COLORS[i % 5]} strokeWidth="3.5" strokeLinecap="round" opacity={0.25 + 0.6 * r.depth} />
        ))}
        <path d={strand(0)} fill="none" stroke="url(#dnaA)" strokeWidth="6" strokeLinecap="round" />
        <path d={strand(Math.PI)} fill="none" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
      </g>
      {labels.map((l, i) => {
        const along = (i - 2) * 86;
        const ax = cx - along * Math.sin(rad);
        const y = c + along * Math.cos(rad);
        const x0 = ax + amp * Math.cos(rad) + 14;
        const xDot = cx + 2 * 86 * Math.sin(rad) + amp + 52;
        return (
          <g key={l}>
            <line x1={x0} x2={xDot} y1={y} y2={y} stroke={HELIX_COLORS[i]} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
            <circle cx={xDot} cy={y} r="5" fill={HELIX_COLORS[i]} />
            <text x={xDot + 14} y={y + 5} fontSize="15" fontWeight="700" fill="#0f172a" fontFamily="var(--font-inter), system-ui, sans-serif">{l}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function PreachingDnaPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pb-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Preaching DNA</Eyebrow>
            <h1 className={`${H} text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-slate-900 mb-6`}>
              See the patterns you <Accent>can&apos;t see</Accent> from the pulpit.
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
              Preaching DNA is a portrait of your preaching built from your whole sermon history: your style, your strengths, how you&apos;re growing, and what to work on next.
            </p>
            <Cta />
          </div>
          <DnaHelix />
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-6`}>
            One sermon is a snapshot. <Accent>You&apos;re a pattern.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Feedback on a single message tells you about one Sunday. It can&apos;t show what you do every week, what&apos;s getting stronger, or what keeps holding you back. That only shows up when someone looks at all of them together.
          </p>
        </div>
      </section>

      {/* Five parts */}
      <section className="py-16 sm:py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-4xl leading-[1.08] text-slate-900 mb-8 text-center`}>
            Five parts, one <Accent>clear picture.</Accent>
          </h2>
          <div className="rounded-3xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {SECTIONS.map(({ label, color, body }) => (
              <div key={label} className="flex items-center gap-4 px-5 sm:px-7 py-4">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <p className="w-44 sm:w-52 shrink-0 text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color }}>{label}</p>
                <p className="hidden sm:block text-slate-600 text-sm leading-snug">{body}</p>
              </div>
            ))}
          </div>
          <p className="sm:hidden text-sm text-slate-500 mt-4 text-center">Each section is written about your preaching, not preaching in general.</p>
        </div>
      </section>

      {/* Specific to you */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Specific to you</Eyebrow>
            <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
              Your own sermons, <Accent>read back to you.</Accent>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              Your strengths come with real moments from your own sermons, so you can see exactly what you do well and keep doing it on purpose.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 border-l-[6px] border-l-emerald-400 bg-white shadow-xl shadow-slate-200/70 p-6 sm:p-7 w-full max-w-lg mx-auto select-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-500 mb-3">Signature strengths</p>
            <p className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-lg text-slate-900 leading-snug mb-3">
              You name the heart of a passage in one sentence that shows who God is and how people really live.
            </p>
            <p className="text-sm text-slate-500 leading-relaxed">
              Sample: Across your sermons, that one sentence does two jobs at once. It reveals something true about God and something true about the listener&apos;s life, so the text lands as discovery, not assertion.
            </p>
          </div>
        </div>
      </section>

      {/* Versions + PDF */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
            Watch it change as <Accent>you grow.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Your Preaching DNA keeps its history. Switch between versions to see how your preaching has developed, and download any version as a PDF to keep or share with a mentor.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm">Version 6 · Latest <span aria-hidden="true">⌄</span></span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm">Download PDF</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>
            Find out what your preaching <Accent>is made of.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Run a few sermons through PreachingHub and your Preaching DNA builds from them.
          </p>
          <Cta />
        </div>
      </section>

      <Footer />
    </main>
  );
}
