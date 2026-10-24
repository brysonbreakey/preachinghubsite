import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { addTryLeadContact } from "@/lib/kit";
import { upsertTryContact } from "@/lib/slicktext";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body?.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!firstName || !lastName || !email) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // This is a side-channel lead capture (Kit) — it must never block or
  // fail the actual free-evaluation flow, so failures here are only logged.
  try {
    await addTryLeadContact({ email, firstName, lastName, phone });
  } catch (err) {
    console.error("try-lead-capture: kit failed", err);
  }

  // Name + phone into SlickText. Separate from Kit above, so one failing can't
  // skip the other; waitUntil keeps it running after the response is sent.
  if (phone) {
    waitUntil(upsertTryContact({ phone, firstName, lastName }));
  }

  return NextResponse.json({ ok: true });
}
