import { NextResponse } from "next/server";
import { getCohort } from "@/lib/challengeCohort";

// The cohort the site is showing, for client components that can't read the database (the site-wide
// popup). Public information only (the same dates the page shows).
export const dynamic = "force-dynamic";

export async function GET() {
  const c = await getCohort();
  return NextResponse.json(
    { kickoff: c.kickoff, closes: c.closes, rangeLabel: c.rangeLabel },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
