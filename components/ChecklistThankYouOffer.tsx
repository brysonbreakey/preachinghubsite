"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { ChecklistVSL } from "@/components/ChecklistVSL";
import { FeedbackReportMockup } from "@/components/FeedbackReportMockup";
import { APP_URL } from "@/lib/urls";

const BENEFITS = [
  "Coaching feedback on every sermon you preach",
  "Pacing and tone/volume analysis",
  "Sermon builder, templates, and series planning",
];

export function ChecklistThankYouOffer({ token, expiresAt }: { token: string; expiresAt: number }) {
  useEffect(() => {
    posthog.capture("checklist_offer_viewed");
  }, []);

  const endDate = new Date(expiresAt).toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const href = `${APP_URL}/auth/login?${new URLSearchParams({ mode: "signup", source: "checklist_offer", offer: token }).toString()}`;

  return (
    <main>
      <Navbar />
      <section className="bg-slate-50 pt-32 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <ChecklistVSL />

          <div className="text-center mb-8">
            <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: "#3760ad" }}>
              Checklist reader offer · ends {endDate}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
              Your first month of PreachingHub for $1
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              You just grabbed the checklist. Here&apos;s a way to put it to work: 30 days of full access to the coaching
              platform built for preachers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8">
            <ul className="space-y-3 mb-6">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-0.5 shrink-0"><Icon d="M20 6 9 17l-5-5" size={18} color="#16a34a" strokeWidth={2.5} /></span>
                  {b}
                </li>
              ))}
            </ul>

            <a
              href={href}
              onClick={() => posthog.capture("checklist_offer_clicked")}
              className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white"
              style={{ backgroundColor: "#3760ad" }}
            >
              Start my $1 month →
            </a>
            <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
              $1 today. After 30 days, $49/month unless you cancel. Card required — cancel anytime from your account.
              <br />
              A one-time offer for checklist readers, available for 48 hours after you download it.
            </p>
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center mt-10 mb-3">
            Here&apos;s a sample coaching report
          </p>
          <div className="relative max-w-md mx-auto overflow-hidden rounded-2xl" style={{ maxHeight: 340 }}>
            <FeedbackReportMockup />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(to bottom, rgba(248,250,252,0), rgb(248,250,252))" }}
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
