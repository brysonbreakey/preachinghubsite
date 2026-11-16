import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Kickoff Call — 7-Day Preaching Growth Challenge" },
  description: "Join the kickoff video call to start the 7-Day Preaching Growth Challenge. Book your 1:1 growth strategy session with Bryson in advance.",
  alternates: { canonical: "/challenge/kickoff" },
};

const H = "font-[family-name:var(--font-inter)] tracking-[-0.04em]";
const SERIF = "font-[family-name:var(--font-lora)]";

export default function KickoffPage() {
  return (
    <main className="font-[family-name:var(--font-jakarta)] bg-white text-[#0F172A] overflow-x-hidden antialiased min-h-screen">

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 pt-14 pb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] text-[#4F46E5] mb-8">
          7-Day Preaching Growth Challenge
        </div>

        <h1 className={`text-4xl sm:text-5xl font-black leading-[1.08] text-[#0F172A] mb-5 ${H}`}>
          You&rsquo;re in.<br />
          <span className={`text-[#4F46E5] italic ${SERIF}`}>Here&rsquo;s what&rsquo;s next.</span>
        </h1>

        <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
          The kickoff call starts the challenge — we get focused, set the tone,
          and make sure everyone knows what Day 1 looks like.
        </p>
      </section>

      {/* Kickoff call details */}
      <section className="max-w-2xl mx-auto px-6 pb-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7 flex flex-col sm:flex-row gap-6 items-start">
          <div className="shrink-0 w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
            </svg>
          </div>
          <div>
            <p className={`text-lg font-black text-[#0F172A] mb-1 ${H}`}>Kickoff Video Call</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Join live at <strong className="text-[#0F172A]">1:00 PM CST</strong> on Day 1.
              We&rsquo;ll start the challenge together, go over the daily format, and answer any questions.
              A link will be in your welcome email.
            </p>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border-2 border-[#4F46E5] bg-[#4F46E5]/[0.03] p-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#4F46E5]/10 mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-black text-[#0F172A] mb-3 ${H}`}>
            Book your 1:1 growth strategy session
          </h2>
          <p className="text-slate-600 leading-relaxed mb-7 max-w-lg mx-auto">
            Finish the challenge and you&rsquo;ll earn a free 20-minute coaching call with Bryson.
            Book it now so the time is held — you&rsquo;ll meet after Day 7.
          </p>

          <a
            href="https://calendar.app.google/ag6KNHudWi7ZrMr16"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl bg-[#4F46E5] text-white font-bold text-base shadow-lg shadow-indigo-200 hover:bg-[#4338CA] transition-colors"
          >
            Book your session in advance
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>

          <p className="mt-4 text-xs text-slate-400">
            Opens in Google Calendar &middot; Free, no charge required
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <h2 className={`text-xl font-black text-[#0F172A] mb-6 ${H}`}>What to expect this week</h2>
        <ol className="space-y-5">
          {[
            { n: "1", title: "Pre-challenge homework", body: "It's in your welcome email — a short exercise to do before Day 1 so you hit the ground running." },
            { n: "2", title: "Kickoff call (Day 1 at 1 PM CST)", body: "Join live and start the challenge with everyone else. Link is in your welcome email." },
            { n: "3", title: "7 days of prompts & check-ins", body: "About 15 minutes a day. Your day off and Sunday are off." },
            { n: "4", title: "Your 1:1 session after Day 7", body: "Finish all 7 days, then meet with Bryson to tighten your growth plan." },
          ].map(({ n, title, body }) => (
            <li key={n} className="flex gap-4">
              <span className={`shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-[#4F46E5] text-sm font-black flex items-center justify-center ${H}`}>{n}</span>
              <div>
                <p className={`font-bold text-[#0F172A] text-sm mb-0.5 ${H}`}>{title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

    </main>
  );
}
