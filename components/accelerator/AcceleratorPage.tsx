"use client";

import { useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { Icon } from "@/components/Icon";
import { BRENT_GARRARD } from "@/lib/testimonials";
import type { Cohort } from "@/lib/cohort";
import { AcceleratorSignupModal } from "./AcceleratorSignupModal";

const H = "font-[family-name:var(--font-inter)] tracking-[-0.04em]";
const SERIF = "font-[family-name:var(--font-lora)]";
const SHADOW_PREMIUM = "shadow-[0_10px_40px_-10px_rgba(15,23,42,0.05),0_2px_10px_-2px_rgba(15,23,42,0.02)]";
const SHADOW_ELEVATED = "shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)]";

// Paste the walkthrough video's embed URL here to replace the sample report in the hero.
const WALKTHROUGH_VIDEO_EMBED_URL = "";

type Intent = "accelerator" | "trial";

// A quick, eased scroll (about 0.45s) to a section, instead of the browser's slower default.
function fastScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.getBoundingClientRect().top + window.scrollY - 24;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, target);
    return;
  }
  const from = window.scrollY;
  const distance = target - from;
  const duration = 450;
  const start = performance.now();
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function step(now: number) {
    const t = Math.min((now - start) / duration, 1);
    window.scrollTo(0, from + distance * ease(t));
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

export function AcceleratorPage({ cohort, spotsLeft }: { cohort: Cohort; spotsLeft: number | null }) {
  const [modal, setModal] = useState<Intent | null>(null);

  function openSignup(location: string, intent: Intent = "accelerator") {
    posthog.capture("accelerator_cta_clicked", { location, intent });
    setModal(intent);
  }

  // Never a made-up number: with no real count available the page just says "Limited spots".
  const spotsText = spotsLeft === null ? "Limited coaching slots" : spotsLeft === 0 ? "This round is full" : spotsLeft === 1 ? "1 coaching slot left" : `${spotsLeft} coaching slots left`;
  const spots = <span className="text-rose-500">{spotsText}</span>;
  // "6 COACHING SLOTS LEFT THIS ROUND • ROUND CLOSES SUNDAY, NOVEMBER 1"
  // (When the round is full the page will need its own version; see the spec.)
  const cohortLine = (
    <>
      {spots}
      {spotsLeft === 0 || spotsLeft === null ? "" : " this round"} • round closes {cohort.closesToday ? "today" : cohort.closesOn}
    </>
  );

  return (
    <main className="font-[family-name:var(--font-jakarta)] bg-white text-[#0F172A] overflow-x-hidden antialiased">
      <style>{`@keyframes acc-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .acc-fade-in { animation: acc-fade-in 0.8s ease-out; }`}</style>
      {modal && <AcceleratorSignupModal intent={modal} onClose={() => setModal(null)} />}

      {/* Top banner: kept exactly as it is on the current /checklist/thank-you page */}
      <div className="bg-blue-50 border-b border-blue-100 py-3 px-6 text-center">
        <p className="text-sm sm:text-base text-blue-900">
          🎉 Your checklist is on its way — check your inbox (and spam folder) in a few minutes.
        </p>
        {/* Opens in a new tab so this page (and the offer below) stays open behind it. */}
        <a
          href="/downloads/pre-preaching-checklist.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => posthog.capture("checklist_pdf_opened", { page: "checklist_thank_you", variant: "accelerator" })}
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

      {/* Navigation: logo only, so nothing pulls attention from the offer */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex justify-center items-center border-b border-gray-50">
        <Image src="/logos/wordmark-indigo.svg" alt="PreachingHub" width={498} height={77} unoptimized priority className="h-8 w-auto" />
      </nav>

      {/* Hero */}
      <header className="acc-fade-in max-w-5xl mx-auto px-8 pt-8 md:pt-10 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#4F46E5] text-[10px] font-black uppercase tracking-[0.2em] mb-8">
          Before you go: A limited coaching offer
        </div>
        <h1 className={`text-5xl md:text-7xl font-black leading-[1.05] mb-8 text-[#0F172A] tracking-tight ${H}`}>
          Better preaching in 30 days, or{" "}
          <span className={`text-[#4F46E5] italic ${SERIF}`}>your money back.</span>
        </h1>
        <p className="text-xl text-[#64748B] mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
          PreachingHub is your sermon prep space with a preaching coach built in. Get honest, expert feedback before you preach and after, and a personal plan to grow.
        </p>

        {/* Hero visual: the walkthrough video once WALKTHROUGH_VIDEO_EMBED_URL is set, a sample coaching report until then */}
        <div className="max-w-4xl mx-auto mb-12">
          {WALKTHROUGH_VIDEO_EMBED_URL ? (
            <div className={`relative aspect-video overflow-hidden rounded-3xl border border-gray-100 bg-[#020617] ${SHADOW_ELEVATED}`}>
              <iframe
                src={WALKTHROUGH_VIDEO_EMBED_URL}
                title="See PreachingHub in 2 minutes"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          ) : (
            <figure>
              <div className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-[#F8FAFC] text-left ${SHADOW_ELEVATED}`}>
                <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-200" />
                  <span className="mx-auto rounded-md bg-gray-100 px-4 py-1 text-[11px] font-medium text-[#64748B]">app.preachinghub.com</span>
                  <span className="w-[42px]" />
                </div>
                <div className="relative max-h-[420px] overflow-hidden sm:max-h-[700px]">
                  <Image
                    src="/images/sample-coaching-report.jpg"
                    alt="A PreachingHub coaching report: an overall summary, strengths and growth areas across the sermon, and the biggest wins"
                    width={1800}
                    height={2293}
                    sizes="(min-width: 896px) 896px, 100vw"
                    priority
                    className="h-auto w-full"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
                </div>
              </div>
              <figcaption className="mt-4 text-xs font-bold uppercase tracking-widest text-[#64748B]">
                A sample PreachingHub coaching report
              </figcaption>
            </figure>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <a
            href="#enroll"
            onClick={(e) => {
              e.preventDefault();
              posthog.capture("accelerator_cta_clicked", { location: "hero_see_offer", intent: "scroll" });
              fastScrollTo("accelerator");
            }}
            className="inline-flex items-center gap-3 bg-[#4F46E5] text-white px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest [color:#fff]"
          >
            See the offer
          </a>
          <div className="space-y-1.5">
            <p className="text-sm sm:text-base font-black text-gray-500 uppercase tracking-widest">
              {cohortLine}
            </p>
            <p className="text-sm sm:text-base font-medium text-[#64748B]">Account access today, coaching the week of {cohort.startsOn}</p>
          </div>
        </div>
      </header>

      {/* Bonus Accelerator */}
      <section className="bg-[#F8FAFC] py-32 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 space-y-16">
          <div id="accelerator" className="text-center space-y-5 scroll-mt-6">
            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.05] ${H}`}>The 30-Day Preaching Growth Accelerator</h2>
            <p className={`text-xl md:text-2xl font-bold text-[#4F46E5] leading-snug ${H}`}>Join and get $350 of personal coaching, free.</p>
            <p className="text-[#64748B] font-medium">Every new member gets these two bonuses with their PreachingHub membership.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bonus card 1 */}
            <div className={`bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden group ${SHADOW_PREMIUM}`}>
              <div className="relative h-80 bg-[#0F172A] overflow-hidden">
                {/* Slightly zoomed in for a tighter shot, anchored at the top so his head stays in frame. */}
                <Image
                  src="/images/founder/founder-blazer.jpg"
                  alt="Bryson"
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover object-[45%_0%] scale-[1.28] origin-[45%_0%] group-hover:scale-[1.34] transition-transform duration-700"
                />
              </div>
              <div className="p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-5 py-2 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-200 [color:#fff]">FREE BONUS</span>
                  <span className="text-[10px] font-bold text-[#64748B] line-through">$225 value</span>
                </div>
                <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>A 1:1 coaching session</h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">We sit down together, look at your preaching, celebrate what&apos;s working, and choose the one area that will make the biggest difference. You leave with a clear focus and a coach in your corner.</p>
              </div>
            </div>

            {/* Bonus card 2 */}
            <div className={`bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden ${SHADOW_PREMIUM}`}>
              <div className="h-80 bg-[#020617] p-10 flex flex-col justify-center">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Your Growth Plan</p>
                  <div className="space-y-2">
                    {["Week 1", "Week 2", "Week 3", "Week 4"].map((w) => (
                      <div key={w} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="text-xs text-white font-medium [color:#fff]">{w}</span>
                        <span className="text-[10px] text-white/50 uppercase">4 lessons + video</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-5 py-2 bg-emerald-500 text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-200 [color:#fff]">FREE BONUS</span>
                  <span className="text-[10px] font-bold text-[#64748B] line-through">$125 value</span>
                </div>
                <h3 className={`text-2xl font-black text-[#0F172A] leading-tight ${H}`}>Personalized 30-Day Growth Sprint Plan</h3>
                <p className="text-[#64748B] text-sm leading-relaxed font-medium">Built around your biggest growth area. Short lessons Monday through Thursday, a video from Bryson each week, all using the sermon you&apos;re already preparing.</p>
              </div>
            </div>
          </div>

          {/* Testimonial: sits right above the offer card */}
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
        </div>
      </section>

      {/* Pricing summary */}
      <section id="enroll" className="max-w-5xl mx-auto px-8 -mt-20 relative z-20 scroll-mt-8">
        <div className={`p-1 md:p-1.5 rounded-[3rem] bg-gradient-to-br from-[#4F46E5] to-indigo-400 ${SHADOW_ELEVATED}`}>
          <div className="bg-white rounded-[2.8rem] p-8 sm:p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 flex-1 w-full">
              <ul className="space-y-4">
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#64748B] font-medium">1:1 coaching session</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-300 line-through font-bold text-xs">$225</span>
                    <span className="px-4 py-1.5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-emerald-100 [color:#fff]">FREE</span>
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#64748B] font-medium">Personalized 30-Day Growth Sprint Plan</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-gray-300 line-through font-bold text-xs">$125</span>
                    <span className="px-4 py-1.5 bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full shadow-md shadow-emerald-100 [color:#fff]">FREE</span>
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
                  <span className="text-[#0F172A] font-bold">PreachingHub membership: <span className="text-[#64748B] font-normal text-xs ml-2 italic">Instant Coaching before and after every sermon</span></span>
                  <span className="text-[#0F172A] font-black shrink-0">$49/mo</span>
                </li>
              </ul>
              <p className="text-[10px] text-[#64748B] leading-relaxed italic">A single coaching session runs $225. You get one, plus a growth plan, plus coaching on every sermon, for $49/month.</p>
              <p className="border-l-2 border-[#4F46E5] pl-4 text-sm font-semibold leading-relaxed text-[#0F172A]">I personally coach 6 pastors every two weeks. That&apos;s all my calendar allows.</p>
            </div>
            <div className="w-full lg:w-72 flex flex-col items-center gap-6">
              <div className="text-center">
                <p className={`text-5xl font-black text-[#0F172A] ${H}`}>$49<span className="text-lg text-[#64748B] font-bold">/mo</span></p>
                <p className="text-sm font-bold text-[#64748B] mt-3">{cohortLine}</p>
                <p className="text-xs font-medium text-[#64748B] mt-1">Account access today, coaching the week of {cohort.startsOn}</p>
              </div>
              <button
                type="button"
                onClick={() => openSignup("pricing_block")}
                className="w-full py-5 rounded-2xl bg-[#4F46E5] text-white font-black text-sm uppercase tracking-widest text-center hover:bg-indigo-600 transition-all shadow-[0_10px_40px_-10px_rgba(15,23,42,0.05)] [color:#fff]"
              >
                Claim my slot
              </button>
              <p className="text-sm font-bold text-gray-500 text-center">Money-back guarantee • Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="max-w-3xl mx-auto px-8 pt-24 pb-32">
        <div className="p-8 sm:p-12 md:p-16 rounded-[2.5rem] border border-gray-200 bg-white space-y-6 relative text-center">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-[#4F46E5] mx-auto">
            <Icon d={["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"]} size={20} strokeWidth={2} />
          </div>
          <h2 className={`text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>Better preaching, or your money back</h2>
          <p className="text-lg text-[#64748B] font-medium leading-relaxed">
            Test PreachingHub for 30 days. If you don&apos;t walk into the pulpit with more confidence and less stress, email me and I&apos;ll refund every penny, even if we&apos;ve already had our coaching session.
            <br /><br />
            No hoops, no hard feelings.
          </p>
          <p className={`text-[#0F172A] italic text-xl ${SERIF}`}>— Bryson</p>
        </div>
      </section>

      {/* The truth */}
      <section className="bg-[#0F172A] text-white py-32 overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-8 relative z-10 text-center space-y-16">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">The Preacher&apos;s Plateau</p>
            <h2 className={`text-4xl md:text-6xl font-black tracking-tight leading-none text-left md:text-center [color:#fff] ${H}`}>Nobody tells you the truth on Sunday. PreachingHub does.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-8">
              <p className="text-2xl font-medium leading-relaxed text-indigo-100">
                &quot;Good word, Pastor&quot; is kind, but it won&apos;t help you grow. Here&apos;s how PreachingHub fits your week:
              </p>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
                <div className="flex items-center gap-4 text-emerald-400">
                  <Icon d={["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"]} size={18} strokeWidth={2} />
                  <span className="text-[10px] font-black uppercase tracking-widest">The Truth</span>
                </div>
                <p className={`text-xl font-bold leading-tight [color:#fff] ${H}`}>PreachingHub gives you the one thing &quot;Good word&quot; can&apos;t: Specific coaching before you preach and after.</p>
              </div>
            </div>
            <div className="space-y-8">
              <p className="text-lg text-indigo-100/60 leading-relaxed italic">
                &quot;We never write your sermon. Your sermon, your voice, our coaching.&quot;
              </p>
              <p className="text-lg text-indigo-100/60 leading-relaxed">
                Most pastors stop improving not because they lack calling, but because they lack honest, specific, weekly feedback. You&apos;re left guessing if you were clear, if your application hit home, or if you just filled 30 minutes.
              </p>
            </div>
          </div>
        </div>
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs><pattern id="acc-grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
            <rect width="100" height="100" fill="url(#acc-grid)" />
          </svg>
        </div>
      </section>

      {/* Core membership features */}
      <section className="py-32 max-w-7xl mx-auto px-8">
        <div className="text-center mb-20 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4F46E5]">PreachingHub Core Membership</p>
          <h2 className={`text-4xl md:text-5xl font-black text-[#0F172A] tracking-tight leading-tight ${H}`}>The expert coaching built into your sermon prep</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            ["Honest Sermon Evaluation", "Upload your manuscript, notes or recording and get a coaching report across eight areas, from faithfulness to the text to your conclusion. Specific strengths, and specific places to grow."],
            ["Pre-Preaching Confidence Check", "Get feedback on your notes or a rehearsal before you preach, while there's still time to fix what isn't working. No more finding out on Monday."],
            ["Delivery Coaching", "See what your congregation sees. Feedback on your pacing, energy and presence from your sermon video."],
            ["Coaching, not rewrites", "Every piece of feedback comes with a coaching question that helps you fix it yourself. Your sermon stays yours, in your voice."],
            ["A second set of eyes", "Send any sermon to your coach or your preaching team for their input, all in one place."],
          ].map(([title, body]) => (
            <div key={title} className={`p-10 rounded-3xl bg-white border border-gray-100 space-y-6 ${SHADOW_PREMIUM}`}>
              <h3 className={`text-xl font-bold text-[#0F172A] ${H}`}>{title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed font-medium">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why I built this */}
      <section className="py-32 bg-[#F8FAFC] border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-8 flex flex-col md:flex-row items-center gap-12">
          <div className={`relative w-48 h-48 rounded-[2rem] overflow-hidden shrink-0 bg-gray-200 ${SHADOW_PREMIUM}`}>
            <Image src="/images/founder/founder-sweater.jpg" alt="Bryson" fill sizes="192px" className="object-cover object-[50%_15%]" />
          </div>
          <div className="space-y-6 text-center md:text-left">
            <h2 className={`text-3xl font-black text-[#0F172A] tracking-tight ${H}`}>Why I built this</h2>
            <div className="text-[#64748B] font-medium leading-relaxed space-y-4 italic">
              <p>I&apos;m Bryson, a pastor and preaching coach. For years I&apos;ve watched faithful preachers plateau, not because they lacked calling or skill, but because nobody was giving them honest, specific feedback week after week. PreachingHub is the coaching I wish every preacher had.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 max-w-4xl mx-auto px-8 space-y-12">
        <h2 className={`text-3xl font-black text-center text-[#0F172A] uppercase tracking-widest ${H}`}>Questions</h2>
        <div className="space-y-1">
          {[
            ["Will it write my sermon?", "No. We provide the coaching and feedback to help you improve your own work."],
            ["Do I have to change how I prepare?", "No. PreachingHub fits into your existing process, providing feedback at the stages you already have."],
            ["What happens after 30 days?", "Your membership continues at the monthly rate, and you keep getting expert coaching on every sermon you preach."],
            ["Is it hard to use?", "If you can upload a file or record a voice memo, you can use PreachingHub. It's designed to be simple and intuitive for busy pastors."],
          ].map(([q, a]) => (
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
            Thirty days from now, you&apos;ll walk into Sunday confident you have a great sermon.
          </h2>
          <div className="flex flex-col items-center gap-6">
            <button
              type="button"
              onClick={() => openSignup("final_cta")}
              className="inline-flex items-center gap-3 bg-white text-[#0F172A] px-8 sm:px-12 py-5 rounded-full font-black text-sm shadow-[0_20px_50px_-12px_rgba(79,70,229,0.1)] hover:-translate-y-1 transition-all uppercase tracking-widest"
            >
              Claim my slot
            </button>
            <p className="text-xs font-bold text-white/50">
              $49/month • Free 1:1 session + growth plan • {spotsText}
            </p>
            <button
              type="button"
              onClick={() => openSignup("no_thanks_trial", "trial")}
              className="text-xs text-white/70 underline underline-offset-4 hover:text-white transition-colors uppercase tracking-widest font-black"
            >
              No thanks, I&apos;ll start with the free 7-day trial
            </button>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#4F46E5]/10 to-transparent pointer-events-none" aria-hidden="true" />
      </footer>
    </main>
  );
}
