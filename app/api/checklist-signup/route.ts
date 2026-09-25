import { NextRequest, NextResponse } from "next/server";
import { resolveMx } from "dns/promises";
import { randomBytes } from "crypto";
import { waitUntil } from "@vercel/functions";
import { addChecklistContact } from "@/lib/kit";
import { createOfferToken } from "@/lib/offerToken";
import { supabaseAdmin } from "@/lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const SITE_URL = "https://preachinghub.com";
const DEDUP_WINDOW_HOURS = 24;

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
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

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

  // Deduplication: if this email already submitted recently, don't create
  // another row, re-tag them in Kit, or (most importantly) re-fire the
  // Zapier/Textla webhook — that would text the same person a duplicate
  // link every time they resubmit or double-click.
  const dedupCutoff = new Date(Date.now() - DEDUP_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
  const { data: recentLead } = await supabaseAdmin()
    .from("leads")
    .select("id, lead_token")
    .eq("email", email)
    .gte("created_at", dedupCutoff)
    .limit(1)
    .maybeSingle();

  if (recentLead) {
    // Still mint a fresh offer token so a resubmission (e.g. double-click)
    // gets a working redirect — we don't have the original one to look up.
    // Stored on the existing row (rather than a new one) so /o/:lead_token
    // — the short link already sent for this lead — reflects the new offer.
    let offerToken: string | undefined;
    try {
      offerToken = createOfferToken().token;
      await supabaseAdmin().from("leads").update({ offer_token: offerToken }).eq("id", recentLead.id);
    } catch (err) {
      console.error("checklist-signup: offer token unavailable (dedup path)", err);
    }
    return NextResponse.json({ ok: true, offerToken });
  }

  // Minted once, here, at signup — not when the offer page loads — so the
  // exact same deadline can be handed to Kit/Zapier and used for the
  // immediate redirect below. If OFFER_SIGNING_SECRET isn't set, this
  // degrades to no offer link rather than failing the whole signup.
  let offerToken: string | undefined;
  try {
    offerToken = createOfferToken().token;
  } catch (err) {
    console.error("checklist-signup: offer token unavailable", err);
  }

  // Generate the public lead token separately from any database id, and
  // insert it into Supabase before sending it to Kit/Zapier — the token in
  // the link is only useful if the row it points to already exists.
  // At 8 hex chars the token space is small enough that a collision is
  // possible at scale, so this inserts (rather than upserts) and retries
  // with a fresh token on a unique-constraint hit, instead of silently
  // overwriting a different lead's row.
  let leadToken = "";
  let inserted = false;
  try {
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      leadToken = randomBytes(4).toString("hex");
      const { error } = await supabaseAdmin()
        .from("leads")
        .insert({ lead_token: leadToken, email, first_name: firstName, phone, offer_token: offerToken });
      if (!error) {
        inserted = true;
      } else if (error.code !== "23505") {
        throw error;
      }
    }
    if (!inserted) throw new Error("could not generate a unique lead token");
  } catch (err) {
    console.error("checklist-signup: supabase insert failed", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  const checklistLink = `${SITE_URL}/c/${leadToken}`;

  // Kit's email isn't character-constrained, so it gets the full direct
  // link. Zapier/SMS gets the short /o/:lead_token version below instead —
  // the full link is 129 characters, which alone eats almost an entire SMS
  // segment.
  const offerLink = offerToken ? `${SITE_URL}/checklist/thank-you?offer=${offerToken}` : undefined;
  const offerShortLink = offerToken ? `${SITE_URL}/o/${leadToken}` : undefined;

  try {
    await addChecklistContact({ email, firstName, offerLink });
  } catch (err) {
    console.error("checklist-signup: kit failed", err);
    return NextResponse.json(
      { error: "Something went wrong on our end. Please try again." },
      { status: 500 }
    );
  }

  // Side channel to Zapier (Textla contact + SMS with the checklist link).
  // Best-effort only — a Zapier/Textla hiccup must never fail the signup
  // the visitor is actually waiting on — but it still needs waitUntil to
  // keep running after the response is sent, since Vercel can otherwise
  // kill an un-awaited fetch the moment the function returns.
  const zapierWebhookUrl = process.env.ZAPIER_CHECKLIST_WEBHOOK_URL;
  if (zapierWebhookUrl) {
    waitUntil(
      fetch(zapierWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, first_name: firstName, checklistLink, offerLink: offerShortLink }),
      })
        .then((res) => {
          if (!res.ok) {
            console.error("checklist-signup: zapier webhook non-OK response", res.status);
          } else {
            console.log("checklist-signup: zapier webhook sent OK");
          }
        })
        .catch((err) => {
          console.error("checklist-signup: zapier webhook failed", err);
        })
    );
  } else {
    console.error("checklist-signup: ZAPIER_CHECKLIST_WEBHOOK_URL not set");
  }

  return NextResponse.json({ ok: true, offerToken });
}
