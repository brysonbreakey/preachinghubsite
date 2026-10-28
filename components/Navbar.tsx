"use client";

import { useState } from "react";
import posthog from "posthog-js";
import { PHLogo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/teams", label: "Teams" },
  { href: "/try", label: "Free Coaching Report" },
];

// Sits apart from NAV_LINKS: it's the offer, so it gets its own emphasized treatment.
const ACCELERATOR_LINK = { href: "/accelerator", label: "30-Day Growth Accelerator" };

function AcceleratorDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#4F46E5] opacity-60 motion-safe:animate-ping group-hover:bg-white" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#4F46E5] group-hover:bg-white" />
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" onClick={() => setOpen(false)}><PHLogo height={28} /></a>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">{link.label}</a>
          ))}
          <a
            href={ACCELERATOR_LINK.href}
            onClick={() => posthog.capture("accelerator_nav_clicked", { location: "desktop_nav" })}
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 font-semibold text-[#4F46E5] transition-colors hover:border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"
          >
            <AcceleratorDot />
            {ACCELERATOR_LINK.label}
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden lg:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-xs sm:text-sm bg-[#3760ad] hover:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 rounded-lg transition-colors whitespace-nowrap">
            Start Free
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon d={open ? "M18 6 6 18M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-4">
          <nav className="flex flex-col gap-1">
            <a
              href={ACCELERATOR_LINK.href}
              onClick={() => {
                posthog.capture("accelerator_nav_clicked", { location: "mobile_menu" });
                setOpen(false);
              }}
              className="group mb-1 flex items-center gap-2.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-3 font-semibold text-[#4F46E5] transition-colors hover:border-[#4F46E5] hover:bg-[#4F46E5] hover:text-white"
            >
              <AcceleratorDot />
              {ACCELERATOR_LINK.label}
            </a>
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 border-t border-slate-100" />
            <a
              href={`${APP_URL}/auth/login`}
              onClick={() => setOpen(false)}
              className="px-2 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Sign in
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
