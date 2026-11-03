import type { Metadata } from "next";
import { ChallengeRoute } from "@/components/challenge/ChallengeRoute";

export const metadata: Metadata = {
  title: { absolute: "PreachingHub 7-Day Growth Challenge" },
  description:
    "A free 7-day challenge for preachers who want to grow: a kickoff video call, daily prompts, check-ins, and growth exercises (about 15 minutes a day), free access to PreachingHub, and a 1:1 call to plan your growth. Starts Tuesday, November 10. By day 7 you'll have a stronger sermon and a written plan to keep growing.",
  alternates: { canonical: "/challenge" },
  openGraph: {
    title: "PreachingHub 7-Day Growth Challenge",
    description: "A free 7-day challenge for preachers who want to grow. Starts Tuesday, November 10. About 15 minutes a day.",
    url: "/challenge",
    images: [{ url: "/challenge-og.png", width: 1200, height: 630, alt: "Free 7-Day Preaching Growth Challenge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PreachingHub 7-Day Growth Challenge",
    description: "A free 7-day challenge for preachers who want to grow. Starts Tuesday, November 10.",
    images: ["/challenge-og.png"],
  },
};

// Enrollment closes at a set time and the countdown runs to the kickoff, so never serve a cached
// copy: the page is rendered per request with the server's clock (see lib/challenge.ts).
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ now?: string }> }) {
  return <ChallengeRoute variant="landing" searchParams={searchParams} />;
}
