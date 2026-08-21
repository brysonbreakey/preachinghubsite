import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { APP_URL } from "@/lib/urls";

export const metadata: Metadata = {
  title: "Page Not Found — PreachingHub",
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/try", label: "Free Coaching Report" },
  { href: "/pricing", label: "Pricing" },
  { href: `${APP_URL}/auth/login`, label: "Sign in to the app" },
];

export default function NotFound() {
  return (
    <main>
      <Navbar />
      <section className="pt-40 pb-24 px-6 bg-white text-center min-h-[70vh]">
        <div className="max-w-xl mx-auto">
          <div className="text-sm font-bold tracking-wide uppercase mb-4" style={{ color: "#3760ad" }}>404</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            We couldn&apos;t find that page.
          </h1>
          <p className="text-slate-500 leading-relaxed mb-10">
            The page you&apos;re looking for may have moved or no longer exists. Here are a few places to go instead.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-left mb-10">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-100 rounded-xl px-5 py-4 text-sm font-semibold text-slate-700 hover:text-[#3760ad] transition-colors"
              >
                {link.label}
                <Icon d="M5 12h14M13 6l6 6-6 6" size={14} color="currentColor" strokeWidth={2} />
              </a>
            ))}
          </div>
          <a href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Or go back to the homepage &rarr;
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
