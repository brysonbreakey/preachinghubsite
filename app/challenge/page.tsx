import type { Metadata } from "next";
import { ChallengeRoute } from "@/components/challenge/ChallengeRoute";

export const metadata: Metadata = {
  title: { absolute: "7-Day Preaching Growth Challenge | PreachingHub" },
  description:
    "Become a more confident, clear, and impactful preacher in 7 days. Personalized training, practical exercises, AI coaching access, and a growth plan for just $7.",
  alternates: { canonical: "/challenge" },
  // The share image is /challenge-og-paid.png (the old challenge-og.png says "Free", so it isn't used).
  openGraph: {
    title: "7-Day Preaching Growth Challenge | PreachingHub",
    description: "Become a more confident, clear, and impactful preacher in 7 days. November 17–23. 15 minutes a day, just $7.",
    url: "/challenge",
    images: [{ url: "/challenge-og-paid.png", width: 1200, height: 630, alt: "7-Day Preaching Growth Challenge: 15 minutes a day, just $7" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "7-Day Preaching Growth Challenge | PreachingHub",
    description: "Become a more confident, clear, and impactful preacher in 7 days. November 17–23. Just $7.",
    images: ["/challenge-og-paid.png"],
  },
};

// Enrollment closes at a set time and the countdown runs to the kickoff, so never serve a cached
// copy: the page is rendered per request with the server's clock (see lib/challenge.ts).
export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<{ now?: string }> }) {
  return <ChallengeRoute variant="landing" searchParams={searchParams} />;
}
