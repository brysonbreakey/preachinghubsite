import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { AcceleratorPage } from "@/components/accelerator/AcceleratorPage";

// The 30-Day Preaching Growth Accelerator page. Built separately from /checklist/thank-you and
// kept out of search and every link until it's ready to replace that page
// (swap: render <AcceleratorPage /> from app/checklist/thank-you/ThankYouClient.tsx).
export const metadata: Metadata = {
  title: "30-Day Preaching Growth Accelerator — PreachingHub",
  robots: { index: false, follow: false },
};

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-jakarta" });
const lora = Lora({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-lora" });

export default function Page() {
  return (
    <div className={`${jakarta.variable} ${lora.variable}`}>
      <AcceleratorPage />
    </div>
  );
}
