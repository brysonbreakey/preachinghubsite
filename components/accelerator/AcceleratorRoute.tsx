import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { AcceleratorPage, type AcceleratorVariant } from "@/components/accelerator/AcceleratorPage";
import { COHORT_SPOTS, currentCohort, getLiveCohort } from "@/lib/cohort";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

// Server-side body shared by every route that serves the 30-Day Preaching Growth Accelerator page
// (/checklist/thank-you-v2 and /accelerator), so the two can't drift apart. Each route supplies its
// own metadata and `dynamic = "force-dynamic"` (the cohort date rolls over at midnight Central).
export async function AcceleratorRoute({ variant, searchParams }: { variant: AcceleratorVariant; searchParams: Promise<{ spots?: string }> }) {
  // Ask the app which cohort is current and how many spots are left; fall back to the local
  // schedule and "Limited spots" if it can't be reached.
  // TODO: the "full" and "downsell only" versions of this page (the $125 offer, the waitlist)
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
      <AcceleratorPage cohort={cohort} spotsLeft={spotsLeft} variant={variant} />
    </div>
  );
}
