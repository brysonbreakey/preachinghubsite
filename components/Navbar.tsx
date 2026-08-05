import { PHLogo } from "@/components/Logo";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/"><PHLogo height={28} /></a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="/#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="/compare" className="hover:text-slate-900 transition-colors">Compare</a>
          <a href="/teams" className="hover:text-slate-900 transition-colors">Teams</a>
          <a href="/try" className="hover:text-slate-900 transition-colors">Free Coaching Report</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden md:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-xs sm:text-sm bg-[#3760ad] hover:bg-blue-700 text-white font-medium px-3 py-2 sm:px-4 rounded-lg transition-colors whitespace-nowrap">
            <span className="hidden sm:inline">Start Your </span>Free Trial
          </a>
        </div>
      </div>
    </header>
  );
}
