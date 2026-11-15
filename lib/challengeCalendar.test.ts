import { describe, expect, it } from "vitest";
import { buildKickoffIcs, googleCalendarUrl, icsTime, kickoffWhenLabel, outlookCalendarUrl, type KickoffEvent } from "./challengeCalendar";

const event: KickoffEvent = {
  start: Date.parse("2026-11-17T19:00:00Z"), // Tue Nov 17, 1:00 PM CST
  minutes: 45,
  title: "7-Day Preaching Growth Challenge Kickoff",
  meetUrl: "https://meet.google.com/duy-uura-vdt",
  dateLabel: "2026-11-17",
};

describe("kickoff calendar event", () => {
  it("formats times as UTC calendar stamps", () => {
    expect(icsTime(event.start)).toBe("20261117T190000Z");
  });
  it("builds a calendar file for the right moment, with the call link and a 15 minute reminder", () => {
    const ics = buildKickoffIcs(event, Date.parse("2026-11-15T12:00:00Z"));
    expect(ics).toContain("DTSTART:20261117T190000Z");
    expect(ics).toContain("DTEND:20261117T194500Z");
    expect(ics).toContain("UID:challenge-kickoff-20261117@preachinghub.com");
    expect(ics).toContain("SUMMARY:7-Day Preaching Growth Challenge Kickoff");
    expect(ics).toContain("LOCATION:https://meet.google.com/duy-uura-vdt");
    expect(ics).toContain("TRIGGER:-PT15M");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
  it("escapes text and folds long lines at 75 characters", () => {
    const ics = buildKickoffIcs({ ...event, title: "Kickoff, with; special\\chars" });
    expect(ics).toContain("SUMMARY:Kickoff\\, with\; special\\\\chars");
    for (const line of ics.split("\r\n")) expect(line.length).toBeLessThanOrEqual(75);
    // the description is long enough to fold, and unfolds back to the full text
    expect(ics.replace(/\r\n /g, "")).toContain("Join on Google Meet: https://meet.google.com/duy-uura-vdt\\n\\nBring the sermon you're working on\\, or be ready to start a new one.");
  });
  it("builds Google and Outlook links with the same moment and call link", () => {
    const g = new URL(googleCalendarUrl(event));
    expect(g.origin + g.pathname).toBe("https://calendar.google.com/calendar/render");
    expect(g.searchParams.get("dates")).toBe("20261117T190000Z/20261117T194500Z");
    expect(g.searchParams.get("location")).toBe(event.meetUrl);
    const o = new URL(outlookCalendarUrl(event));
    expect(o.searchParams.get("startdt")).toBe("2026-11-17T19:00:00.000Z");
    expect(o.searchParams.get("enddt")).toBe("2026-11-17T19:45:00.000Z");
    expect(o.searchParams.get("location")).toBe(event.meetUrl);
  });
  it("follows a new cohort: different day and time, same code", () => {
    const next = { ...event, start: Date.parse("2027-01-12T20:30:00Z"), dateLabel: "2027-01-12" }; // Tue Jan 12, 2:30 PM CST
    expect(buildKickoffIcs(next)).toContain("DTSTART:20270112T203000Z");
    expect(kickoffWhenLabel(next.start)).toBe("Tuesday, January 12 at 2:30 PM Central");
  });
  it("words the time in Central", () => {
    expect(kickoffWhenLabel(event.start)).toBe("Tuesday, November 17 at 1:00 PM Central");
  });
});
