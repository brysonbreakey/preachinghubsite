const APP_URL = "https://app.preachinghub.com";
const SIGNUP_URL = `${APP_URL}/auth/signup`;

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="font-semibold text-slate-900 text-lg tracking-tight">PreachingHub</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href={`${APP_URL}/auth/login`} className="hidden md:block text-sm text-slate-600 hover:text-slate-900 transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
            Start free trial
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
          14-day free trial &middot; No credit card required
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.08] tracking-tight mb-6" style={{ fontFamily: "Georgia, serif" }}>
          Preach better.<br />Every week.
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          PreachingHub gives you structured sermon prep, coaching-quality feedback on every message, and team tools built for the rhythm of weekly ministry.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={SIGNUP_URL}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-4 rounded-xl text-base transition-colors shadow-sm shadow-blue-200"
          >
            Get feedback on your last sermon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            See how it works &darr;
          </a>
        </div>

        <p className="text-xs text-slate-400 mt-5">Free for 14 days, then $19.99/month. Cancel any time.</p>
      </div>

      <div className="max-w-5xl mx-auto mt-16">
        <div className="rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden bg-slate-50">
          <div className="h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="ml-4 flex-1 max-w-xs bg-white rounded border border-slate-200 h-4 text-[9px] text-slate-400 flex items-center px-2">app.preachinghub.com</div>
          </div>
          <div className="aspect-[16/9] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
            <p className="text-slate-400 text-sm font-medium">[ App screenshot ]</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Used by preachers at churches across the country</p>
        <div className="flex items-center justify-center gap-10 flex-wrap opacity-40">
          {["Grace City", "Bethel Midtown", "Every Nation", "Reflection Church", "City Church"].map(name => (
            <span key={name} className="text-slate-600 font-semibold text-sm">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload your last sermon",
      body: "Paste your notes, drop in a recording, or link a YouTube video. PreachingHub works with whatever you have — manuscript, bullet points, or audio.",
    },
    {
      num: "02",
      title: "Get coaching-quality feedback",
      body: "Receive detailed feedback across eight preaching dimensions: structure, content, application, illustration, gospel, delivery, engagement, and clarity. Real scores. Specific growth areas. Not generic notes.",
    },
    {
      num: "03",
      title: "Prep your next sermon with a clear system",
      body: "Move through an eight-step prep workflow — from first observation to final rehearsal — with progress tracking, deadlines, and your full series history in one place.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            From last Sunday to next Sunday
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Most preachers finish a sermon and immediately start the next one with no feedback loop. PreachingHub closes that gap.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num}>
              <div className="text-5xl font-bold text-blue-100 mb-4 leading-none" style={{ fontFamily: "Georgia, serif" }}>{step.num}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      label: "Instant Sermon Feedback",
      title: "Coaching on every sermon, not just the ones you pay for",
      body: "Upload a recording or paste your manuscript and get a detailed critique with scores across eight preaching categories — strengths, growth areas, reflection questions, and pacing analysis. In under a minute.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
    {
      label: "Sermon Builder",
      title: "A prep system built around the way preachers actually work",
      body: "Eight guided steps from first observation to final notes. Track your progress, set prep deadlines, organize by series, and keep your full preaching library in one place. No more lost outlines.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
      ),
    },
    {
      label: "Coaching Portal",
      title: "For coaches who want visibility without the back-and-forth",
      body: "Coaches review sermon notes, leave comments, track prep progress, and log coaching sessions — all inside PreachingHub. Share notes with your coach with a single toggle.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      label: "Team Tools",
      title: "Lead your preaching team from a single dashboard",
      body: "Assign sermons to team members, manage the preaching calendar, track everyone's prep progress, and keep the Sunday schedule in one place. Built for lead pastors and preaching directors.",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Everything a preacher needs.<br />Nothing they don&apos;t.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Built specifically for the weekly discipline of sermon preparation and preaching development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.label} className="bg-white rounded-2xl border border-slate-200 p-7 hover:shadow-md hover:shadow-slate-100 transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-5">
                {f.icon}
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">{f.label}</p>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
          See it in action
        </h2>
        <p className="text-lg text-slate-500 mb-12 max-w-xl mx-auto">
          Watch how a preacher goes from Sunday&apos;s sermon to a full feedback report and a prep plan for next week &mdash; in under five minutes.
        </p>
        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-lg shadow-slate-100 aspect-video bg-slate-50 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
          <p className="text-slate-400 text-sm font-medium">[ Explainer video coming soon ]</p>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const included = [
    "Unlimited sermon feedback reports",
    "Sermon Builder with 8-step prep workflow",
    "Series management & preaching history",
    "Sermon templates (built-in + custom)",
    "Coaching portal & session tracking",
    "Team dashboard & preaching calendar",
    "Sermon assignment for team members",
    "Idea Bank for illustrations & notes",
  ];

  return (
    <section id="pricing" className="py-24 px-6 bg-slate-50">
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Simple pricing
        </h2>
        <p className="text-lg text-slate-500 mb-12">
          One plan. Everything included. Cancel any time.
        </p>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-left">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-5xl font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>$19.99</span>
            <span className="text-slate-500 mb-2">/month</span>
          </div>
          <p className="text-sm text-blue-600 font-semibold mb-8">Start free for 14 days &mdash; no credit card required</p>

          <ul className="space-y-3 mb-8">
            {included.map(item => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <a
            href={SIGNUP_URL}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors"
          >
            Start your free trial
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <p className="text-xs text-slate-400 text-center mt-4">14 days free. Then $19.99/month. Cancel any time.</p>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: "Georgia, serif" }}>
          What preachers are saying
        </h2>
        <p className="text-lg text-slate-500 mb-16 max-w-xl mx-auto">
          Preachers using PreachingHub to sharpen their craft week after week.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-slate-50 rounded-2xl border border-slate-100 p-7 text-left">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                &ldquo;[ Testimonial coming soon ]&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Pastor Name</p>
                  <p className="text-xs text-slate-400">Church Name</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 px-6 bg-blue-600">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
          Your next sermon deserves real feedback.
        </h2>
        <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto">
          Join preachers who use PreachingHub to prepare with more clarity, preach with more confidence, and grow every single week.
        </p>
        <a
          href={SIGNUP_URL}
          className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-semibold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
        >
          Get feedback on your last sermon &mdash; free for 14 days
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <p className="text-blue-200 text-xs mt-5">No credit card required. $19.99/month after trial.</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">PreachingHub</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a href={`${APP_URL}/auth/login`} className="hover:text-white transition-colors">Sign in</a>
          <a href={SIGNUP_URL} className="hover:text-white transition-colors">Start free trial</a>
          <a href="mailto:support@preachinghub.com" className="hover:text-white transition-colors">Support</a>
        </div>
        <p className="text-slate-500 text-xs">&copy; 2026 PreachingHub. Built for preachers by preachers.</p>
      </div>
    </footer>
  );
}

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Features />
      <VideoSection />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
