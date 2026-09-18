import { NextRequest, NextResponse } from "next/server";
import { addTryLeadContact } from "@/lib/kit";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body?.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // This is a side-channel lead capture (Kit) — it must never block or
  // fail the actual free-evaluation flow, so failures here are only logged.
  try {
    await addTryLeadContact({ email, firstName });
  } catch (err) {
    console.error("try-lead-capture: kit failed", err);
  }

  return NextResponse.json({ ok: true });
}
