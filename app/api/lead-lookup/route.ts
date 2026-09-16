import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const TOKEN_RE = /^[a-f0-9]{20,64}$/;
const TOKEN_TTL_DAYS = 30;

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";

  if (!TOKEN_RE.test(token)) {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  const cutoff = new Date(Date.now() - TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin()
    .from("leads")
    .select("email, first_name, created_at")
    .eq("lead_token", token)
    .gte("created_at", cutoff)
    .maybeSingle();

  if (error) {
    console.error("lead-lookup: supabase error", error);
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  if (!data) {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  return NextResponse.json(
    { email: data.email, first_name: data.first_name },
    { headers: { "Cache-Control": "no-store" } }
  );
}
