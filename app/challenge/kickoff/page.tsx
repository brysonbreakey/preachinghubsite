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
        <p className="mt-10">
          <Link href="/challenge" className="text-sm font-bold text-slate-400 hover:text-slate-600">Back to the challenge</Link>
        </p>
      </div>
    </main>
  );
}
