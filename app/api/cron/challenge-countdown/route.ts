import { NextRequest, NextResponse } from "next/server";
import { syncChallengeCountdown } from "@/lib/challengeCountdown";
import { chicagoHourNow } from "@/lib/startCountdown";

// Daily challenge countdown (see lib/challengeCountdown.ts). Vercel Cron calls this at 10:00 and
// 11:00 UTC; cron is UTC-only, so the one that lands on 5 AM in Chicago does the work and the
// other exits (the job is idempotent either way). It sends `Authorization: Bearer $CRON_SECRET`.
//
// By hand:  curl -H "Authorization: Bearer $CRON_SECRET" "https://preachinghub.com/api/cron/challenge-countdown?dry_run=true"
//   ?dry_run=true  log what would change, write nothing (runs at any hour)
//   ?force=true    run now even outside the 5 AM Chicago hour
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dryRun = req.nextUrl.searchParams.get("dry_run") === "true";
  const force = req.nextUrl.searchParams.get("force") === "true";
  if (!dryRun && !force && chicagoHourNow() !== 5) {
    return NextResponse.json({ ok: true, skipped: "not 5 AM in America/Chicago" });
  }
  try {
    const summary = await syncChallengeCountdown({ dryRun });
    return NextResponse.json({ ok: true, ...summary });
  } catch (err) {
    console.error("challenge countdown: job failed", err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
