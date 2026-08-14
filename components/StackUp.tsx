import { PHLogoGray } from "@/components/Logo";

const NAVY = "#3760ad";

function Check() {
  return <span className="text-lg font-bold" style={{ color: NAVY }}>✓</span>;
}

function CheckNeutral() {
  return <span className="text-lg font-bold text-slate-600">✓</span>;
}

function Cross() {
  return <span className="text-lg font-bold text-slate-300">✗</span>;
}

function Separator({ text, emphasized = false }: { text: string; emphasized?: boolean }) {
  return (
    <tr>
      <td colSpan={7} className="pt-8 pb-4 px-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px" style={{ backgroundColor: emphasized ? NAVY : "#e2e8f0" }} />
          <span
            className={`text-xs whitespace-nowrap ${emphasized ? "font-bold" : "italic text-slate-400"}`}
            style={emphasized ? { color: NAVY } : undefined}
          >
            {text}
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: emphasized ? NAVY : "#e2e8f0" }} />
        </div>
      </td>
    </tr>
  );
}

const COMPETITORS = ["Sermonary", "SermonAI", "Sermonly", "Logos", "Pastor Center"];

export function StackUp() {
  return (
    <>
      {/* ─── Comparison table ─────────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14" data-animate="fade-up">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: NAVY }}>
              How We Stack Up
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              The only sermon tool that coaches you on what you&apos;ve actually preached.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Every other tool helps you write sermons. PreachingHub helps you grow as a preacher.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-x-auto" data-animate="fade-up" data-delay="100">
            <table className="border-collapse" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="w-56 sticky left-0 z-10 bg-white text-left px-5 py-4 text-sm font-semibold text-slate-500 border-b border-slate-200 align-bottom">
                    &nbsp;
                  </th>
                  <th className="w-36 sticky left-56 z-10 px-4 py-4 text-center align-bottom" style={{ backgroundColor: NAVY }}>
                    <span className="text-white font-bold text-sm">PreachingHub</span>
                  </th>
                  {COMPETITORS.map((name) => (
                    <th key={name} className="min-w-[120px] px-4 py-4 text-center text-sm font-semibold text-slate-700 border-b border-slate-200 align-bottom">
                      {name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Section 1 label */}
                <tr>
                  <td colSpan={7} className="pt-6 pb-3 px-4 text-center">
                    <span className="text-xs italic text-slate-400">The essentials — we all have these</span>
                  </td>
                </tr>

                {/* Row 1 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Doc-style sermon builder</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 2 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Sermon templates (Expository, Narrative, Topical)</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 3 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Sermon library &amp; history</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 4 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Series planner</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 5 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Passage background research brief</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 6 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Commentary &amp; research library</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}>
                    <div className="flex flex-col items-center gap-0.5">
                      <Check />
                      <span className="text-xs font-medium" style={{ color: NAVY }}>Library of Free Resources</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 7 */}
                <tr className="bg-slate-50">
                  <td className="w-56 sticky left-0 z-10 bg-slate-50 px-5 py-4 border-b border-slate-100 text-sm text-slate-600">AI writes sermon content</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}>
                    <span
                      className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 cursor-help"
                      title="PreachingHub believes the sermon belongs to the preacher. We coach what you write — we never write it for you."
                    >
                      <Cross /> By design
                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 text-slate-400 text-[9px] font-bold leading-none">i</span>
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100">
                    <span
                      className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500 cursor-help"
                      title="Pastor Center's Barnabas assistant can draft sermon content for you — a different philosophy than PreachingHub's coach-only approach."
                    >
                      <CheckNeutral /> Writes for you
                      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-slate-300 text-slate-400 text-[9px] font-bold leading-none">i</span>
                    </span>
                  </td>
                </tr>

                <Separator text="where PreachingHub goes further" emphasized />

                {/* Row 8 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-5 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 text-sm">AI evaluates YOUR actual sermon</span>
                  </td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-5 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 8a */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">Personalization profile (tunes feedback to your tradition &amp; context)</span>
                      <span className="inline-flex items-center text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ backgroundColor: NAVY }}>
                        Only PreachingHub
                      </span>
                    </div>
                  </td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-5 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-5 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 8b */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">AI-customized prep workflow</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 8c */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100" style={{ verticalAlign: "top" }}>
                    <div className="text-sm text-slate-600">Longitudinal growth tracking</div>
                    <div className="text-xs text-slate-400">Preaching Fingerprint</div>
                  </td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 9 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Audio upload → AI coaching</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 10 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">YouTube &amp; video link → AI coaching</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 11 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Pacing analysis from audio</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 12 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Structured coaching rubric (7 categories)</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><CheckNeutral /></td>
                </tr>

                {/* Row 13 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Coach Mode with shareable PDF report</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                {/* Row 14 */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Group/1:1 coach dashboard</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}><Check /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                  <td className="px-4 py-4 text-center border-b border-slate-100"><Cross /></td>
                </tr>

                <Separator text="and the price" emphasized />

                {/* Row 15 — pricing */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Monthly price</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>$29+/mo</span>
                  </td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">$49+/mo</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">$14.99+/mo</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">$19.99+/mo</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">$14.99+/mo</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">
                    <div className="flex flex-col items-center gap-0.5">
                      <span>$99.99+/mo</span>
                      <span className="text-[10px] text-slate-300">Sermons module only</span>
                    </div>
                  </td>
                </tr>

                {/* Row 16 — free trial */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-4 border-b border-slate-100 text-sm text-slate-600">Free trial</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-4 text-center border-b border-slate-100" style={{ backgroundColor: "#eff6ff" }}>
                    <span className="font-bold text-sm" style={{ color: NAVY }}>14 days — no card</span>
                  </td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">14 days (card required)</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">7 days (card required)</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">7 days</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">30 days</td>
                  <td className="px-4 py-4 text-center border-b border-slate-100 text-sm text-slate-400">7 days (card required)</td>
                </tr>

                {/* Row 17 — sub-row */}
                <tr>
                  <td className="w-56 sticky left-0 z-10 bg-white px-5 py-3 text-sm italic text-slate-500">Free evaluation before you commit</td>
                  <td className="w-36 sticky left-56 z-10 px-4 py-3 text-center" style={{ backgroundColor: "#eff6ff" }}>
                    <span className="text-sm font-semibold" style={{ color: NAVY }}>✓ No account needed</span>
                  </td>
                  <td className="px-4 py-3 text-center"><Cross /></td>
                  <td className="px-4 py-3 text-center"><Cross /></td>
                  <td className="px-4 py-3 text-center"><Cross /></td>
                  <td className="px-4 py-3 text-center"><Cross /></td>
                  <td className="px-4 py-3 text-center"><Cross /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="md:hidden text-xs text-slate-400 text-center mt-3">swipe to compare →</p>

          <p className="text-xs text-slate-400 text-center mt-8 max-w-xl mx-auto">
            Prices current as of August 2026. Competitor features verified from their public websites. Pastor Center&apos;s Sermons module is one of four separately-priced modules in their platform — the price shown is not their full platform cost.
          </p>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6" style={{ backgroundColor: NAVY }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-10">
            <PHLogoGray height={36} />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            See the difference for yourself.
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
            Get a free coaching report on a sermon you&apos;ve already preached. No account, no card, no commitment.
          </p>
          <a href="/try" className="cta-btn-white inline-flex items-center gap-2 bg-white font-semibold px-8 py-4 rounded-xl text-base shadow-lg" style={{ color: NAVY }}>
            Get My Free Coaching Report →
          </a>
          <p className="text-blue-200 text-xs mt-5">No account needed. No card required.</p>
        </div>
      </section>
    </>
  );
}
