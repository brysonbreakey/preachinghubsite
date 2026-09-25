import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Short link for texting the $1 offer — the real, signed offer link is 129
// characters, which alone eats nearly a full SMS segment. Reuses the same
// lead_token already texted for the checklist link, looks up that lead's
// current offer_token, and redirects to the real destination.
export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { origin } = new URL(req.url);

  const { data: lead } = await supabaseAdmin()
    .from("leads")
    .select("offer_token")
    .eq("lead_token", token)
    .maybeSingle();

  if (!lead?.offer_token) {
    return NextResponse.redirect(`${origin}/checklist/thank-you`);
  }

  return NextResponse.redirect(`${origin}/checklist/thank-you?offer=${encodeURIComponent(lead.offer_token)}`);
}
