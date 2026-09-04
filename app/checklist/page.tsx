"use client";

import { useEffect, useState } from "react";
import { PHMark } from "@/components/Logo";

const NAVY = "#3760ad";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PDF_HREF = "/downloads/pre-preaching-checklist.pdf";

export default function ChecklistPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
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
    if (!firstName.trim() || !lastName.trim()) {
      setStatus("error");
      setErrorMessage("Enter your first and last name.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setErrorMessage("Enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/checklist-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
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

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: NAVY }}>
              <PHMark size={22} color="#fff" />
            </div>
          </div>

          {status === "success" ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Your checklist is ready, {firstName.trim()}.
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
            <>
              <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8">
                <div
                  className="absolute -top-3 -right-3 rotate-6 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-md"
                  style={{ backgroundColor: NAVY }}
                >
                  Free PDF
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight text-center">
                  The Pre-Preaching Checklist
                </h1>
                <p className="text-slate-500 leading-relaxed mb-5 text-center">
                  Ready on paper isn&apos;t the same as ready to preach. Five quick checks to run before you step into the pulpit &mdash; so you preach with a clear mind and an open hand.
                </p>
                <p className="text-slate-500 leading-relaxed mb-6 text-center text-sm">
                  Built by PreachingHub, this one-page checklist walks you through message clarity, opening and closing, flow, delivery readiness, and logistics &mdash; the last pass before Sunday.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className={`w-full rounded-lg border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                        status === "error" ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                      }`}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className={`w-full rounded-lg border px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                        status === "error" ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                      }`}
                    />
                  </div>
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
                  {status === "error" && (
                    <p className="text-xs text-red-600">{errorMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors disabled:opacity-60"
                    style={{ backgroundColor: NAVY }}
                  >
                    {status === "loading" ? "Sending..." : "Send Me the Checklist"}
                  </button>
                </form>
                <p className="text-xs text-slate-400 text-center mt-4">
                  We&apos;ll only email you about preaching. Unsubscribe anytime.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-sm italic text-slate-400 pb-8 px-6">
        We don&apos;t write sermons. We build preachers.
      </p>
    </main>
  );
}
