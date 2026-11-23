import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaqSection } from "@/components/FaqSection";
import { BlackFridayLanding } from "@/components/BlackFridayLanding";

export const metadata: Metadata = {
  title: "Black Friday — PreachingHub",
  description:
    "Start your 14-day free trial of PreachingHub, then save: $29/mo for 6 months, or 50% off your first year of annual.",
  robots: { index: false },
};

export default function BlackFridayPage() {
  return (
    <main>
      <Navbar />
      <BlackFridayLanding />
      <FaqSection ids={["guarantee", "trial", "after-trial", "cancel", "no-write"]} />
      <Footer />
    </main>
  );
}
