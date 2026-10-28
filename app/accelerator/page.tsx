import type { Metadata } from "next";
import { AcceleratorRoute } from "@/components/accelerator/AcceleratorRoute";

// The same offer as /checklist/thank-you-v2, as its own page for visitors who didn't just download
// the checklist (no "your checklist is on its way" banner).
export const metadata: Metadata = {
  title: "30-Day Preaching Growth Accelerator — PreachingHub",
  description:
    "Get your sermons coached in 30 days: PreachingHub coaching on every sermon, a personal 1:1 coaching session and a 30-day growth plan. Better preaching, or your money back.",
  alternates: { canonical: "/accelerator" },
};

// The cohort date rolls over at midnight Central, so never serve a cached copy.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ spots?: string }> }) {
  return <AcceleratorRoute variant="landing" searchParams={searchParams} />;
}
