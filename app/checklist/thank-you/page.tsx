"use client";

import { TryPageContent } from "@/components/TryPageContent";
import { ChecklistVSL } from "@/components/ChecklistVSL";
import { MetaPixel } from "@/components/MetaPixel";

const FB_PIXEL_ID = "1475772691211417";

export default function ChecklistThankYouPage() {
  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      <TryPageContent aboveForm={<ChecklistVSL />} />
    </>
  );
}
