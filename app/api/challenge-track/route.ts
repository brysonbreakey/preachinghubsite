import { NextRequest, NextResponse } from "next/server";
import { verifyChallengeClaim } from "@/lib/challengeToken";
import { parseTrack } from "@/lib/challengeTracks";
import { setChallengeTrack } from "@/lib/kit";

// Step 2 of the challenge signup popup: which growth track the person chose (Clarity, Content,
// Creativity, or "not sure yet"). The signed claim from the signup response says which email this is
// (it only reaches the browser that just signed up), so nobody can tag someone else's address.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const claim = verifyChallengeClaim(body?.claim);
  const track = parseTrack(body?.track);
  if (!claim || !track) return NextResponse.json({ error: "invalid" }, { status: 400 });
  try {
    await setChallengeTrack({ email: claim.email, firstName: claim.firstName, track });
  } catch (err) {
    console.error("challenge-track: kit failed", err);
    return NextResponse.json({ error: "Something went wrong on our end." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
