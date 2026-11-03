import type { Metadata } from "next";
import { MetaPixel } from "@/components/MetaPixel";
import { ChallengeRoute } from "@/components/challenge/ChallengeRoute";

// Same pixel ID as every earlier version of this page: the ID and the URL (/checklist/thank-you)
// are what Meta ties ad tracking and attribution to, not the page's content. This still fires the
// base PageView on load and nothing else, exactly as before.
const FB_PIXEL_ID = "1749227409631509";

// A thank-you page shouldn't be searchable; the same offer lives at /challenge for search.
export const metadata: Metadata = {
  title: "Free 7-Day Preaching Growth Challenge — PreachingHub",
  robots: { index: false, follow: false },
};

// Enrollment closes at a set time and the countdown runs to the kickoff, and Vercel's edge previously
// served a stale cached copy of this exact route to real visitors for 20+ minutes after a content swap
// (confirmed via a real PostHog recording), so never serve a cached copy.
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ now?: string }> }) {
  return (
    <>
      <MetaPixel pixelId={FB_PIXEL_ID} />
      <ChallengeRoute variant="thank-you" searchParams={searchParams} />
    </>
  );
}
