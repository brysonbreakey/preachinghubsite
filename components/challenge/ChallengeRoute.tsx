import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { ChallengePage, type ChallengeVariant } from "@/components/challenge/ChallengePage";
import { serverNow } from "@/lib/challenge";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

// Server-side body shared by every route that serves the 7-Day Preaching Growth Challenge
// page (/challenge and /checklist/thank-you), so the two can't drift apart. Each route supplies its
// own metadata and `dynamic = "force-dynamic"` (enrollment closes at a set time, so never cache).
export async function ChallengeRoute({ variant, searchParams }: { variant: ChallengeVariant; searchParams: Promise<{ now?: string }> }) {
  const { now } = await searchParams; // ?now=<ISO time> fakes the clock when testing locally only
  return (
    <div className={`${jakarta.variable} ${lora.variable}`}>
      <ChallengePage initialNow={serverNow(now)} variant={variant} />
    </div>
  );
}
