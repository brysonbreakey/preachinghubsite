import type { Metadata } from "next";
import { ChallengeRoute } from "@/components/challenge/ChallengeRoute";

export const metadata: Metadata = {
  title: { absolute: "7-Day Preaching Growth Challenge | PreachingHub" },
  description:
    "Become a more confident, clear, and impactful preacher in 7 days. Personalized training, practical exercises, AI coaching access, and a growth plan. Free, no card required.",
  alternates: { canonical: "/challenge" },
  // The share image is /challenge-og-free.png (evergreen: no dates).
  openGraph: {
    title: "7-Day Preaching Growth Challenge | PreachingHub",
    description: "Become a more confident, clear, and impactful preacher in 7 days. A free 7-day challenge, November 17–23. 15 minutes a day, no card required.",
    url: "/challenge",
    images: [{ url: "/challenge-og-free.png", width: 1200, height: 630, alt: "Free 7-Day Preaching Growth Challenge: 15 minutes a day, no card required" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "7-Day Preaching Growth Challenge | PreachingHub",
    description: "Become a more confident, clear, and impactful preacher in 7 days. A free 7-day challenge, November 17–23. No card required.",
    images: ["/challenge-og-free.png"],
  },
};

// Enrollment closes at a set time and the countdown runs to the kickoff, so never serve a cached
// copy: the page is rendered per request with the server's clock (see lib/challenge.ts).
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ now?: string; from?: string }> }) {
  return <ChallengeRoute variant="landing" searchParams={searchParams} />;
}
