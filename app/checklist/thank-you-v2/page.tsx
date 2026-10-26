import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { AcceleratorPage } from "@/components/accelerator/AcceleratorPage";
import { COHORT_SPOTS, currentCohort, getLiveCohort } from "@/lib/cohort";

// The 30-Day Preaching Growth Accelerator page. Built separately from /checklist/thank-you and
// kept out of search and every link until it's ready to replace that page
// (swap: render <AcceleratorPage /> from app/checklist/thank-you/ThankYouClient.tsx).
export const metadata: Metadata = {
  title: "30-Day Preaching Growth Accelerator — PreachingHub",
  robots: { index: false, follow: false },
};

// The cohort date rolls over at midnight Central, so never serve a cached copy.
export const dynamic = "force-dynamic";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

export default async function Page({ searchParams }: { searchParams: Promise<{ spots?: string }> }) {
  // Ask the app which cohort is current and how many spots are left; fall back to the local
  // schedule and "Limited spots" if it can't be reached.
  // TODO: the "full" and "downsell only" versions of this page (the $100-off offer, the waitlist)
  // aren't built yet (see Documentation/coaching-offer-spec.md). Until they are, "downsell only" shows
  // no number and "full" shows that the cohort is full.
  const live = await getLiveCohort();
  const cohort = live?.cohort ?? currentCohort();
  let spotsLeft: number | null = live ? (live.state === "open" ? live.remaining : live.state === "full" ? 0 : null) : null;

  // Local-only preview helper (?spots=4); ignored in production so nobody can fake a number.
  if (process.env.NODE_ENV !== "production") {
    const override = Number((await searchParams).spots);
    if (Number.isInteger(override) && override >= 0 && override <= COHORT_SPOTS) spotsLeft = override;
  }

  return (
    <div className={`${jakarta.variable} ${lora.variable}`}>
      <AcceleratorPage cohort={cohort} spotsLeft={spotsLeft} />
    </div>
  );
}
