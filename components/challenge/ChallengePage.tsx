"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { Icon } from "@/components/Icon";
import { PHMark } from "@/components/Logo";
import { BRENT_GARRARD } from "@/lib/testimonials";
import { CHALLENGE_PASS_END_LABEL, challengePhase, formatCountdown } from "@/lib/challenge";
import { ChallengeSignupModal } from "./ChallengeSignupModal";

// The 7-Day Preaching Growth Challenge landing page (cohort 2: November 17-23, 2026, free, no card required).
// Same look as the 30-Day Preaching Growth Accelerator page (components/accelerator/AcceleratorPage.tsx).
// The signup is a popup that adds people to Kit with the 7-day-challenge tag and offers an account
// right away. The $7 paid version of this page (Stripe checkout) is kept at the git tag
// `challenge-cohort2-page`; the original free cohort-1 page at `challenge-cohort1-page`. Dates are
// written out below, so this page needs retiring or updating after the challenge.

const H = "font-[family-name:var(--font-inter)] tracking-[-0.04em]";
const SERIF = "font-[family-name:var(--font-lora)]";
const SHADOW_PREMIUM = "shadow-[0_10px_40px_-10px_rgba(15,23,42,0.05),0_2px_10px_-2px_rgba(15,23,42,0.02)]";
const FREE_PILL = "px-4 py-1.5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-emerald-100 [color:#fff]";
const IMMEDIATE_PILL = "px-4 py-1.5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-emerald-100 [color:#fff]";
const BONUS_PILL = "px-4 py-1.5 bg-[#4F46E5] text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-indigo-100 [color:#fff]";

const TRACKS = [
  {
    icon: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
    label: "Clarity",
    title: "Make Your Message Easier to Follow.",
    body: "You have good ideas, but they don't always connect. Learn to sharpen your main points, strengthen your sermon structure, and create a clearer flow from beginning to end.",
  },
  {
    icon: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
    label: "Content",
    title: "Go Deeper. Preach Stronger.",
    body: "You want to get more out of your study and preparation. Develop better Bible study habits, strengthen your sermon content, and communicate biblical truth with greater depth.",
  },
  {
    icon: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z",
    label: "Creativity",
    title: "Make Your Message More Memorable.",
    body: "You want your sermons to connect and stick. Strengthen your introductions, storytelling, and illustrations to help people engage with and remember what you're preaching.",
  },
];

type Included = { icon: string | string[] | null; pill?: string; title: string; body: string };
const INCLUDED: Included[] = [
  {
    icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"],
    title: "7 Days of Personalized Training",
    body: "Follow short, practical lessons and exercises designed around your chosen growth track: Clarity, Content, or Creativity.",
  },
  {
    icon: null, // the PreachingHub logo mark is drawn instead (see the card below)
    pill: "Immediately",
    title: "Complimentary PreachingHub Access",
    body: `Get access to PreachingHub's sermon preparation, rehearsal, and AI-powered feedback tools throughout the challenge and for a limited time afterward.`,
  },
  {
    icon: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 6v6l4 2",
    title: "Just 15 Minutes a Day",
    body: "No lengthy courses or overwhelming assignments. Make progress through focused daily exercises you can apply to your actual sermons.",
  },
  {
    icon: ["M23 7l-7 5 7 5V7z", "M3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"],
    title: "Live Kickoff + Replay",
    body: "Start with a live online video call where you'll identify your growth focus, understand the challenge, and prepare for the week ahead. Can't attend live? Watch the replay.",
  },
  {
    icon: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8"],
    title: "Worksheets + Personalized 30-Day Growth Plan",
    body: "Use practical resources to apply what you're learning and finish the challenge with a clear plan for continuing your development.",
  },
];

const SCHEDULE = [
  { n: "1", date: "November 17", title: "Find Your Focus", body: "Join the live kickoff, assess your preaching, and choose your growth track." },
  { n: "2", date: "November 18", title: "Your First Breakthrough", body: "Complete your first targeted exercise in Clarity, Content, or Creativity." },
  { n: "3", date: "November 19", title: "Edit for Impact", body: "Learn to identify what strengthens your sermon and what might be getting in the way." },
  { n: "4", date: "November 20", title: "Prepare to Preach", body: "Develop practical pre-preaching habits that help you approach the pulpit with greater confidence." },
  { n: "5", date: "November 21", title: "Build on Your Progress", body: "Take the next step in your personalized growth track." },
  { n: "6", date: "November 22", title: "Put It Into Practice", body: "Apply what you've learned to a real sermon and reflect on your progress." },
  { n: "7", date: "November 23", title: "Build Your 30-Day Growth Plan", body: "Create a practical roadmap for continued improvement and submit it to unlock your personal strategy session." },
];

const FAQ = [
  ["How much does the challenge cost?", "Nothing. The entire 7-Day Preaching Growth Challenge is free, and no card is required."],
  ["How much time will I need?", "Plan for approximately 15 minutes a day for the exercises and training, plus the live kickoff session. The kickoff replay will be available if you can't attend."],
  ["What if I can't attend the live kickoff?", "No problem! You'll have access to the replay so you can catch up and continue with the challenge."],
  ["Do I need to be an experienced preacher?", "This challenge is designed for people who are actively preaching and genuinely want to improve. Whether you're relatively new or have been preaching for years, you'll choose a growth area that fits your needs."],
  ["What are the three growth tracks?", "You'll choose Clarity, Content, or Creativity based on the area where you most want to improve. Your track determines several of the practical exercises you'll complete throughout the week."],
  ["Is PreachingHub included?", `Yes! Your registration includes complimentary access to PreachingHub during the challenge and through ${CHALLENGE_PASS_END_LABEL}, 2026. No additional subscription is required.`],
  ["How do I get the one-on-one coaching session?", "Complete the seven-day challenge and submit your personalized 30-day growth plan. You'll then receive instructions for scheduling your complimentary 20-minute 1:1 Preaching Growth Strategy Session, subject to availability."],
  ["Will I be charged after the challenge?", "No. The challenge is free and we never ask for a card. You can choose to continue with a paid PreachingHub subscription or coaching program afterward, but nothing is charged or renews automatically as part of your challenge registration."],
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
  const ctaLabel = waitlist ? "Join the waitlist" : "Join the Free Challenge";
  const ctaLabelLower = waitlist ? "Join the waitlist" : "Start Growing for Free";

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
        {/* The countdown pill, back at the very top. */}
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
        {/* The challenge title artwork ("FREE" version). The headline below is the page's h1. */}
        <div className="mb-8">
          <Image
            src="/images/challenge-title.webp"
            alt="Free 7-Day Preaching Growth Challenge"
            width={2000}
            height={770}
            priority
            sizes="(min-width: 640px) 768px, 150vw"
            className="relative left-1/2 h-auto w-[150%] max-w-none -translate-x-1/2 mix-blend-multiply sm:left-auto sm:mx-auto sm:w-full sm:max-w-3xl sm:translate-x-0"
          />
        </div>
        <h1 className={`mx-auto mb-8 max-w-4xl text-balance text-3xl sm:text-4xl md:text-5xl font-black leading-[1.08] text-[#0F172A] ${H}`}>
          Become a More <span className={`text-[#4F46E5] italic ${SERIF}`}>Confident, Clear,</span> and Impactful Preacher in Just 7 Days.
        </h1>
        <div className="mx-auto mb-12 max-w-2xl space-y-5">
          <p className="text-lg md:text-xl text-[#64748B] leading-relaxed font-medium">
            Stop guessing how to improve. Choose the one area of your preaching that needs the most growth, follow a personalized 15-minute-a-day training plan, and start delivering sermons with greater impact.
          </p>
          <p className={`text-xl md:text-2xl font-bold leading-snug text-[#0F172A] ${H}`}>November 17, 2026</p>
          <p className="text-sm sm:text-base font-black text-gray-500 uppercase tracking-widest">
            Live Kickoff Call &bull; Personalized Training &bull; 1-on-1 Coaching Opportunity
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
          <p className="text-xs sm:text-sm font-black text-gray-500 uppercase tracking-widest">
            Free &bull; No card required
          </p>
          <p className="max-w-md text-xs sm:text-sm font-medium leading-relaxed text-[#64748B]">
            {phase === "before" && <span className="font-bold text-red-600">Sign up now to receive the pre-challenge homework.</span>}
            {phase === "started" && <span className="font-bold text-red-600">Enrollment closes tonight at 11:59 PM CST.</span>}
            {phase === "closed" && "Enrollment for this challenge is closed. Join the waitlist and we'll let you know about the next one."}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            ["15 min", "a day, for 7 days"],
            ["Nov 17 – 23", "100% online, Tuesday to Monday"],
            ["FREE", "No card required"],
          ].map(([big, small]) => (
            <div key={big} className={`rounded-2xl border border-gray-100 bg-white px-6 py-6 ${SHADOW_PREMIUM}`}>
              <p className={`text-3xl font-black ${big === "FREE" ? "text-emerald-500" : "text-[#4F46E5]"} ${H}`}>{big}</p>
              <p className="mt-1 text-sm font-bold text-[#64748B]">{small}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Choose your growth track */}
      <section className="bg-[#F8FAFC] py-28 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 space-y-14">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <h2 className={`text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>
              One Challenge. <span className={`text-[#4F46E5] italic ${SERIF}`}>Three Paths</span> to Better Preaching.
            </h2>
            <p className="text-lg text-[#64748B] font-medium leading-relaxed">
              You don&apos;t need to improve everything at once. Choose the area where you want to grow most, and we&apos;ll guide you through practical exercises designed to help you make real progress.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRACKS.map((track) => (
              <div key={track.label} className={`bg-white rounded-[2.5rem] border border-gray-200 p-10 space-y-5 ${SHADOW_PREMIUM}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                  <Icon d={track.icon} size={22} strokeWidth={2} />
                </span>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#4F46E5]">{track.label}</p>
                <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>{track.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">{track.body}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-base font-bold text-[#0F172A]">
            Whichever track you choose, you&apos;ll receive practical training designed to help you grow in that specific area.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section className="max-w-3xl mx-auto px-8 py-24 text-center space-y-8">
        <h2 className={`text-2xl md:text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>
          This is for <span className={`text-[#4F46E5] italic ${SERIF}`}>you</span>{" "}
          if&hellip;
        </h2>
        <ul className="space-y-4 text-left">
          {[
            "You're actively preaching and want to grow, not just get through Sunday.",
            "You'll show up to the kickoff (or watch the replay) and finish the 7 days.",
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
          It only works if you do. If you&apos;re not ready to commit for the week, this one isn&apos;t for you yet.
        </p>
      </section>

      {/* What's included */}
      <section className="bg-[#F8FAFC] py-32 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 space-y-16">
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>
              Everything You Need to Start Preaching Better.
            </h2>
            <p className="text-lg text-[#64748B] font-medium leading-relaxed">
              A practical, personalized growth experience designed to help you make meaningful progress without adding hours to your already busy schedule.
            </p>
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
                    {item.icon ? <Icon d={item.icon} size={22} strokeWidth={2} /> : <PHMark size={22} color="#4F46E5" />}
                  </span>
                  <span className="flex items-center gap-2">
                    {item.pill && <span className={IMMEDIATE_PILL}>{item.pill}</span>}
                    <span className={FREE_PILL}>Free</span>
                  </span>
                </div>
                <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>{item.title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">{item.body}</p>
              </div>
            ))}
            {/* The earned bonus: set apart from the included items. */}
            <div className={`bg-indigo-50/60 rounded-[2.5rem] border-2 border-[#4F46E5]/30 p-10 space-y-6 ${SHADOW_PREMIUM}`}>
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#4F46E5]">
                  <Icon d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={22} strokeWidth={2} />
                </span>
                <span className={BONUS_PILL}>Bonus</span>
              </div>
              <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>1:1 Preaching Growth Strategy Session</h3>
              <p className="text-[#0F172A] text-sm leading-relaxed font-medium">
                Complete all seven days and submit your 30-day growth plan to unlock a complimentary 20-minute one-on-one session. We&apos;ll review your progress, identify your biggest growth opportunities, and discuss the next steps available to help you continue improving.
              </p>
              <p className="text-[#64748B] text-xs leading-relaxed font-medium">
                This session is earned through challenge completion and is not automatically included upon purchase. Scheduling is subject to availability.
              </p>
            </div>
          </div>

          {/* PreachingHub access: the dates, spelled out. Looks different from the cards above on purpose. */}
          <div className="max-w-4xl mx-auto rounded-[2.5rem] border border-emerald-200 bg-emerald-50/70 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1 space-y-3 text-center md:text-left">
                <h3 className={`text-2xl font-black text-[#0F172A] ${H}`}>Complimentary PreachingHub Access Included</h3>
                <p className="text-[#475569] text-base leading-relaxed font-medium">
                  Experience AI-powered sermon coaching and practical tools throughout the challenge, plus an extra week to put what you&apos;ve learned into practice.
                </p>
              </div>
              <ol className="md:w-72 shrink-0 space-y-3 text-left">
                {[
                  ["Today", "Access starts right after you join"],
                  ["Nov 17 – 23", "Full challenge access"],
                  [`Nov 24 – 29`, "Extra week to keep practicing"],
                ].map(([when, what]) => (
                  <li key={when} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 border border-emerald-100">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span className="text-sm font-medium text-[#475569]"><span className="font-black text-[#0F172A]">{when}</span> &middot; {what}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-6 text-center text-xs font-medium text-[#64748B]">
              Access ends after {CHALLENGE_PASS_END_LABEL} and you won&apos;t be charged. Subscribe only if you want to keep going.
            </p>
          </div>

          {/* Testimonial: sits right above the join button */}
          <div className="text-center space-y-8 pt-8">
            <h3 className={`text-sm font-black uppercase tracking-[0.25em] text-[#4F46E5]`}>Real Preachers. Real Growth.</h3>
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

          {/* Pricing summary */}
          <div className={`max-w-xl mx-auto bg-white rounded-[2.5rem] border-2 border-[#4F46E5] p-10 text-center space-y-4 ${SHADOW_PREMIUM}`}>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#4F46E5]">7-Day Preaching Growth Challenge</p>
            <p className={`text-5xl font-black text-[#0F172A] ${H}`}>$0 <span className="text-base font-bold text-[#64748B] tracking-normal">No Card Required</span></p>
            <p className="text-[#64748B] text-sm leading-relaxed font-medium">
              Seven days of personalized training, practical tools, and an opportunity to earn a one-on-one coaching session.
            </p>
            <p className="flex items-center justify-center gap-2 text-sm font-black text-emerald-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white [color:#fff]">
                <Icon d="M20 6L9 17l-5-5" size={12} strokeWidth={3} />
              </span>
              Immediate access to the PreachingHub platform
            </p>
            <button
              type="button"
              onClick={() => openSignup("pricing")}
              className="mt-2 inline-flex items-center gap-3 bg-[#4F46E5] text-white px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest [color:#fff]"
            >
              {ctaLabelLower}
            </button>
            <p className="text-xs font-bold text-[#94A3B8]">No card required. Nothing to cancel.</p>
          </div>
        </div>
      </section>

      {/* The schedule */}
      <section className="py-32 max-w-4xl mx-auto px-8 space-y-16">
        <div className="text-center space-y-4">
          <h2 className={`text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>
            These <span className={`text-[#4F46E5] italic ${SERIF}`}>7 Days</span> Could Change How You Preach.
          </h2>
          <p className="text-[#64748B] font-medium leading-relaxed">
            Every day builds on the last. You&apos;ll focus on one area of growth while developing practical habits that can strengthen your preaching long after the challenge ends.
          </p>
          <p className="text-sm text-[#94A3B8] font-medium">
            Seven days, no required rest days. If you fall behind, you can catch up on the exercises.
          </p>
        </div>
        <ol className="space-y-6">
          {SCHEDULE.map((step) => (
            <li key={step.n} className={`flex items-start gap-6 rounded-[2rem] border border-gray-200 bg-white p-8 ${SHADOW_PREMIUM}`}>
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-xl font-black text-white [color:#fff] ${H}`}>{step.n}</span>
              <div className="space-y-1">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]">Day {step.n} &mdash; {step.date}</p>
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
          <div className="space-y-5 text-center md:text-left">
            <h2 className={`text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>Led by Bryson Breakey</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {["Lead Pastor · Nashville, TN", "Preaching Coach", "PreachingHub Founder"].map((tag) => (
                <span key={tag} className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#4F46E5]">{tag}</span>
              ))}
            </div>
            <div className="space-y-4 text-[#64748B] font-medium leading-relaxed">
              <p>
                Bryson Breakey is a lead pastor in Nashville, TN, a preaching coach, and the founder of PreachingHub.
              </p>
              <p>
                For years he has watched faithful preachers plateau, not because they lacked calling or skill, but because nobody was giving them honest, specific feedback week after week. He built PreachingHub to give every preacher the kind of coaching he wishes they all had.
              </p>
              <p>
                He leads this challenge himself: Bryson hosts the live kickoff and is the coach you&apos;ll meet with for your 1:1 Preaching Growth Strategy Session when you complete it.
              </p>
            </div>
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
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <h2 className={`text-4xl md:text-6xl font-black tracking-tight leading-tight [color:#fff] ${H}`}>
            The Next Challenge Begins November 17.
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-white/70">
            Join this cohort for free and take the first step toward more confident, clear, and impactful preaching.
          </p>
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => openSignup("final_cta")}
              className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-8 sm:px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest"
            >
              {ctaLabelLower}
            </button>
            <p className="text-xs font-bold text-white/50">
              {phase === "before" && "Free • No card required • Live kickoff Tuesday, November 17 at 1 PM CST • Enrollment closes 11:59 PM CST on November 17"}
              {phase === "started" && "Free • No card required • Enrollment closes tonight at 11:59 PM CST"}
              {phase === "closed" && "Enrollment is closed • Join the waitlist and we'll let you know about the next one"}
            </p>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#4F46E5]/10 to-transparent pointer-events-none" aria-hidden="true" />
      </footer>
    </main>
  );
}
