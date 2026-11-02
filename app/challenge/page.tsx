import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { ChallengePage } from "@/components/challenge/ChallengePage";

export const metadata: Metadata = {
  title: "Free 7-Day Preaching Growth Challenge — PreachingHub",
  description:
    "A free 7-day challenge for preachers who want to grow: a kickoff video call, daily prompts, check-ins, and growth exercises (about 15 minutes a day), free access to PreachingHub, and a 1:1 call to plan your growth. Starts Tuesday, November 10.",
  alternates: { canonical: "/challenge" },
};

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

export default function Page() {
  return (
    <div className={`${jakarta.variable} ${lora.variable}`}>
      <ChallengePage />
    </div>
  );
}
