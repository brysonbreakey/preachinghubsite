import { PHLogoGray } from "@/components/Logo";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

export function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <PHLogoGray height={20} />
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href={`${APP_URL}/auth/login`} className="hover:text-white transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="hover:text-white transition-colors">Start Your Free Trial</a>
          <a href="mailto:support@preachinghub.com" className="hover:text-white transition-colors">Support</a>
        </div>
        <p className="text-slate-500 text-xs">&copy; 2026 PreachingHub. Built for preachers by preachers.</p>
      </div>
    </footer>
  );
}
