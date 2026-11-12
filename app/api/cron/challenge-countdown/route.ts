import { NextRequest, NextResponse } from "next/server";
import { syncChallengeCountdown } from "@/lib/challengeCountdown";

// Daily challenge jobs (see lib/challengeCountdown.ts). Vercel Cron calls this; cron is UTC-only, so
// each job has two entries (one per daylight-saving offset) and NO hour guard: the send time is
// inside the calculation (lib/startCountdown.ts), so a run at the wrong hour changes nothing.
//   default      days_until_challenge_start, which flips at 11:00 AM Chicago (countdownDate)
//   ?job=day     challenge_day, which flips at 9:00 AM Chicago daily and 2:15 PM on a cohort's Day 1
// It sends `Authorization: Bearer $CRON_SECRET`.
//
// By hand:  curl -H "Authorization: Bearer $CRON_SECRET" "https://preachinghub.com/api/cron/challenge-countdown?dry_run=true"
//   ?dry_run=true  log what would change, write nothing
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";
  const only = req.nextUrl.searchParams.get("job") === "day" ? "day" : "countdown";
  try {
    const summary = await syncChallengeCountdown({ dryRun, only });
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("challenge countdown: job failed", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
