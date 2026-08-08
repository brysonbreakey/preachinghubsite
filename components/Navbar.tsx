"use client";

import { useState } from "react";
import { PHLogo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

const NAV_LINKS = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/compare", label: "Compare" },
  { href: "/teams", label: "Teams" },
  { href: "/try", label: "Free Coaching Report" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" onClick={() => setOpen(false)}><PHLogo height={28} /></a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-slate-900 transition-colors">{link.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden md:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-xs sm:text-sm bg-[#3760ad] hover:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 rounded-lg transition-colors whitespace-nowrap">
            <span className="hidden sm:inline">Start Your </span>Free Trial
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <Icon d={open ? "M18 6 6 18M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"} size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4">
          <nav className="flex flex-col gap-1">
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
