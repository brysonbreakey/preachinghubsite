import { NextRequest, NextResponse } from "next/server";
import { resolveMx } from "dns/promises";
import { randomBytes } from "crypto";
import { addChecklistContact } from "@/lib/mailchimp";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const SITE_URL = "https://preachinghub.com";

async function hasMailServer(email: string): Promise<boolean> {
  const domain = email.split("@")[1];
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const firstName = typeof body?.first_name === "string" ? body.first_name.trim() : "";
  const lastName = typeof body?.last_name === "string" ? body.last_name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const src = typeof body?.src === "string" ? body.src.trim().slice(0, 100) : undefined;

  if (!firstName) {
    return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (phone.replace(/\D/g, "").length !== 10) {
    return NextResponse.json({ error: "Enter a valid 10-digit phone number." }, { status: 400 });
  }
  if (!(await hasMailServer(email))) {
    return NextResponse.json({ error: "That email address doesn't look like it can receive mail. Double-check it and try again." }, { status: 400 });
  }

  // Generate the public lead token separately from any database id, and
  // upsert it into Supabase before sending it to Mailchimp — the token in
  // the email is only useful if the row it points to already exists.
  const leadToken = randomBytes(10).toString("hex");
  try {
    const { error } = await supabaseAdmin()
      .from("leads")
      .upsert(
        { lead_token: leadToken, email, first_name: firstName, phone },
        { onConflict: "lead_token" }
      );
    if (error) throw error;
  } catch (err) {
    console.error("checklist-signup: supabase upsert failed", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  const checklistLink = `${SITE_URL}/c/${leadToken}`;

  try {
    await addChecklistContact({ email, firstName, lastName, phone, src, checklistLink });
  } catch (err) {
    console.error("checklist-signup: mailchimp failed", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  // Side channel to Zapier (Textla contact + SMS with the checklist link).
  // Best-effort only — a Zapier/Textla hiccup must never fail the signup
  // the visitor is actually waiting on.
  const zapierWebhookUrl = process.env.ZAPIER_CHECKLIST_WEBHOOK_URL;
  if (zapierWebhookUrl) {
    fetch(zapierWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, first_name: firstName, checklistLink }),
    }).catch((err) => {
      console.error("checklist-signup: zapier webhook failed", err);
    });
  }

  return NextResponse.json({ ok: true });
}
