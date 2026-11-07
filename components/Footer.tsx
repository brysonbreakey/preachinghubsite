import { PHLogoGray } from "@/components/Logo";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

export function Footer() {
  return (
    <footer className="py-14 px-6" style={{ backgroundColor: "#111827" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-10">
          <PHLogoGray height={22} />
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium" style={{ color: "#9CA3AF" }}>
            <a href={`${APP_URL}/auth/login`} className="hover:text-white transition-colors">Sign in</a>
            <a href={SIGNUP_URL} className="hover:text-white transition-colors">Start Free Trial</a>
            <a href="/pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="/teams" className="hover:text-white transition-colors">Teams</a>
            <a href="mailto:support@preachinghub.com" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#1F2937" }}>
          <p className="text-xs" style={{ color: "#6B7280" }}>
            &copy; 2026 PreachingHub &middot; Built for preachers by preachers.
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: "#6B7280" }}>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
