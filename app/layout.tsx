import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PreachingHub — Sermon Prep & Coaching for Preachers",
  description: "Structured sermon prep, coaching-quality feedback, and team tools built for preachers who take their craft seriously.",
  openGraph: {
    title: "PreachingHub — Sermon Prep & Coaching for Preachers",
    description: "Get coaching feedback on your last sermon. Free for 14 days.",
    url: "https://preachinghub.com",
    siteName: "PreachingHub",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
