"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TryPageContent } from "@/components/TryPageContent";
import { ChecklistVSL, ChecklistThankYouHero } from "@/components/ChecklistVSL";
import { MetaPixel } from "@/components/MetaPixel";

const FB_PIXEL_ID = "1475772691211417";

function ChecklistThankYouInner() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? undefined;
  const email = searchParams.get("email") ?? undefined;

  return (
    <TryPageContent
      aboveForm={<ChecklistVSL />}
      heroContent={<ChecklistThankYouHero />}
      initialName={name}
      initialEmail={email}
    />
  );
}

export default function ChecklistThankYouPage() {
  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      <Suspense fallback={<TryPageContent aboveForm={<ChecklistVSL />} heroContent={<ChecklistThankYouHero />} />}>
        <ChecklistThankYouInner />
      </Suspense>
    </>
  );
}
