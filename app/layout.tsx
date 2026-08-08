import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://preachinghub.com"),
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

const animationCSS = `
@keyframes hero-fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-badge   { animation: hero-fade-up 0.6s ease both; animation-delay: 0.05s; }
.hero-h1      { animation: hero-fade-up 0.7s ease both; animation-delay: 0.18s; }
.hero-sub     { animation: hero-fade-up 0.7s ease both; animation-delay: 0.32s; }
.hero-cta     { animation: hero-fade-up 0.7s ease both; animation-delay: 0.44s; }
.hero-mockup  { animation: hero-fade-up 0.9s ease both; animation-delay: 0.6s;  }
.feature-mockup-scale { transform: scale(0.6); transform-origin: top center; margin-bottom: -140px; }
@media (min-width: 768px) {
  .feature-mockup-scale { transform: scale(0.85); transform-origin: center right; margin-bottom: 0; }
}
[data-animate] { opacity: 0; will-change: opacity, transform; transition: opacity 0.6s ease, transform 0.6s ease; }
[data-animate="fade-up"]    { transform: translateY(36px); }
[data-animate="fade-in"]    { transform: none; }
[data-animate="scale-up"]   { transform: scale(0.96); }
[data-animate="slide-left"]  { transform: translateX(-28px); }
[data-animate="slide-right"] { transform: translateX(28px); }
[data-animate].in-view { opacity: 1; transform: none; }
.feature-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.feature-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -8px rgba(55,96,173,0.15); }
.cta-btn { transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
.cta-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -4px rgba(55,96,173,0.4); }
.cta-btn:active { transform: translateY(0); }
.cta-btn-white { transition: transform 0.15s ease, box-shadow 0.15s ease; }
.cta-btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -4px rgba(0,0,0,0.2); }
.cta-btn-white:active { transform: translateY(0); }
.how-step-icon { transition: transform 0.25s ease, background-color 0.25s ease; }
.how-step-icon:hover { transform: scale(1.08); background-color: #dbeafe; }
.testimonial-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.testimonial-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px -8px rgba(55,96,173,0.12); }
@keyframes step-pulse-badge {
  0%, 70%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(55,96,173,0.5); }
  15% { transform: scale(1.18); box-shadow: 0 0 0 6px rgba(55,96,173,0); }
}
.step-pulse { animation: step-pulse-badge 2.4s ease-in-out infinite; }
@keyframes step-arrow-flow {
  0%, 70%, 100% { opacity: 0.35; transform: translateX(0); }
  15% { opacity: 1; transform: translateX(3px); }
}
.step-arrow { display: inline-flex; animation: step-arrow-flow 2.4s ease-in-out infinite; }
.stagger-children > * { transition-delay: calc(var(--i, 0) * 80ms); }
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
      </head>
      <body className="min-h-full antialiased">
        {children}
        <ScrollReveal />
      </body>
    </html>
  );
}
