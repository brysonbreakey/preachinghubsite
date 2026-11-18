import { describe, expect, it } from "vitest";
import { buildCohort, centralToUtc, cohortFromRow, closesPhrase, DEFAULT_COHORT, addDays } from "@/lib/challengeCohortCore";
import { CHALLENGE_CLOSES, CHALLENGE_KICKOFF, CHALLENGE_PASS_END_LABEL, CHALLENGE_PASS_UNTIL, CHALLENGE_START_DATE_LABEL, CHALLENGE_START_TIME_LABEL } from "@/lib/challenge";
import { computeChallengeDay } from "@/lib/startCountdown";

describe("the built-in cohort", () => {
  it("is exactly cohort 2 as it was hard-coded", () => {
    expect(DEFAULT_COHORT.kickoff).toBe(CHALLENGE_KICKOFF);
    expect(DEFAULT_COHORT.closes).toBe(CHALLENGE_CLOSES);
    expect(DEFAULT_COHORT.passUntil).toBe(CHALLENGE_PASS_UNTIL);
    expect(DEFAULT_COHORT.startDate).toBe(CHALLENGE_START_DATE_LABEL);
    expect(DEFAULT_COHORT.startTimeLabel).toBe(CHALLENGE_START_TIME_LABEL);
    expect(DEFAULT_COHORT.passEndLabel).toBe(CHALLENGE_PASS_END_LABEL);
  });
  it("words the page copy the way it read before", () => {
    expect(DEFAULT_COHORT.kickoffWhen).toBe("Tuesday, November 17 at 1 PM CST");
    expect(DEFAULT_COHORT.startDateLong).toBe("November 17, 2026");
    expect(DEFAULT_COHORT.rangeLabel).toBe("November 17–23");
    expect(DEFAULT_COHORT.rangeShort).toBe("Nov 17 – 23");
    expect(DEFAULT_COHORT.extraWeekShort).toBe("Nov 24 – 29");
    expect(DEFAULT_COHORT.closesLabel).toBe("11:59 PM CST on November 17");
    expect(DEFAULT_COHORT.startWeekday).toBe("Tuesday");
    expect(DEFAULT_COHORT.endWeekday).toBe("Monday");
    expect(DEFAULT_COHORT.dayDates).toEqual(["November 17", "November 18", "November 19", "November 20", "November 21", "November 22", "November 23"]);
  });
});

describe("a new cohort", () => {
  it("handles daylight time and a month change", () => {
    const c = buildCohort({ startDate: "2027-03-30", kickoffTime: "14:30", passEndDate: "2027-04-11" })!;
    expect(c.kickoff).toBe(Date.parse("2027-03-30T19:30:00Z")); // CDT, UTC-5
    expect(c.kickoffWhen).toBe("Tuesday, March 30 at 2:30 PM CDT");
    expect(c.startTimeLabel).toBe("2:30PM");
    expect(c.rangeLabel).toBe("March 30 – April 5");
    expect(c.rangeShort).toBe("Mar 30 – Apr 5");
    expect(c.passEndLabel).toBe("April 11");
    expect(c.closes).toBe(Date.parse("2027-03-31T05:00:00Z")); // end of the kickoff day, CDT
    expect(c.closesLabel).toBe("11:59 PM CDT on March 30");
  });
  it("lets enrollment stay open past the kickoff day", () => {
    const c = buildCohort({ startDate: "2026-12-01", kickoffTime: "13:00", closeDate: "2026-12-03", passEndDate: "2026-12-13" })!;
    expect(c.closes).toBe(Date.parse("2026-12-04T06:00:00Z"));
    expect(closesPhrase(c, Date.parse("2026-12-03T20:00:00Z"))).toBe("tonight at 11:59 PM CST");
    expect(closesPhrase(c, Date.parse("2026-12-01T20:00:00Z"))).toBe("at 11:59 PM CST on December 3");
  });
  it("rejects nonsense", () => {
    expect(buildCohort({ startDate: "2026-02-30", kickoffTime: "13:00", passEndDate: "2026-03-10" })).toBeNull();
    expect(buildCohort({ startDate: "2026-11-17", kickoffTime: "25:00", passEndDate: "2026-11-29" })).toBeNull();
    expect(buildCohort({ startDate: "2026-11-17", kickoffTime: "13:00", passEndDate: "2026-11-10" })).toBeNull();
    expect(buildCohort({ startDate: "2026-11-17", kickoffTime: "13:00", closeDate: "2026-11-10", passEndDate: "2026-11-29" })).toBeNull();
  });
  it("runs seven straight days with no half days, whatever the date", () => {
    for (const start of ["2026-12-01", "2027-01-12", "2027-06-08"]) {
      const seen = Array.from({ length: 9 }, (_, i) => computeChallengeDay(start, addDays(start, i)));
      expect(seen).toEqual(["1", "2", "3", "4", "5", "6", "7", "done", "done"]);
    }
  });
});

describe("cohortFromRow", () => {
  it("is null until the admin has saved settings", () => {
    expect(cohortFromRow(null)).toBeNull();
    expect(cohortFromRow({ start_date: "2026-11-17", kickoff_time: null, pass_end_date: null })).toBeNull();
  });
  it("reads a saved run (Postgres returns HH:MM:SS)", () => {
    const c = cohortFromRow({ start_date: "2026-11-17", kickoff_time: "13:00:00", pass_end_date: "2026-11-29", close_date: null, meet_url: "https://meet.google.com/abc-defg-hij", description: " Bring a sermon. " })!;
    expect(c.kickoff).toBe(CHALLENGE_KICKOFF);
    expect(c.meetUrl).toBe("https://meet.google.com/abc-defg-hij");
    expect(c.description).toBe("Bring a sermon.");
  });
  it("converts a Central time to the exact moment", () => {
    expect(centralToUtc("2026-11-17", 13, 0)).toBe(Date.parse("2026-11-17T19:00:00Z"));
  });
});
