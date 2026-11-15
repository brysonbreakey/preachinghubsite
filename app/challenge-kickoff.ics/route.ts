import { getKickoffIcs } from "@/lib/challengeRun";

// The kickoff call's calendar file, at one permanent address (earlier emails and texts link here).
// It is generated from the cohort's kickoff time and call link, so a new cohort never needs a file
// edited by hand.
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await getKickoffIcs(), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="challenge-kickoff.ics"',
      "Cache-Control": "no-store",
    },
  });
}
