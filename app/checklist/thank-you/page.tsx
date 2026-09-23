"use client";

import { useEffect, useState } from "react";
import { TryPageContent } from "@/components/TryPageContent";
import { ChecklistVSL, ChecklistThankYouHero } from "@/components/ChecklistVSL";
import { MetaPixel } from "@/components/MetaPixel";

const FB_PIXEL_ID = "1749227409631509";
const PREFILL_KEY = "ph_checklist_thank_you_prefill";

export default function ChecklistThankYouPage() {
  const [prefill, setPrefill] = useState<{ name?: string; email?: string } | null>(null);

  useEffect(() => {
    let value: { name?: string; email?: string } = {};
    try {
      const raw = sessionStorage.getItem(PREFILL_KEY);
      if (raw) {
        value = JSON.parse(raw);
        sessionStorage.removeItem(PREFILL_KEY);
      }
    } catch {
      // Best-effort only — worst case the form just isn't prefilled.
    }
    setPrefill(value);
  }, []);

  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      {/* key forces a remount once sessionStorage has been read, since
          TryPageContent's initial name/email state is only set on mount */}
      <TryPageContent
        key={prefill ? "prefilled" : "loading"}
        aboveForm={<ChecklistVSL />}
        heroContent={<ChecklistThankYouHero />}
        initialName={prefill?.name}
        initialEmail={prefill?.email}
        showPhoneField={false}
        defaultInputType="text"
      />
    </>
  );
}
