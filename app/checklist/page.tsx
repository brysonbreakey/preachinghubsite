"use client";

import { useEffect, useState } from "react";
import { PHMark } from "@/components/Logo";

const NAVY = "#3760ad";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PDF_HREF = "/downloads/pre-preaching-checklist.pdf";

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
  return parts.join("-");
}

export default function ChecklistPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<"form" | "loading" | "success" | "error">("form");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "The Pre-Preaching Checklist — PreachingHub";
    const params = new URLSearchParams(window.location.search);
    const s = params.get("src");
    if (s) setSrc(s);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setStatus("error");
      setErrorMessage("Enter your name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }
    if (phone.replace(/\D/g, "").length !== 10) {
      setStatus("error");
      setErrorMessage("Enter a valid 10-digit phone number.");
      return;
    }

    setStatus("loading");
    const { firstName, lastName } = splitName(name);
    try {
      const res = await fetch("/api/checklist-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email.trim(),
          phone: phone.trim(),
          src,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "submit_failed");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error && err.message !== "submit_failed"
          ? err.message
          : "Something went wrong on our end. Please try again."
      );
    }
  }

  const firstName = splitName(name).firstName;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-10 sm:py-16">
        <div className="w-full max-w-md lg:max-w-4xl">
          <div className="flex justify-center mb-6 lg:hidden">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: NAVY }}>
              <PHMark size={22} color="#fff" />
            </div>
          </div>

          {status === "success" ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Your checklist is ready, {firstName}.
              </h1>
              <p className="text-slate-500 leading-relaxed mb-6">
                Tap below to download the Pre-Preaching Checklist now.
              </p>
              <a
                href={PDF_HREF}
                download
                className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base w-full transition-colors"
                style={{ backgroundColor: NAVY }}
              >
                Download the Checklist
              </a>
              <a href="https://preachinghub.com" className="block text-sm text-slate-400 hover:text-slate-600 mt-5 transition-colors">
                preachinghub.com
              </a>
            </div>
          ) : (
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              {/* Left column — headline, subheadline, creative */}
              <div className="text-center lg:text-left">
                <p className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: NAVY }}>
                  (Free Download)
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 mb-8 tracking-tight leading-[1.05]">
                  The Pre-Preaching Checklist
                </h1>

                {/* Creative — desktop only */}
                <div className="hidden lg:flex justify-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/checklist-ipad.png"
                    alt="The Pre-Preaching Checklist shown on an iPad"
                    className="w-full max-w-xs"
                  />
                </div>
              </div>

              {/* Form */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8">
                <p className="text-slate-500 leading-relaxed mb-6">
                  Most sermons don&apos;t fail Sunday morning. They fail Thursday afternoon &mdash; in the gap between &ldquo;the outline is done&rdquo; and &ldquo;I know this like the back of my hand.&rdquo; This free checklist contains 5 things that will close that gap.
                </p>
                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className={`w-full rounded-lg border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                      status === "error" ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                    }`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className={`w-full rounded-lg border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                      status === "error" ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                    }`}
                  />
                  <input
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="xxx-xxx-xxxx"
                    className={`w-full rounded-lg border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                      status === "error" ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                    }`}
                  />
                  {status === "error" && (
                    <p className="text-xs text-red-600">{errorMessage}</p>
                  )}
                  <p className="text-xs font-bold uppercase tracking-wide text-center pt-1" style={{ color: NAVY }}>
                    100% Free &mdash; Instant Download
                  </p>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors disabled:opacity-60"
                    style={{ backgroundColor: NAVY }}
                  >
                    {status === "loading" ? "Sending..." : "Get the Checklist"}
                  </button>
                </form>
                <p className="text-xs text-slate-400 text-center mt-4">
                  We will only email you about preaching. Unsubscribe any time. No spam, ever.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-sm italic text-slate-400 pb-8 px-6">
        We don&apos;t write sermons. We build preachers.
      </p>
    </main>
  );
}
