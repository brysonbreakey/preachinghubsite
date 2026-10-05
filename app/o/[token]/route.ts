import { NextRequest, NextResponse } from "next/server";

// Short link from the checklist text/email. It used to carry a signed $1-offer
// token; the destination is now the plain free-trial page, but the route stays
// so links already sent keep working.
export async function GET(req: NextRequest) {
  const { origin } = new URL(req.url);
  return NextResponse.redirect(`${origin}/checklist/thank-you`);
}
