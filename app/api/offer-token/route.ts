import { NextRequest, NextResponse } from "next/server";
import { createOfferToken, createFixedOfferToken } from "@/lib/offerToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    // "fixed" selects the one server-defined campaign deadline — never an
    // arbitrary client-supplied date, so nobody can mint themselves a
    // longer offer window by calling this with a made-up expiresAt.
    const token = body?.deadline === "fixed" ? createFixedOfferToken() : createOfferToken();
    return NextResponse.json(token);
  } catch (err) {
    console.error("offer-token: unavailable", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
