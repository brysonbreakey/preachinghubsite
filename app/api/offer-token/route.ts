import { NextResponse } from "next/server";
import { createOfferToken } from "@/lib/offerToken";

export async function POST() {
  try {
    return NextResponse.json(createOfferToken());
  } catch (err) {
    console.error("offer-token: unavailable", err);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
