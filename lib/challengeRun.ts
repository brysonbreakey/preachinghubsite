import {
  CHALLENGE_KICKOFF,
  CHALLENGE_KICKOFF_MINUTES,
  CHALLENGE_KICKOFF_TITLE,
  CHALLENGE_MEET_URL_DEFAULT,
  CHALLENGE_START_DATE_LABEL,
} from "@/lib/challenge";
import { buildKickoffIcs, googleCalendarUrl, kickoffWhenLabel, outlookCalendarUrl, type KickoffEvent } from "@/lib/challengeCalendar";
import { supabaseAdmin } from "@/lib/supabase";

// Where the kickoff call's link comes from: the admin Challenge Tracker lets you set it per run
// (challenge_runs.meet_url). The run is found by its start date (the cohort this site is showing).
// With no setting, no database, or anything unexpected, the default link is used, so the page and
// the calendar buttons never break.

let cache: { at: number; url: string } | null = null;
const TTL_MS = 60_000;

export async function getKickoffMeetUrl(): Promise<string> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.url;
  let url = CHALLENGE_MEET_URL_DEFAULT;
  try {
    const { data } = await supabaseAdmin().from("challenge_runs").select("meet_url").eq("start_date", CHALLENGE_START_DATE_LABEL).maybeSingle();
    const set = typeof data?.meet_url === "string" ? data.meet_url.trim() : "";
    if (/^https:\/\/\S+$/.test(set)) url = set;
  } catch {
    // keep the default
  }
  cache = { at: Date.now(), url };
  return url;
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
  return {
    start: CHALLENGE_KICKOFF,
    minutes: CHALLENGE_KICKOFF_MINUTES,
    title: CHALLENGE_KICKOFF_TITLE,
    meetUrl: await getKickoffMeetUrl(),
    dateLabel: CHALLENGE_START_DATE_LABEL,
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
