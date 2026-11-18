"use client";

import posthog from "posthog-js";
import type { KickoffCalendar } from "@/lib/challengeRun";

const BUTTON =
  "flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-colors hover:border-[#4F46E5] hover:bg-indigo-50";

// "Add the kickoff call to your calendar": Google, Outlook, and Apple/other (the .ics file).
export function KickoffCalendarButtons({ calendar, source }: { calendar: Pick<KickoffCalendar, "googleUrl" | "outlookUrl" | "icsUrl">; source: string }) {
  const track = (provider: string) => posthog.capture("challenge_calendar_clicked", { provider, source });
  return (
    <div className="space-y-2">
      <a href={calendar.googleUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("google")} className={BUTTON}>
        Google Calendar
      </a>
      <a href={calendar.icsUrl} onClick={() => track("apple_ics")} className={BUTTON}>
        Apple Calendar / other (.ics file)
      </a>
      <a href={calendar.outlookUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("outlook")} className={BUTTON}>
        Outlook
      </a>
    </div>
  );
}
