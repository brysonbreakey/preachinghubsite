"use client";

import { useState } from "react";
import { PHLogo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

const FEATURE_LINKS = [
  { href: "/features/sermon-builder", label: "Sermon Builder", desc: "Prep, write, and get coached in one place" },
  { href: "/features/sermon-feedback", label: "Sermon Feedback", desc: "Specific coaching on every sermon" },
  { href: "/features/preaching-dna", label: "Preaching DNA", desc: "Patterns across all your sermons" },
  { href: "/teams", label: "Teams", desc: "Prepare and preach together" },
];

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/try", label: "Free Coaching Report" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" onClick={() => setOpen(false)}><PHLogo height={28} /></a>
        <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-600">
          <div className="relative group">
            <a href="/#features" className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
              Features
              <Icon d="M6 9l6 6 6-6" size={14} strokeWidth={2} />
            </a>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 hidden group-hover:block group-focus-within:block">
              <div className="w-72 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-2">
                {FEATURE_LINKS.map((l) => (
                  <a key={l.href} href={l.href} className="block rounded-xl px-3.5 py-3 hover:bg-slate-50 transition-colors">
                    <span className="block text-sm font-semibold text-slate-900">{l.label}</span>
                    <span className="block text-xs text-slate-500 mt-0.5">{l.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden lg:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-xs sm:text-sm bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold px-3.5 py-2 sm:px-5 rounded-full transition-colors whitespace-nowrap">
            <span className="sm:hidden">Try Free</span>
            <span className="hidden sm:inline">Try Free for 14 Days</span>
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
            <p className="px-2 pt-1 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Features</p>
            {FEATURE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="my-1 border-t border-slate-100" />
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
