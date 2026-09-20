import { NextRequest, NextResponse } from "next/server";
import { addChecklistSaveContact } from "@/lib/kit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await addChecklistSaveContact({ email, firstName: firstName || undefined });
  } catch (err) {
    console.error("checklist-save: kit failed", err);
    return NextResponse.json({ error: "Something went wrong on our end." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
