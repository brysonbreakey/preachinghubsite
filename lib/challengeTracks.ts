// The three growth tracks people choose from right after they join the challenge. The choice is
// saved to Kit as a tag (challenge-clarity / -content / -creativity) and the challenge_track field.

export const CHALLENGE_TRACKS = [
  {
    value: "clarity",
    label: "Clarity",
    blurb: "A clear main idea and a sermon that's easy to follow",
    icon: ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"],
  },
  {
    value: "content",
    label: "Content",
    blurb: "Deeper content and a stronger prep process",
    icon: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  },
  {
    value: "creativity",
    label: "Creativity",
    blurb: "Gripping introductions and better illustrations",
    icon: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z",
  },
] as const;

export type ChallengeTrack = (typeof CHALLENGE_TRACKS)[number]["value"] | "not_sure";

export function parseTrack(value: unknown): ChallengeTrack | null {
  if (value === "not_sure") return "not_sure";
  return CHALLENGE_TRACKS.some((t) => t.value === value) ? (value as ChallengeTrack) : null;
}
