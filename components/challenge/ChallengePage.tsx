"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { Icon } from "@/components/Icon";
import { BRENT_GARRARD } from "@/lib/testimonials";
import { challengePhase, formatCountdown } from "@/lib/challenge";
import { ChallengeSignupModal } from "./ChallengeSignupModal";

// The Free 7-Day Preaching Growth Challenge landing page. Same look as the 30-Day Preaching Growth
// Accelerator page (components/accelerator/AcceleratorPage.tsx); the signup is a popup that adds
// people to Kit with the 7-day-challenge tag. Dates are written out (Tuesday, November 10 to
// Thursday, November 19, 2026), so this page needs retiring or updating after the challenge.

const H = "font-[family-name:var(--font-inter)] tracking-[-0.04em]";
const SERIF = "font-[family-name:var(--font-lora)]";
const SHADOW_PREMIUM = "shadow-[0_10px_40px_-10px_rgba(15,23,42,0.05),0_2px_10px_-2px_rgba(15,23,42,0.02)]";
const FREE_PILL = "px-4 py-1.5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-emerald-100 [color:#fff]";

const INCLUDED = [
  {
    icon: ["M23 7l-7 5 7 5V7z", "M3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
    title: "A kickoff video call",
    body: "We start the challenge together, live, on a video call at 1 PM CST.",
  },
  {
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
    title: "7 days of prompts, check-ins, and growth exercises",
    body: "Each day brings focused prompts, check-ins, and growth exercises for your sermon. About 15 minutes a day.",
  },
  {
    icon: ["M12 2L2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
    title: "Free access to PreachingHub",
    body: "Use PreachingHub, our sermon prep and coaching space, while you work through the challenge.",
  },
  {
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    title: "A 1:1 call to plan your growth",
    body: "We finish with a one-on-one call to turn what you learned into a plan for how you'll keep growing, whether you continue with PreachingHub or not!",
  },
];

const STEPS = [
  { n: "1", title: "Do the pre-challenge homework", body: "Sign up now and we'll send it before the challenge starts. It's not a lot, don't worry." },
  { n: "2", title: "Kick off together", body: "Join the kickoff video call at 1 PM CST and get started with everyone else." },
  { n: "3", title: "Work on your own sermon", body: "Seven days of prompts, check-ins, and growth exercises, about 15 minutes a day. Your day off and Sunday are off." },
  { n: "4", title: "Sharpen your plan", body: "Finish with a 1:1 call to sharpen your growth plan." },
  { n: "5", title: "Unlock your rewards", body: "Complete the challenge and special rewards are unlocked for you." },
];

const FAQ = [
  ["Is it really free?", "Yes. All of it is free: the kickoff call, the daily exercises, access to PreachingHub and the 1:1 call. No card is required."],
  ["How much time does it take?", "About 15 minutes a day for 7 days, not counting your day off and Sunday."],
  ["Which sermon do I use?", "The one you're already working on (or start a new one during the challenge)."],
];

// "landing": the page at /challenge. "thank-you": the same page served at /checklist/thank-you, with
// the "your checklist is on its way" bar and download button on top and a headline that frames the
// challenge as the next step after the checklist.
export type ChallengeVariant = "landing" | "thank-you";

export function ChallengePage({ initialNow, variant = "landing" }: { initialNow: number; variant?: ChallengeVariant }) {
  const [modalOpen, setModalOpen] = useState(false);

  // The page knows the time the server rendered it at (so a visitor never sees the wrong state
  // flash in), then keeps its own clock: the countdown ticks, and the page flips to the waitlist
  // by itself if it's open when enrollment closes. The signup API makes its own decision from
  // its own clock, so this only changes what's shown.
  const [now, setNow] = useState(initialNow);
  useEffect(() => {
    const offset = initialNow - Date.now(); // the server's clock minus this device's clock
    const id = setInterval(() => {
      const t = Date.now() + offset;
      setNow(t);
      if (challengePhase(t) === "closed") clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [initialNow]);
  const phase = challengePhase(now);
  const waitlist = phase === "closed";
  const ctaLabel = waitlist ? "Join the waitlist" : "Join the free challenge";

  // One named event per visit, alongside PostHog's automatic $pageview.
  useEffect(() => {
    posthog.capture("challenge_page_viewed", { phase: challengePhase(initialNow), page: variant === "thank-you" ? "checklist_thank_you" : "challenge" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialNow]);

  function openSignup(location: string) {
    posthog.capture("challenge_cta_clicked", { location, phase, page: variant === "thank-you" ? "checklist_thank_you" : "challenge" });
    setModalOpen(true);
  }

  return (
    <main className="font-[family-name:var(--font-jakarta)] bg-white text-[#0F172A] overflow-x-hidden antialiased">
      <style>{`@keyframes acc-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .acc-fade-in { animation: acc-fade-in 0.8s ease-out; }`}</style>
      {modalOpen && <ChallengeSignupModal phase={phase} onClose={() => setModalOpen(false)} />}

      {variant === "thank-you" && (
        // Top bar: same as the one the accelerator version of this page has.
        <div className="bg-blue-50 border-b border-blue-100 py-3 px-6 text-center">
          <p className="text-sm sm:text-base text-blue-900">
            🎉 Your checklist is on its way — check your inbox (and spam folder) in a few minutes.
          </p>
          {/* Opens in a new tab so this page stays open behind it. */}
          <a
            href="/downloads/pre-preaching-checklist.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog.capture("checklist_pdf_opened", { page: "checklist_thank_you", variant: "challenge" })}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border-2 border-[#3760ad] bg-white px-4 py-1.5 text-sm font-semibold text-[#3760ad] shadow-sm hover:bg-blue-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Get your checklist now (PDF)
          </a>
        </div>
      )}

      {/* Hero */}
      <header className="acc-fade-in max-w-5xl mx-auto px-8 pt-12 md:pt-16 pb-24 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] mb-8 ${phase === "closed" ? "bg-indigo-50 border-indigo-100 text-[#4F46E5]" : "bg-red-50 border-red-100 text-red-600"}`}>
          {phase === "before" && (
            <>
              Starts in <span className="text-xs normal-case tracking-normal tabular-nums inline-flex gap-3">{formatCountdown(now).split(" ").map((part) => <span key={part.slice(-1)}>{part}</span>)}</span>
            </>
          )}
          {phase === "started" && "Started today. Enrollment closes tonight"}
          {phase === "closed" && "Enrollment is closed"}
        </div>
        {variant === "thank-you" && (
          <p className={`mx-auto mb-4 max-w-2xl text-2xl md:text-3xl font-black leading-tight text-[#0F172A] ${H}`}>
            Now that you&apos;ve got the checklist,{" "}
            <span className={`text-[#4F46E5] italic ${SERIF}`}>you&apos;re ready for the&hellip;</span>
          </p>
        )}
        <h1 className="mb-8">
          <Image
            src="/images/challenge-title.webp"
            alt="Free 7-Day Preaching Growth Challenge"
            width={2000}
            height={770}
            priority
            sizes="(min-width: 640px) 768px, 150vw"
            className="relative left-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 mix-blend-multiply sm:left-auto sm:mx-auto sm:w-full sm:max-w-3xl sm:translate-x-0"
          />
        </h1>
        <div className="mx-auto mb-12 max-w-2xl space-y-5">
          <p className={`text-2xl md:text-3xl font-black leading-tight text-[#0F172A] ${H}`}>
            We&apos;re looking for a group of preachers who will give a week to{" "}
            <span className={`text-[#4F46E5] italic ${SERIF}`}>take their preaching to the next level.</span>
          </p>
          <p className="text-lg text-[#64748B] leading-relaxed font-medium">
            Bring the sermon you&apos;re already working on, or start a new one. You&apos;ll get a kickoff video call, seven days of prompts, check-ins, and growth exercises, and a 1:1 call at the end to make a plan for your growth.
          </p>
          <p className={`text-xl md:text-2xl font-bold leading-snug text-[#0F172A] ${H}`}>
            By day 7 you&apos;ll have a stronger sermon and a written plan to keep growing.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            type="button"
            onClick={() => openSignup("hero")}
            className="inline-flex items-center gap-3 bg-[#4F46E5] text-white px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest [color:#fff]"
          >
            {ctaLabel}
          </button>
          <p className="text-sm sm:text-base font-black text-gray-500 uppercase tracking-widest">
            Free • No card required
          </p>
          <p className="max-w-md text-sm sm:text-base font-medium leading-relaxed text-[#64748B]">
            {phase === "before" && <span className="font-bold text-red-600">Sign up now to receive the pre-challenge homework.</span>}
            {phase === "started" && <span className="font-bold text-red-600">Enrollment closes tonight at midnight CST.</span>}
            {phase === "closed" && "Enrollment for this challenge is closed. Join the waitlist and we'll let you know about the next one."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            ["15 min", "a day, for 7 days"],
            ["Nov 10 – 19", "Tuesday to Thursday"],
            ["$0", "No card required"],
          ].map(([big, small]) => (
            <div key={big} className={`rounded-2xl border border-gray-100 bg-white px-6 py-6 ${SHADOW_PREMIUM}`}>
              <p className={`text-3xl font-black text-[#4F46E5] ${H}`}>{big}</p>
              <p className="mt-1 text-sm font-bold text-[#64748B]">{small}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Who it's for */}
      <section className="max-w-3xl mx-auto px-8 pb-24 text-center space-y-8">
        <h2 className={`text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>
          This is for <span className={`text-[#4F46E5] italic ${SERIF}`}>you</span>{" "}
          if&hellip;
        </h2>
        <ul className="space-y-4 text-left">
          {[
            "You want to grow as a preacher, not just get through Sunday.",
            "You'll show up to the kickoff video call and the 1:1 call at the end.",
            "You'll set aside about 15 minutes a day for a week and do the work.",
            "You're working on a sermon right now, or ready to start one.",
          ].map((line) => (
            <li key={line} className="flex items-start gap-4 text-lg font-medium text-[#0F172A]">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white [color:#fff]">
                <Icon d="M20 6L9 17l-5-5" size={16} strokeWidth={3} />
              </span>
              {line}
            </li>
          ))}
        </ul>
        <p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-[#64748B]">
          <span className="font-black text-[#0F172A]">Free doesn&apos;t mean casual.</span>{" "}
          It only works if you do. If you&apos;re not ready to commit for the week, this one isn&apos;t for you yet.
        </p>
      </section>

      {/* What's included */}
      <section className="bg-[#F8FAFC] py-32 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 space-y-16">
          <div className="text-center space-y-5">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>What you get</h2>
            <p className={`text-2xl md:text-3xl font-bold text-[#0F172A] leading-snug ${H}`}>
              All of it is{" "}
              <span className="ml-1 inline-block rounded-full bg-emerald-500 px-5 py-1.5 align-middle text-base font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-200 md:text-lg [color:#fff]">FREE</span>
            </p>
            <p className="text-[#64748B] font-medium">No card required.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {INCLUDED.map((item) => (
              <div key={item.title} className={`bg-white rounded-[2.5rem] border border-gray-200 p-10 space-y-6 ${SHADOW_PREMIUM}`}>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                    <Icon d={item.icon} size={22} strokeWidth={2} />
                  </span>
                  <span className={FREE_PILL}>FREE</span>
                </div>
                <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Testimonial: sits right above the join button */}
          <div className="text-center space-y-8 pt-8">
            <p className={`text-xl md:text-2xl font-medium leading-relaxed text-[#0F172A] italic max-w-3xl mx-auto ${SERIF}`}>
              &quot;{BRENT_GARRARD.quote}&quot;
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                <Image src="/images/testimonials/brent-garrard.jpg" alt={BRENT_GARRARD.name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-black text-[#0F172A] uppercase tracking-widest">{BRENT_GARRARD.name}</p>
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{BRENT_GARRARD.role}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => openSignup("what_you_get")}
              className="inline-flex items-center gap-3 bg-[#4F46E5] text-white px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest [color:#fff]"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 max-w-4xl mx-auto px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className={`text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>
            About 15 minutes a day, for{" "}
            <span className={`text-[#4F46E5] italic ${SERIF}`}>7 days.</span>
          </h2>
          <p className="text-[#64748B] font-medium">
            Runs Tuesday, November 10 through Thursday, November 19.{" "}
            <span className="text-sm text-[#94A3B8]">(two days are included for rest)</span>
          </p>
        </div>
        <ol className="space-y-6">
          {STEPS.map((step) => (
            <li key={step.n} className={`flex items-start gap-6 rounded-[2rem] border border-gray-200 bg-white p-8 ${SHADOW_PREMIUM}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xl font-black text-white [color:#fff] ${H}`}>{step.n}</span>
              <div className="space-y-1">
                <h3 className={`text-xl font-black text-[#0F172A] ${H}`}>{step.title}</h3>
                <p className="text-[#64748B] text-sm font-medium leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Who's leading it */}
      <section className="py-32 bg-[#F8FAFC] border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          <div className={`relative w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 bg-gray-200 ${SHADOW_PREMIUM}`}>
            <Image src="/images/founder/founder-sweater.jpg" alt="Bryson Breakey" fill sizes="192px" className="object-cover object-[50%_15%]" />
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className={`text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>Led by Bryson Breakey</h2>
            <p className="text-[#64748B] font-medium leading-relaxed italic">
              Bryson Breakey is a pastor and preaching coach, and the founder of PreachingHub. He built PreachingHub to give every preacher the honest, specific feedback that most never get.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 max-w-4xl mx-auto px-8 space-y-12">
        <h2 className={`text-3xl font-black text-center text-[#0F172A] uppercase tracking-widest ${H}`}>Questions</h2>
        <div className="space-y-1">
          {FAQ.map(([q, a]) => (
            <div key={q} className="py-6 border-b border-gray-100">
              <h4 className="font-bold text-[#0F172A] mb-2">{q}</h4>
              <p className="text-[#64748B] text-sm font-medium">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="bg-[#0F172A] text-white py-32 px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <h2 className={`text-4xl md:text-6xl font-black tracking-tight leading-tight [color:#fff] ${H}`}>
            Grow as a preacher in 7 days.
          </h2>
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => openSignup("final_cta")}
              className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-8 sm:px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest"
            >
              {ctaLabel}
            </button>
            <p className="text-xs font-bold text-white/50">
              {phase === "before" && "Free • No card required • Starts Tuesday, November 10 • Sign up now to get the pre-challenge homework"}
              {phase === "started" && "Free • No card required • Enrollment closes tonight at midnight CST"}
              {phase === "closed" && "Enrollment is closed • Join the waitlist and we'll let you know about the next one"}
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#4F46E5]/10 to-transparent pointer-events-none" aria-hidden="true" />
      </footer>
    </main>
  );
}
