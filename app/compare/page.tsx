import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StackUp } from "@/components/StackUp";

export const metadata: Metadata = {
  title: "How We Stack Up — PreachingHub",
  description: "See how PreachingHub compares to Sermonary, SermonAI, Sermonly, and Logos on sermon prep and coaching.",
};

// Hidden for now (404s, out of the nav and sitemap). Flip to true to bring it back.
const COMPARE_PAGE_ENABLED = false;

export default function ComparePage() {
  if (!COMPARE_PAGE_ENABLED) notFound();

  return (
    <main>
      <Navbar />
      <StackUp />
      <Footer />
    </main>
  );
}
