import type { Metadata } from "next";
import { AcceleratorRoute } from "@/components/accelerator/AcceleratorRoute";

// The accelerator offer as it will appear right after the checklist signup. Kept out of search and
// every link until it replaces /checklist/thank-you
// (swap: render <AcceleratorPage /> from app/checklist/thank-you/ThankYouClient.tsx).
export const metadata: Metadata = {
  title: "30-Day Preaching Growth Accelerator — PreachingHub",
  robots: { index: false, follow: false },
};

// The cohort date rolls over at midnight Central, so never serve a cached copy.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ spots?: string }> }) {
  return <AcceleratorRoute variant="thank-you" searchParams={searchParams} />;
}
