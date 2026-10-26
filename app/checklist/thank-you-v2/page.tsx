import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { AcceleratorPage } from "@/components/accelerator/AcceleratorPage";
import { COHORT_SPOTS, currentCohort, getSpotsLeft } from "@/lib/cohort";

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
  const cohort = currentCohort();
  let spotsLeft = await getSpotsLeft(cohort.key);

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
