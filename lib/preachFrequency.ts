// The qualifying question on the /checklist form: "How often do you preach?"
// Most weeks goes to /checklist/thank-you (which has the Meta Pixel and promotes the challenge) and
// is tagged "regular-preacher" in Kit, so the Pixel only tells Meta about people who preach most
// weeks. The other answers go to /challenge, with a "your checklist is on its way" bar (the same
// bar the thank-you page has), and the Pixel is not loaded there.

export const PREACH_FREQUENCIES = [
  { value: "most_weeks", label: "Most weeks" },
  { value: "monthly", label: "About once a month" },
  { value: "occasionally", label: "Occasionally" },
] as const;

export type PreachFrequency = (typeof PREACH_FREQUENCIES)[number]["value"];

/** The answer if it is one of the three, otherwise null (no answer, or something else). */
export function parsePreachFrequency(value: unknown): PreachFrequency | null {
  return PREACH_FREQUENCIES.some((f) => f.value === value) ? (value as PreachFrequency) : null;
}

/** Where to send them after the form. No answer keeps the old behavior (the thank-you page). */
export function nextPageFor(frequency: PreachFrequency | null): string {
  return frequency === "monthly" || frequency === "occasionally" ? "/challenge?from=checklist" : "/checklist/thank-you";
}
