import Image from "next/image";
import { PHLogo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SIGNUP_URL } from "@/lib/urls";

// ─── Cartoon mockups ──────────────────────────────────────────────────────────

function BrowserShell({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-white select-none" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="h-7 bg-slate-100 border-b border-slate-200 flex items-center px-3 gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        <div className="ml-3 flex-1 max-w-[200px] bg-white rounded border border-slate-200 h-4 flex items-center px-2 text-[9px] text-slate-400">{url}</div>
      </div>
      {children}
    </div>
  );
}

// Mini sidebar used inside mockups
function MockSidebar({ active }: { active: number }) {
  const items = ["Dashboard", "Sermon Builder", "Get Feedback", "Series", "Templates", "Research Tools", "Preaching Fingerprint"];
  return (
    <div className="w-28 bg-white border-r border-slate-100 p-2.5 shrink-0 flex flex-col gap-0.5">
      <div className="mb-2.5 px-1"><PHLogo height={13} /></div>
      {items.map((label, i) => (
        <div key={label} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[9px] ${i === active ? "bg-blue-50 text-[#3760ad] font-semibold" : "text-slate-400"}`}>
          <div className="w-1 h-1 rounded-full shrink-0" style={{ background: i === active ? "#3760ad" : "#cbd5e1" }} />
          {label}
        </div>
      ))}
    </div>
  );
}

function DashboardMockup() {
  return (
    <BrowserShell url="app.preachinghub.com">
      <div className="flex text-[10px]" style={{ minHeight: 320 }}>
        <MockSidebar active={0} />
        <div className="flex-1 p-4 overflow-hidden">
          <div className="text-sm font-bold text-slate-800 mb-0.5">Good afternoon.</div>
          <div className="text-[9px] text-slate-400 mb-4">Here&apos;s where things stand.</div>
          <div className="flex gap-3 mb-3">
            {/* Next sermon */}
            <div className="flex-1 rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between mb-1">
                <div className="text-[7px] font-bold uppercase tracking-widest text-[#3760ad]">Next Sermon</div>
                <div className="relative w-7 h-7 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-7 h-7 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="3.5"/>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3760ad" strokeWidth="3.5" strokeDasharray="44 88" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-slate-700">50%</div>
                </div>
              </div>
              <div className="font-bold text-slate-800 text-[11px] leading-tight mb-0.5">Placed in Family</div>
              <div className="text-[#3760ad] text-[9px] mb-2">Acts 2:37-46</div>
              <div className="text-[8px] text-slate-400 mb-2">9d away &middot; Up next: Creativity &rarr; Outline</div>
              <div className="h-5 px-3 bg-[#3760ad] rounded flex items-center text-white text-[8px] font-medium w-fit">Continue Prep →</div>
            </div>
            {/* Up next */}
            <div className="w-36 rounded-xl border border-slate-200 p-3">
              <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-2">Up Next</div>
              {[
                { step: "Creativity → Outline", sermon: "Placed in Family", when: "Today" },
                { step: "Editing", sermon: "Placed in Family", when: "2d" },
                { step: "Rehearsal", sermon: "Placed in Family", when: "4d" },
              ].map(({ step, sermon, when }) => (
                <div key={step} className="flex items-start gap-1.5 mb-2 last:mb-0">
                  <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ background: "#3760ad" }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-700 truncate">{step}</div>
                    <div className="text-[8px] text-slate-400 truncate">{sermon}</div>
                  </div>
                  <span className="text-[8px] shrink-0 text-slate-400">{when}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Stats */}
          <div className="flex rounded-lg border border-slate-100 bg-slate-50 py-1.5 mb-3 divide-x divide-slate-200">
            {[["2", "Preached"], ["4", "Upcoming"], ["3", "Series"]].map(([n, l]) => (
              <div key={l} className="flex-1 text-center">
                <div className="font-bold text-slate-800 text-sm">{n}</div>
                <div className="text-[8px] text-slate-400">{l}</div>
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Sermon Builder", c: "#3760ad" },
              { label: "Series", c: "#0ea5e9" },
              { label: "Get Feedback", c: "#8b5cf6" },
              { label: "Templates", c: "#10b981" },
            ].map(({ label, c }) => (
              <div key={label} className="rounded-xl border border-slate-200 p-2 flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-5 h-5 rounded-md" style={{ background: c + "18" }}>
                  <div className="w-full h-full rounded-md" style={{ background: c + "30" }} />
                </div>
                <span className="text-[8px] text-slate-500 text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function FeedbackInputMockup() {
  return (
    <BrowserShell url="app.preachinghub.com/evaluate">
      <div className="flex text-[10px]" style={{ minHeight: 300 }}>
        <MockSidebar active={2} />
        <div className="flex-1 p-4 flex gap-3 overflow-hidden">
          <div className="flex-1 flex flex-col gap-2.5">
            <div className="text-sm font-bold text-slate-800">Get Sermon Feedback</div>
            <div className="text-[9px] text-slate-400">Upload your sermon or paste your notes and receive structured coaching.</div>
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#3760ad]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3760ad" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="font-semibold text-slate-600 text-[10px]">Drop your sermon here</div>
              <div className="text-[8px] text-slate-400">Upload a file, paste your notes, or record live</div>
              <div className="flex gap-1.5 mt-1">
                {["Paste Video Link", "Paste Text", "Upload File"].map(btn => (
                  <div key={btn} className="bg-white border border-slate-200 rounded px-2 py-1 text-[8px] text-slate-600 font-medium">{btn}</div>
                ))}
              </div>
            </div>
            <div className="h-7 bg-[#3760ad] rounded-lg flex items-center justify-center text-white text-[9px] font-semibold gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Get Feedback
            </div>
          </div>
          <div className="w-32 flex flex-col gap-2.5 shrink-0">
            <div className="rounded-xl border border-slate-200 p-2.5">
              <div className="font-semibold text-slate-700 mb-1.5 text-[9px]">What you&apos;ll receive</div>
              {[
                { icon: "★", label: "Your Biggest Win" },
                { icon: "◉", label: "Category Breakdown" },
                { icon: "↑", label: "Top Growth Areas" },
                { icon: "?", label: "Reflection Questions" },
                { icon: "~", label: "Pacing Analysis" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 py-0.5 text-[8px] text-slate-500">
                  <span className="text-[#3760ad] w-3 shrink-0 font-bold">{icon}</span>{label}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-slate-200 p-2.5">
              <div className="font-semibold text-slate-700 mb-1.5 text-[9px]">Recent Reports</div>
              {["The Lost Sheep", "Grace Abounds", "Kingdom Come"].map(name => (
                <div key={name} className="text-[8px] text-slate-500 py-0.5 border-b border-slate-50 last:border-0 truncate">{name}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function FeedbackReportMockup() {
  const pacingBars = [18,22,28,35,40,38,42,45,50,48,52,58,62,60,65,68,70,65,72,75,78,80,76,74,70,68,72,74,78,82,85,80,76,70,65,60,52,45,38,28];

  const categories = [
    { label: "Textual Faithfulness", text: "Textual grounding is solid. The cultural context you drew on landed well with the passage's original setting." },
    { label: "Big Idea Clarity", text: "Big idea was stated clearly and repeated well. A few supporting points could be connected back to it more directly." },
    { label: "Introduction Strength", text: "Strong opening tension. The hook created genuine curiosity and set up the passage naturally.", strong: true },
    { label: "Movement & Structure", text: "Clear three-movement flow. The transition into the body felt slightly abrupt — consider a stronger bridge from your hook." },
    { label: "Illustration & Clarity", text: "The prodigal retelling was fresh and vivid. The secondary illustration felt slightly disconnected from the main point.", strong: true },
    { label: "Application Design", text: "Application stayed general. Push toward one concrete, specific ask your listener can act on this week." },
    { label: "Conclusion & Tension Resolution", text: "The close landed well emotionally. The call to action could be stated more directly before the final image.", strong: true },
    { label: "Gospel Faithfulness", text: "The grace moment in the third movement was genuinely moving and theologically grounded. This is your strongest area." },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/80 overflow-hidden bg-white select-none text-[10px]" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div className="bg-[#3760ad] px-5 py-3.5">
        <div className="text-[7px] font-bold uppercase tracking-widest text-blue-200 mb-1">Sermon Feedback Report</div>
        <div className="text-white font-bold text-[13px] leading-tight">Grace That Finds Us</div>
        <div className="text-blue-200 text-[8px] mt-0.5">Luke 15:11-32 &middot; Jul 6, 2026 &middot; 38 min</div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Your Biggest Win */}
        <div className="rounded-xl bg-green-50 border border-green-100 p-3">
          <div className="text-[7px] font-bold uppercase tracking-widest text-green-600 mb-1">Your Biggest Win</div>
          <div className="text-[9px] text-slate-700 leading-snug font-medium">Gospel clarity in the third movement.</div>
          <div className="text-[8px] text-slate-500 leading-snug mt-0.5">Your gospel turn was theologically grounded and emotionally resonant. Protect this instinct — it&apos;s the heart of your preaching.</div>
        </div>

        {/* Category Breakdown */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category Breakdown</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {categories.map(({ label, text }) => (
              <div key={label} className="rounded-lg border border-slate-100 bg-slate-50 p-2">
                <div className="font-semibold text-[#3760ad] mb-0.5 text-[8px]">{label}</div>
                <div className="text-[7.5px] text-slate-500 leading-snug">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Growth Areas + Questions side by side */}
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Top Growth Areas</div>
            {[
              { label: "Application", tip: "Give one concrete, specific action your listener can take this week — tied directly to the text." },
              { label: "Engagement", tip: "Plan a deliberate re-engagement moment around the 20-minute mark to recapture attention." },
            ].map(({ label, tip }) => (
              <div key={label} className="flex gap-1.5 mb-2 p-2 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="w-0.5 bg-amber-400 rounded-full shrink-0" />
                <div>
                  <div className="font-semibold text-slate-700 text-[8px]">{label}</div>
                  <div className="text-[7.5px] text-slate-500 leading-snug mt-0.5">{tip}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-48 shrink-0">
            <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Questions Worth Considering</div>
            {[
              "What would it look like for someone in your congregation to live this text out by Thursday?",
              "Where did you feel most alive while preaching? What does that tell you about your calling?",
              "What single sentence best captures what you wanted people to leave with?",
            ].map((q, i) => (
              <div key={i} className="flex gap-1.5 mb-2 last:mb-0">
                <div className="w-3.5 h-3.5 rounded-full bg-[#3760ad]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#3760ad] text-[6px] font-bold">{i + 1}</span>
                </div>
                <div className="text-[7.5px] text-slate-500 leading-snug italic">{q}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pacing Analysis */}
        <div>
          <div className="text-[7px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Pacing Analysis <span className="text-slate-300 font-normal normal-case tracking-normal">(video &amp; audio submissions)</span></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-end gap-px h-12 mb-1.5">
              {pacingBars.map((h, i) => {
                const pct = h / 100;
                const color = pct > 0.72 ? "#3760ad" : pct > 0.45 ? "#93c5fd" : "#dbeafe";
                return <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, backgroundColor: color }} />;
              })}
            </div>
            <div className="flex justify-between text-[7px] text-slate-300 mb-2">
              <span>0:00</span><span>19:00</span><span>38:00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {[{ c: "#3760ad", l: "High" }, { c: "#93c5fd", l: "Moderate" }, { c: "#dbeafe", l: "Low" }].map(({ c, l }) => (
                  <div key={l} className="flex items-center gap-1 text-[7px] text-slate-400">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: c }} />{l}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 text-[7px]">
                {[["Avg pace", "145 wpm"], ["Peak", "Min 28–35"], ["Pauses", "7"]].map(([k, v]) => (
                  <div key={k}><span className="text-slate-400">{k} </span><span className="font-semibold text-slate-600">{v}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative pt-40 pb-24 px-6 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2c4a9e 45%, #3760ad 100%)" }}
    >
      {/* Decorative glow orbs */}
      <div className="absolute top-[-10%] left-[-8%] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{ backgroundColor: "#3760ad" }} />
      <div className="absolute bottom-[-18%] right-[-10%] w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />

      <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div className="text-center lg:text-left min-w-0">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] inline-block"></span>
            14-Day Free Trial &middot; No Card Required
          </div>
          <h1 className="hero-h1 text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Preach better.<br />Every week.
          </h1>
          <p className="hero-sub text-xl text-blue-100/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            PreachingHub gives you structured sermon prep, coaching-quality feedback on every message, and team tools built for the rhythm of weekly ministry.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-3">
            <a href={SIGNUP_URL} className="cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0b1230] font-bold px-7 py-4 rounded-full text-base shadow-lg bg-white hover:bg-blue-50">
              Start Your Free Trial
              <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#0b1230" strokeWidth={2.5} />
            </a>
            <a href="#features" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white/80 hover:text-white border border-white/20 hover:border-white/40 font-semibold px-7 py-4 rounded-full text-base transition-colors">
              See what&apos;s included
            </a>
          </div>
          <p className="hero-cta text-xs text-blue-100/60 mb-6" style={{ animationDelay: "0.48s" }}>No card required.</p>
          <div className="hero-cta flex flex-wrap items-center justify-center lg:justify-start gap-2" style={{ animationDelay: "0.52s" }}>
            {["Customizable workflows", "AI coaching", "Proven frameworks"].map((tag) => (
              <span key={tag} className="text-xs text-blue-100/70 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Mockup */}
        <div className="hero-mockup relative min-w-0">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-10"
            style={{ background: "linear-gradient(135deg, #3760ad, #7c3aed)" }}
          />
          <div className="relative rotate-2 hover:rotate-0 transition-transform duration-500">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem statement ──────────────────────────────────────────────────────────

function ProblemStatement() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1" data-animate="fade-up">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#3760ad" }}>The Problem</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            You just preached your heart out. Then what?
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed mb-4">
            Most preachers finish a sermon and immediately start the next one. No feedback. No coaching. No growth.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed mb-4">
            Their process is unclear, their upcoming sermons are scattered across multiple tools, and worst of all, they feel like they&apos;re doing it all alone.
          </p>
          <p className="text-lg font-semibold text-slate-900 leading-relaxed">
            PreachingHub is here to help.
          </p>
        </div>
        <div className="order-1 md:order-2" data-animate="fade-up" data-delay="100">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50" style={{ aspectRatio: "4/5" }}>
            <Image src="/images/stock/podium-bible-phone.jpg" alt="A pastor preaching" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────

function Features() {
  const bigFeature = {
    icon: ["M13 2 3 14h9l-1 8 10-12h-9z"],
    label: "Instant Sermon Feedback",
    title: "Expert coaching on every sermon",
    body: "Upload a recording, your notes, or even a YouTube link and get a detailed coaching report across seven preaching categories — strengths, growth areas, reflection questions, and pacing analysis.",
    accent: "#3760ad", bg: "#eff6ff",
  };

  const smallFeatures = [
    {
      icon: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
      label: "Sermon Builder",
      title: "A full word processor integrated with your workflow",
      body: "Use our prep landmarks or insert your own to track your progress from first observation to final notes.",
      accent: "#0ea5e9", bg: "#f0f9ff",
      visual: (
        <div className="rounded-lg border border-slate-200 overflow-hidden flex bg-white" style={{ height: 132 }}>
          {/* mini landmarks rail */}
          <div className="w-8 bg-slate-50 border-r border-slate-100 p-2 shrink-0 flex flex-col items-center gap-1.5">
            {[true, true, true, true, false, false, false, false].map((done, i) => (
              <div key={i} className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: done ? "#0ea5e9" : "#e2e8f0" }} />
            ))}
          </div>
          {/* mini document / editor */}
          <div className="flex-1 p-3 min-w-0">
            <div className="text-[9px] font-bold text-slate-700 underline decoration-slate-300 mb-2">Grace That Finds Us</div>
            <div className="text-[7.5px] text-slate-500 leading-snug mb-1.5">
              Most of us know what it feels like to walk away — and wonder if we can ever come home.
            </div>
            <div className="text-[7.5px] text-slate-500 leading-snug">
              <span className="font-semibold text-slate-700">The father doesn&apos;t wait for an apology.</span> He runs.
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: ["M21 8v13H3V8", "M1 3h22v5H1z", "M10 12h4"],
      label: "Stay Organized",
      title: "All your sermons in one place",
      body: "Keep track of every sermon you're preparing so you are never showing up Monday morning with a blank doc.",
      accent: "#10b981", bg: "#f0fdf4",
      visual: (
        <div className="space-y-2.5">
          {[
            { title: "Grace That Finds Us", frac: "8/8", pct: 100 },
            { title: "The Lost Sheep", frac: "3/8", pct: 37 },
            { title: "The Lost Coin", frac: "1/8", pct: 12 },
          ].map((s) => (
            <div key={s.title} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <Icon d={["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"]} size={11} color="#64748b" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-slate-700 truncate mb-1">{s.title}</div>
                <div className="h-1 bg-slate-100 rounded-full">
                  <div className="h-1 rounded-full" style={{ width: `${s.pct}%`, backgroundColor: "#10b981" }} />
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{s.frac}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Everything a preacher needs.<br />Nothing they don&apos;t.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Built specifically for the weekly discipline of sermon preparation and preaching development.
          </p>
        </div>

        {/* Big feature */}
        <div
          className="feature-card rounded-2xl border border-slate-200 p-8 sm:p-10 mb-6 grid md:grid-cols-2 gap-8 md:items-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)" }}
          data-animate="fade-up"
        >
          <div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-white" style={{ border: `1px solid ${bigFeature.accent}25` }}>
              <Icon d={bigFeature.icon} size={20} color={bigFeature.accent} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: bigFeature.accent }}>{bigFeature.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">{bigFeature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{bigFeature.body}</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative scale-[0.85] origin-center md:origin-right">
              <div className="absolute -bottom-8 -right-8 scale-[0.5] origin-bottom-right rotate-2" style={{ zIndex: 0 }}>
                <FeedbackReportMockup />
              </div>
              <div className="relative" style={{ zIndex: 1 }}>
                <FeedbackInputMockup />
              </div>
            </div>
          </div>
        </div>

        {/* Supporting features */}
        <div className="grid md:grid-cols-2 gap-6">
          {smallFeatures.map((f, i) => (
            <div key={f.label} className="feature-card bg-white rounded-2xl border border-slate-200 p-7 overflow-hidden" data-animate="fade-up" data-delay={String(i * 100)}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: f.bg, border: `1px solid ${f.accent}25` }}>
                <Icon d={f.icon} size={20} color={f.accent} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: f.accent }}>{f.label}</p>
              <h3 className="text-lg font-semibold text-slate-900 mb-3 leading-snug">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{f.body}</p>
              {f.visual}
            </div>
          ))}
        </div>

        <p className="text-center text-sm sm:text-base font-semibold text-slate-600 mt-12 tracking-wide">
          Sermon Templates &bull; Idea Bank &bull; Series Builder &bull; Live Recording &bull; Sermon Organizer &bull; Customizable Prep Process &bull; Research Tool Library
        </p>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight" data-animate="fade-up">What preachers are saying</h2>
        <p className="text-lg text-slate-500 mb-16 max-w-xl mx-auto" data-animate="fade-up" data-delay="100">Preachers using PreachingHub to sharpen their craft week after week.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { photo: "/images/testimonials/benjamin-jones.jpg", name: "Benjamin Jones", location: "Pasadena, CA", quote: "PreachingHub has become my central place for sermon preparation and development, and I genuinely believe every preacher would benefit from using this tool." },
            { photo: "/images/testimonials/Cody-Smith.jpeg", name: "Cody Smith", location: "Tallahassee, FL", quote: "The feedback feature alone has been worth it, giving me real confidence that my message is ready before I ever step into the pulpit!" },
            { photo: "/images/testimonials/Chris-Zauner.jpeg", name: "Chris Zauner", location: "Eugene, OR", quote: "It's like having a preaching coach in my pocket." },
          ].map(({ photo, name, location, quote }, i) => (
            <div key={name} className="testimonial-card bg-white rounded-2xl border border-slate-200 p-7 text-left" data-animate="fade-up" data-delay={String(i * 120)}>
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">&ldquo;{quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image src={photo} alt={name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── About the company ─────────────────────────────────────────────────────────

function AboutCompany() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div data-animate="fade-up">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50" style={{ aspectRatio: "4/5" }}>
            <Image src="/images/founder/founder-blazer.jpg" alt="A pastor preaching" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
          </div>
        </div>
        <div data-animate="fade-up" data-delay="100">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#3760ad" }}>Why PreachingHub</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            The sermon belongs to the preacher.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed mb-4">
            Most sermon software either writes the sermon for you or just helps you stay organized. Neither builds a better preacher.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed mb-4">
            PreachingHub was built on a simpler conviction: the sermon belongs to the preacher, and the fastest way to grow isn&apos;t a shortcut &mdash; it&apos;s quality feedback and expert coaching. Built by real preaching coaches, PreachingHub evaluates your sermon across high-impact categories &mdash; structure, introduction, clarity, application, gospel, and more &mdash; to make sure it lands every time.
          </p>
          <p className="text-lg text-slate-500 leading-relaxed mb-8">
            It won&apos;t generate an outline, write your sermon, or hand you application points. It will coach you into the best preacher you can be. Feedback tool, sermon builder, templates, resource library, idea bank, series builder, sermon organizer, customizable prep process &mdash; everything here is built to take your preaching to a new level.
          </p>
          <a href={SIGNUP_URL} className="inline-flex items-center justify-center gap-2 text-white font-semibold px-6 py-4 rounded-xl text-base transition-colors" style={{ backgroundColor: "#3760ad" }}>
            Start Your Free Trial
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section
      className="relative py-24 px-6 overflow-hidden text-center"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2c4a9e 45%, #3760ad 100%)" }}
    >
      {/* Decorative glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{ backgroundColor: "#3760ad" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />

      <div className="relative max-w-2xl mx-auto" data-animate="fade-up">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] inline-block"></span>
          14-Day Free Trial &middot; No Card Required
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Ready to take your preaching to the next level?
        </h2>
        <p className="text-xl text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
          Join preachers who use PreachingHub to prepare with more clarity, preach with more confidence, and grow every single week.
        </p>
        <a href={SIGNUP_URL} className="cta-btn inline-flex items-center justify-center gap-2 text-[#0b1230] font-bold px-8 py-4 rounded-full text-base shadow-lg bg-white hover:bg-blue-50">
          Start Your Free Trial
          <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#0b1230" strokeWidth={2.5} />
        </a>
        <p className="text-blue-100/60 text-xs mt-5">No credit card required. Plans start at $29/month.</p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ProblemStatement />
      <Features />
      <Testimonials />
      <AboutCompany />
      <FinalCTA />
      <Footer />
    </main>
  );
}
