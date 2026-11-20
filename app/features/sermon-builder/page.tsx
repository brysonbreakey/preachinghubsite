import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Cta, Eyebrow, Accent, IconTile, H, INDIGO } from "@/components/FeatureBits";

export const metadata: Metadata = {
  title: "Sermon Builder — PreachingHub",
  description:
    "Study, write, and sharpen every sermon in one place: background on your passage, a full editor, and coaching right inside your draft. Try it free for 14 days.",
};

const STEPS = [
  { n: 1, label: "Read Passage" },
  { n: 2, label: "Personal Study" },
  { n: 3, label: "Research" },
  { n: 4, label: "Main Idea" },
  { n: 5, label: "Craft" },
  { n: 6, label: "Editing" },
];

// A hand-built look at the builder. Sample content only.
function BuilderPreview() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 overflow-hidden w-full max-w-xl mx-auto select-none">
      <div className="flex">
        <div className="w-[38%] shrink-0 border-r border-slate-100 bg-slate-50/60 p-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] text-slate-500">Prep Landmarks</p>
            <p className="text-[11px] font-bold" style={{ color: INDIGO }}>6/6</p>
          </div>
          <div className="h-1 rounded-full bg-indigo-100 mb-4">
            <div className="h-1 rounded-full w-full" style={{ backgroundColor: INDIGO }} />
          </div>
          <div className="space-y-2.5">
            {STEPS.map(({ n, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-slate-700">
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: "#6366F1" }} />
                <span className="text-slate-400 w-2">{n}</span>
                {label}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50 px-2.5 py-2 text-[11px] font-semibold" style={{ color: INDIGO }}>
            View Sermon Brief
          </div>
        </div>
        <div className="flex-1 min-w-0 p-5 relative">
          <p className={`${H} text-xl text-slate-900 leading-tight mb-1`}>The Love of God</p>
          <p className="text-[10px] text-slate-400 mb-4">Series: Foundations of Faith · John 3:16</p>
          <div className="space-y-2">
            {[100, 94, 98, 70, 100, 88, 60].map((w, i) => (
              <div key={i} className="h-2 rounded-full bg-slate-100" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-white border border-slate-200 shadow-lg pl-3 pr-1 py-1">
            <span className="w-3 h-3 rounded bg-slate-200" />
            <span className="w-3 h-3 rounded bg-slate-200" />
            <span className="w-3 h-3 rounded bg-slate-200 mr-1" />
            <span className="rounded-full bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5">Coaching</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const EXTRAS = [
  { title: "Preaching Calendar", body: "See what you're preaching and when, so nothing sneaks up on you.", bg: "bg-blue-500/10", color: "#3b82f6", d: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { title: "Research Library", body: "A free library of research tools, right when you need them.", bg: "bg-emerald-500/10", color: "#10b981", d: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5" },
  { title: "Share with your team", body: "Send notes to staff and volunteers without copying and pasting.", bg: "bg-orange-500/10", color: "#f97316", d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
];

export default function SermonBuilderPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 sm:pb-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Eyebrow>Sermon Builder</Eyebrow>
            <h1 className={`${H} text-[clamp(2.5rem,7vw,4.25rem)] leading-[1.05] text-slate-900 mb-6`}>
              From first read to final draft, <Accent>in one place.</Accent>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-8">
              A full sermon editor with background on your passage ready to go, your research beside the page, and coaching right inside your draft.
            </p>
            <Cta />
          </div>
          <BuilderPreview />
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-6`}>
            Sermon prep shouldn&apos;t live in <Accent>six places.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Notes in one app, the passage in another tab, commentary in a third, and a draft in a document that has nothing to do with any of it. Every switch costs you the thread. Your prep deserves one home.
          </p>
        </div>
      </section>

      {/* Sermon brief */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <Eyebrow>Sermon brief</Eyebrow>
            <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
              Know the text before you <Accent>open a commentary.</Accent>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-6">
              Every sermon comes with a brief on your passage, so you start your study already oriented instead of spending the first hour on background.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-slate-700 max-w-lg">
              {["Author and date of writing", "Why it was written", "Historical background", "Literary context", "Key interpretive issues"].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <svg className="mt-1 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={INDIGO} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-7 sm:p-8 w-full max-w-md mx-auto select-none">
            <div className="flex items-baseline gap-2 mb-5 pb-4 border-b border-slate-100">
              <p className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-slate-900">Sermon Brief</p>
              <p className="text-xs" style={{ color: INDIGO }}>John 3:16 — The Love of God</p>
            </div>
            <div className="space-y-5">
              {[
                ["Author", "John"],
                ["Why it was written", "John writes so that readers will believe that Jesus is the Messiah, the Son of God, and have life in his name."],
                ["Historical background", "This verse comes out of Jesus' night conversation with Nicodemus, a Pharisee and a leader of the Jewish people."],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: INDIGO }}>{k}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coaching in the editor */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Coaching built in</Eyebrow>
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-6`}>
            Get feedback before you <Accent>ever preach it.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            When the draft is ready, tap Coaching. You get the same specific feedback you&apos;d get on a sermon you&apos;ve preached, while there&apos;s still time to change it.
          </p>
          <div className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 shadow-lg pl-5 pr-1.5 py-1.5">
            <span className="text-xs text-slate-400 mr-3">Draft ready?</span>
            <span className="rounded-full bg-slate-900 text-white text-sm font-bold px-5 py-2.5">Coaching</span>
          </div>
        </div>
      </section>

      {/* Pulpit Mode */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1 w-full max-w-[22rem] mx-auto select-none" aria-hidden="true">
            {/* Tablet, portrait */}
            <div className="relative rounded-[2.25rem] bg-slate-900 p-3.5 shadow-2xl shadow-slate-400/50 ring-1 ring-slate-700">
              <span className="absolute left-1/2 top-1.5 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-600" />
              <div className="relative rounded-[1.5rem] bg-white overflow-hidden aspect-[3/4]">
                <div className="px-5 pt-5 pb-2 text-[10px] leading-[1.55] text-slate-700">
                  <p className="font-[family-name:var(--font-inter)] font-black tracking-[-0.03em] text-[15px] text-slate-900 leading-tight">The Love of God</p>
                  <p className="text-[9px] text-slate-400 mb-3">John 3:16 · Foundations of Faith</p>

                  <p className="mb-3">
                    Nicodemus comes at night with a question about God. Jesus answers with a sentence that has been called the gospel in a nutshell. Slow down here. Let them feel how familiar it is, then show them what they&apos;ve missed.
                  </p>

                  <p className="font-bold text-slate-900 text-[11px] mb-0.5">I. God loved the world</p>
                  <p className="mb-1.5">
                    The surprise is the word <span className="font-semibold">world</span>. Not the worthy. Not the religious. The whole rebellious, searching, hurting world (3:19).
                  </p>
                  <p className="mb-1.5 pl-3 -indent-3">– Love is where God starts, not what he rewards</p>
                  <p className="mb-3 italic" style={{ color: INDIGO }}>[pause. Look up.]</p>

                  <p className="font-bold text-slate-900 text-[11px] mb-0.5">II. He gave his one and only Son</p>
                  <p className="mb-1.5">
                    Real love costs something. Paul says it plainly: God shows his love for us in that while we were still sinners, Christ died for us (Rom 5:8).
                  </p>
                  <p className="mb-3 pl-3 -indent-3">– Illustration: the gift you can&apos;t repay</p>

                  <p className="font-bold text-slate-900 text-[11px] mb-0.5">III. Whoever believes</p>
                  <p>
                    Whoever. The invitation is as wide as the love. Don&apos;t rush it. Let it sit, then give the invitation.
                  </p>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white to-transparent" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center">Sample notes</p>
          </div>
          <div className="order-1 lg:order-2">
            <Eyebrow>Pulpit Mode</Eyebrow>
            <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
              Preach from your notes, <Accent>distraction-free.</Accent>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
              When it&apos;s time to preach, switch to Pulpit Mode and your sermon becomes a clean view built for the pulpit. The words you prepared, and nothing else competing for your attention.
            </p>
          </div>
        </div>
      </section>

      {/* Prep your way */}
      <section className="py-16 sm:py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-5`}>
            Already have a process? <Accent>Keep it.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Prep landmarks give you a simple path from the text to a finished sermon, and you can customize the steps to fit how you already work.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {["Read Passage", "Personal Study", "Research", "Main Idea", "Craft", "Editing"].map((t, i) => (
              <span key={t} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center" style={{ backgroundColor: INDIGO }}>{i + 1}</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Extras */}
      <section className="py-16 sm:py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-10`}>
            Everything around the <Accent>draft.</Accent>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXTRAS.map(({ title, body, bg, color, d }) => (
              <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7">
                <div className="mb-5"><IconTile d={d} bg={bg} color={color} /></div>
                <h3 className="font-[family-name:var(--font-inter)] font-extrabold tracking-[-0.03em] text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-6 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className={`${H} text-3xl sm:text-5xl leading-[1.08] text-slate-900 mb-4`}>
            Build your next sermon <Accent>here.</Accent>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            Start the prep process on this week&apos;s passage and see how much lighter it feels.
          </p>
          <Cta />
        </div>
      </section>

      <Footer />
    </main>
  );
}
