import type { Metadata } from "next";
import Link from "next/link";
import { KickoffCalendarButtons } from "@/components/challenge/KickoffCalendarButtons";
import { getKickoffCalendar } from "@/lib/challengeRun";
import { CHALLENGE_KICKOFF } from "@/lib/challenge";

export const metadata: Metadata = {
  title: { absolute: "Add the kickoff call to your calendar | PreachingHub" },
  robots: { index: false },
};

// One permanent address for every cohort ("add the kickoff call to your calendar"): link it from
// emails and texts. It is built from the cohort's kickoff time and call link, so it follows each
// new cohort by itself.
export const dynamic = "force-dynamic";

export default async function Page() {
  const calendar = await getKickoffCalendar();
  const isoStart = new Date(CHALLENGE_KICKOFF).toISOString();
  return (
    <main className="min-h-screen bg-white font-[family-name:var(--font-inter)] text-[#0F172A] antialiased">
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#4F46E5]">7-Day Preaching Growth Challenge</p>
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight">Add the kickoff call to your calendar</h1>
        <p className="mb-1 text-lg font-bold">{calendar.whenLabel}</p>
        <p className="mb-8 text-sm font-medium text-slate-500">
          Online, on Google Meet. Your calendar shows it in your own time zone.
          <time dateTime={isoStart} className="sr-only">{isoStart}</time>
        </p>
        <KickoffCalendarButtons calendar={calendar} source="kickoff_page" />
        <p className="mt-8 text-sm font-medium text-slate-500">
          Or join with this link when it&apos;s time:{" "}
          <a href={calendar.meetUrl} className="break-all font-bold text-[#4F46E5] underline underline-offset-2">{calendar.meetUrl.replace(/^https:\/\//, "")}</a>
        </p>
        {/* 1:1 booking CTA */}
        <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 px-6 py-7 text-left">
          <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[#4F46E5]">Free for challenge participants</p>
          <p className="mb-2 text-lg font-extrabold tracking-tight text-[#0F172A]">Book your 1:1 growth strategy session in advance</p>
          <p className="mb-5 text-sm text-slate-600 leading-relaxed">
            Finish all 7 days and you&apos;ll earn a free 20-minute coaching call with Bryson.
            Book it now so the time is held — you&apos;ll meet after Day 7.
          </p>
          <a
            href="https://calendar.app.google/ag6KNHudWi7ZrMr16"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#4F46E5] px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-[#4338CA] transition-colors"
          >
            Book your session
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>

        <p className="mt-8">
          <Link href="/challenge" className="text-sm font-bold text-slate-400 hover:text-slate-600">Back to the challenge</Link>
        </p>
      </div>
    </main>
  );
}
