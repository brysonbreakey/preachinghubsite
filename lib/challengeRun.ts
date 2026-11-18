import { CHALLENGE_KICKOFF_MINUTES, CHALLENGE_KICKOFF_TITLE } from "@/lib/challenge";
import { buildKickoffIcs, googleCalendarUrl, kickoffWhenLabel, outlookCalendarUrl, type KickoffEvent } from "@/lib/challengeCalendar";
import { getCohort } from "@/lib/challengeCohort";

// The kickoff call as the site shows it: the time, link and note come from the cohort the admin
// Challenge Tracker has set up (lib/challengeCohort.ts), or the built-in defaults, so the page, the
// calendar buttons and the .ics file never break.

export async function getKickoffMeetUrl(): Promise<string> {
  return (await getCohort()).meetUrl;
}

export type KickoffCalendar = {
  whenLabel: string;
  meetUrl: string;
  googleUrl: string;
  outlookUrl: string;
  /** Permanent address of the calendar file (generated, never edited by hand). */
  icsUrl: string;
};

export async function getKickoffEvent(): Promise<KickoffEvent> {
  const cohort = await getCohort();
  return {
    start: cohort.kickoff,
    minutes: CHALLENGE_KICKOFF_MINUTES,
    title: CHALLENGE_KICKOFF_TITLE,
    meetUrl: cohort.meetUrl,
    dateLabel: cohort.startDate,
    description: cohort.description,
  };
}

export async function getKickoffCalendar(): Promise<KickoffCalendar> {
  const event = await getKickoffEvent();
  return {
    whenLabel: kickoffWhenLabel(event.start),
    meetUrl: event.meetUrl,
    googleUrl: googleCalendarUrl(event),
    outlookUrl: outlookCalendarUrl(event),
    icsUrl: "/challenge-kickoff.ics",
  };
}

export async function getKickoffIcs(): Promise<string> {
  return buildKickoffIcs(await getKickoffEvent());
}
