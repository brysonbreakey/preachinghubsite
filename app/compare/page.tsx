import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StackUp } from "@/components/StackUp";

export const metadata: Metadata = {
  title: "How We Stack Up — PreachingHub",
  description: "See how PreachingHub compares to Sermonary, SermonAI, Sermonly, and Logos on sermon prep and coaching.",
};

export default function ComparePage() {
  return (
    <main>
      <Navbar />
      <StackUp />
      <Footer />
    </main>
  );
}
