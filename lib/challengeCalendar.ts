// The kickoff call as a calendar event: a .ics file and "add to Google / Outlook" links, all built
// from the cohort's kickoff time, so nothing is edited by hand for a new cohort. Times are exact
// moments (UTC), so each person's calendar shows the call in their own time zone.

export type KickoffEvent = {
  /** Start, in ms since the epoch. */
  start: number;
  minutes: number;
  title: string;
  /** The call link (Google Meet). */
  meetUrl: string;
  /** The kickoff date as "2026-11-17", used to keep the calendar event's id stable per cohort. */
  dateLabel: string;
};

const DESCRIPTION_LINES = (meetUrl: string) => [`Join on Google Meet: ${meetUrl}`, "", "Bring the sermon you're working on, or be ready to start a new one."];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** 20261117T190000Z */
export function icsTime(ms: number): string {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

const escapeText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Folds a line to 75 characters, as calendar files require (continuation lines start with a space). */
function fold(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts.join("\r\n");
}

export function buildKickoffIcs(event: KickoffEvent, now = Date.now()): string {
  const end = event.start + event.minutes * 60_000;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PreachingHub//7-Day Preaching Growth Challenge//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:challenge-kickoff-${event.dateLabel.replace(/-/g, "")}@preachinghub.com`,
    `DTSTAMP:${icsTime(now)}`,
    `DTSTART:${icsTime(event.start)}`,
    `DTEND:${icsTime(end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.meetUrl)}`,
    `URL:${event.meetUrl}`,
    `DESCRIPTION:${escapeText(DESCRIPTION_LINES(event.meetUrl).join("\n"))}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Challenge kickoff starts in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(event: KickoffEvent): string {
  const end = event.start + event.minutes * 60_000;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${icsTime(event.start)}/${icsTime(end)}`,
    details: DESCRIPTION_LINES(event.meetUrl).join("\n"),
    location: event.meetUrl,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: KickoffEvent): string {
  const end = event.start + event.minutes * 60_000;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: new Date(event.start).toISOString(),
    enddt: new Date(end).toISOString(),
    body: DESCRIPTION_LINES(event.meetUrl).join("\n"),
    location: event.meetUrl,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** "Tuesday, November 17 at 1:00 PM Central" */
export function kickoffWhenLabel(start: number): string {
  const d = new Date(start);
  const day = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", weekday: "long", month: "long", day: "numeric" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", { timeZone: "America/Chicago", hour: "numeric", minute: "2-digit" }).format(d);
  return `${day} at ${time} Central`;
}
