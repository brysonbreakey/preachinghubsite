import Image from "next/image";
import { PHLogo } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PricingTeaser } from "@/components/PricingTeaser";
import { SampleReportShowcase } from "@/components/SampleReportShowcase";
import { FeedbackReportMockup } from "@/components/FeedbackReportMockup";
import { SIGNUP_URL } from "@/lib/urls";
import { ScaledMockup } from "@/components/ScaledMockup";
import { TrialDisclosure, TRIAL_CTA_LABEL } from "@/components/TrialDisclosure";
import { FaqSection } from "@/components/FaqSection";
import { HOME_FAQ_IDS } from "@/lib/faqs";

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

function MockIcon({ d }: { d: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d={d} />
    </svg>
  );
}

const MOCK_NAV_TOP = [
  { label: "Search", d: "M21 21l-4.3-4.3M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" },
  { label: "Dashboard", d: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z", active: true },
  { label: "Sermons", d: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5" },
  { label: "Instant Coaching", d: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" },
  { label: "Calendar", d: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" },
  { label: "Preaching DNA", d: "M5 4c4 4 10 4 14 0M5 20c4-4 10-4 14 0M5 12h14" },
  { label: "Training", d: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 8l6 4-6 4z" },
];
const MOCK_NAV_BOTTOM = [
  { label: "Teams", d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { label: "Settings", d: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M2 12h3M19 12h3" },
];

function DashboardMockup() {
  return (
    <BrowserShell url="app.preachinghub.com">
      <div className="flex text-[10px] bg-white" style={{ height: 430 }}>
        {/* Sidebar */}
        <div className="w-[116px] shrink-0 border-r border-slate-100 p-2.5 flex flex-col">
          <div className="mb-3 px-1"><PHLogo height={13} /></div>
          <div className="flex flex-col gap-0.5">
            {MOCK_NAV_TOP.map(({ label, d, active }) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[8.5px] font-medium ${active ? "text-white shadow-sm" : "text-slate-500"}`}
                style={active ? { background: "#5b5ce6" } : undefined}
              >
                <MockIcon d={d} />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-0.5">
            {MOCK_NAV_BOTTOM.map(({ label, d }) => (
              <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 text-[8.5px] font-medium text-slate-500">
                <MockIcon d={d} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 p-4 overflow-hidden bg-[#fbfbfd]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[19px] font-extrabold text-slate-900 leading-none tracking-[-0.04em]">Good morning.</div>
              <div className="text-[8.5px] text-slate-500 mt-1">Here&apos;s where things stand.</div>
            </div>
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[8px] font-semibold text-white" style={{ background: "#0f1530" }}>
              <span className="text-[10px] leading-none">+</span> New Sermon
            </div>
          </div>

          {/* Next sermon */}
          <div className="rounded-2xl border border-slate-100 bg-white p-3 mb-2.5 shadow-sm">
            <div className="text-[6.5px] font-bold uppercase tracking-[0.2em] text-slate-500 leading-relaxed">Next Sermon<br />32 days away</div>
            <div className="text-[15px] font-extrabold text-slate-900 leading-tight tracking-[-0.03em] mt-1.5">Jesus Loves You</div>
            <div className="text-[9px] font-semibold text-slate-500 mb-2.5">John 3:16</div>
            <div className="relative h-[3px] rounded-full bg-slate-100 mb-1.5">
              <div className="absolute left-0 top-0 h-full w-[16%] rounded-full" style={{ background: "linear-gradient(90deg,#a5b4fc,#5b5ce6)" }} />
              {[16, 33, 50, 66, 83, 100].map((l, i) => (
                <div key={l} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border bg-white" style={{ left: `${l}%`, borderColor: i === 0 ? "#5b5ce6" : "#cbd5e1" }} />
              ))}
            </div>
            <div className="flex justify-between text-[6.5px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-2">
              <span>Up next: <span className="text-slate-900">Read Passage</span></span>
              <span>0/6 completed</span>
            </div>
            <div className="text-[8.5px] font-bold" style={{ color: "#4f46e5" }}>Continue Prep →</div>
          </div>

          {/* Insights + stats */}
          <div className="flex gap-2.5">
            <div className="flex-1 min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-extrabold text-slate-900 tracking-[-0.03em]">Coaching Insights</div>
                  <div className="text-[7.5px] text-slate-500 mb-2">Derived from your Preaching DNA Report</div>
                </div>
                <div className="text-[6px] font-bold uppercase tracking-[0.15em] pb-0.5 border-b" style={{ color: "#4f46e5", borderColor: "#c7d2fe" }}>Full report</div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-[6.5px] font-bold uppercase tracking-[0.15em] text-emerald-600 mb-1">Signature strength</div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-2 mb-2">
                    <div className="text-[8.5px] font-semibold text-emerald-800 leading-snug mb-0.5">Exegetical architecture that earns trust</div>
                    <div className="text-[7px] text-emerald-700/80 leading-snug">You build the point from the text&apos;s own structure, so listeners arrive at Scripture already inside the question it answers.</div>
                  </div>
                  <div className="text-[6.5px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: "#4f46e5" }}>Growth area</div>
                  <div className="rounded-xl border p-2" style={{ borderColor: "#c7d2fe", background: "#eef2ff" }}>
                    <div className="text-[8.5px] font-semibold leading-snug mb-0.5" style={{ color: "#3730a3" }}>Landing the conclusion with one clear call</div>
                    <div className="text-[7px] leading-snug" style={{ color: "#4338ca" }}>Your closing gathers several threads. Choosing one invitation helps it stick.</div>
                  </div>
                </div>
                <div className="w-[38%] shrink-0 rounded-xl p-2 flex flex-col" style={{ background: "#0b1020" }}>
                  <div className="text-[5.5px] font-bold uppercase tracking-[0.18em] text-slate-400 mb-1.5">AI coach focus</div>
                  <div className="text-[7.5px] italic leading-snug text-slate-100">&ldquo;You&apos;re at an inflection point where your preparation and your instinct for illustration are starting to reinforce each other.&rdquo;</div>
                </div>
              </div>
            </div>
            <div className="w-[124px] shrink-0 flex flex-col gap-2.5">
              <div className="flex rounded-2xl border border-slate-100 bg-white py-2 shadow-sm">
                {[["14", "Preached"], ["1", "Upcoming"], ["4", "Series"]].map(([n, l]) => (
                  <div key={l} className="flex-1 text-center">
                    <div className="text-[13px] font-extrabold text-slate-900 leading-none tracking-[-0.04em]">{n}</div>
                    <div className="text-[5.5px] font-bold uppercase tracking-[0.04em] text-slate-500 mt-1">{l}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white p-2.5 shadow-sm">
                <div className="text-[10px] font-extrabold text-slate-900 tracking-[-0.03em] mb-1.5">Next Steps</div>
                {[["Read Passage", "Jesus Loves You", "Today"], ["Personal Study", "Jesus Loves You", "3d"]].map(([t, sub, when]) => (
                  <div key={t} className="flex items-start gap-1 mb-1.5 last:mb-0">
                    <div className="w-1 h-1 rounded-full bg-slate-300 mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[8px] font-bold text-slate-900 truncate">{t}</div>
                      <div className="text-[6.5px] text-slate-500 truncate">{sub}</div>
                    </div>
                    <span className="text-[6.5px] font-bold uppercase text-slate-400">{when}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}

function FeedbackInputMockup() {
  const tiles = [
    { label: "Paste Text", bg: "#eff6ff", c: "#3b82f6", d: "M4 7V4h16v3M9 20h6M12 4v16", on: true },
    { label: "YouTube", bg: "#fef2f2", c: "#ef4444", d: "M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM10 9.5l4 2.5-4 2.5z" },
    { label: "Upload File", bg: "#eef2ff", c: "#6366f1", d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" },
    { label: "Record", bg: "#fff7ed", c: "#f97316", d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3" },
  ];
  const receive = [
    { label: "Biggest Wins", bg: "#faf5ff", c: "#a855f7", d: "M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" },
    { label: "Category Breakdown", bg: "#eff6ff", c: "#3b82f6", d: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" },
    { label: "How to Grow", bg: "#ecfdf5", c: "#10b981", d: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6" },
    { label: "Questions to Consider", bg: "#eef2ff", c: "#6366f1", d: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" },
  ];
  return (
    <BrowserShell url="app.preachinghub.com/evaluate">
      <div className="flex text-[10px] bg-white" style={{ height: 360, width: 600 }}>
        {/* Sidebar */}
        <div className="w-[104px] shrink-0 border-r border-slate-100 p-2.5 flex flex-col">
          <div className="mb-3 px-1"><PHLogo height={13} /></div>
          <div className="flex flex-col gap-0.5">
            {MOCK_NAV_TOP.map(({ label, d }) => {
              const active = label === "Instant Coaching";
              return (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[8px] font-medium ${active ? "text-white shadow-sm" : "text-slate-500"}`}
                  style={active ? { background: "#5b5ce6" } : undefined}
                >
                  <MockIcon d={d} />
                  {label}
                </div>
              );
            })}
          </div>
          <div className="mt-auto flex flex-col gap-0.5">
            {MOCK_NAV_BOTTOM.map(({ label, d }) => (
              <div key={label} className="flex items-center gap-1.5 px-2 py-1.5 text-[8px] font-medium text-slate-500">
                <MockIcon d={d} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 p-3.5 overflow-hidden bg-[#fbfbfd]">
          <div className="text-[18px] font-black text-slate-900 leading-none tracking-[-0.05em]">Get Sermon Feedback</div>
          <div className="text-[7.5px] text-slate-500 font-medium mt-1.5 mb-3 max-w-[260px] leading-snug">Upload your sermon or paste your notes to receive structured, premium coaching across seven key areas.</div>
          <div className="flex gap-2.5 items-start">
            <div className="flex-1 min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <div className="text-[5.5px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Sermon Name <span className="normal-case tracking-normal font-normal">(optional)</span></div>
              <div className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5 text-[7.5px] text-slate-400 mb-2.5">e.g. Presence Changes Everything</div>
              <div className="grid grid-cols-4 gap-1 mb-2.5">
                {tiles.map(({ label, bg, c, d, on }) => (
                  <div key={label} className={`flex flex-col items-center gap-1 ${on ? "" : "opacity-50"}`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: bg, color: c }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
                    </div>
                    <span className={`text-[6.5px] font-bold ${on ? "text-slate-900" : "text-slate-500"}`}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[7.5px] text-slate-400 h-[58px] mb-2">Paste your notes, outline, or transcript here…</div>
              <div className="grid grid-cols-2 gap-1 mb-2.5 text-[6px] font-bold uppercase tracking-wider text-center">
                <div className="rounded-full bg-white shadow-sm border border-slate-100 py-1" style={{ color: "#4f46e5" }}>Future sermon</div>
                <div className="rounded-full bg-slate-100 py-1 text-slate-500">Past sermon</div>
              </div>
              <div className="rounded-full py-1.5 flex items-center justify-center gap-1 text-[7px] font-bold uppercase tracking-widest text-white" style={{ background: "#334155" }}>
                <MockIcon d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /> Generate Coaching Report
              </div>
            </div>

            <div className="w-[150px] shrink-0 flex flex-col gap-2">
              <div className="rounded-2xl p-3 relative overflow-hidden text-white" style={{ background: "linear-gradient(135deg,#4f46e5,#6366f1)" }}>
                <div className="w-6 h-6 rounded-lg bg-white/20 mb-1.5" />
                <div className="text-[9px] font-black leading-tight tracking-[-0.02em]">Personalized Coaching Profile</div>
                <div className="text-[6px] text-white/80 mt-1 leading-snug">Calibrate our AI to your context, tradition, and preaching style.</div>
                <div className="mt-2 rounded-lg bg-white text-center py-1 text-[5.5px] font-bold uppercase tracking-widest" style={{ color: "#4f46e5" }}>Set up your profile →</div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full border-[7px] border-white/10" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <div className="text-[5.5px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5">What you&apos;ll receive</div>
                {receive.map(({ label, bg, c, d }) => (
                  <div key={label} className="flex items-center gap-1.5 mb-1 last:mb-0">
                    <div className="w-4 h-4 rounded-md flex items-center justify-center shrink-0" style={{ background: bg, color: c }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
                    </div>
                    <span className="text-[6.5px] font-bold text-slate-800 truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserShell>
  );
}


// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-6 overflow-hidden"
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
            14-Day Free Trial. Cancel Anytime.
          </div>
          <h1 className="hero-h1 font-[family-name:var(--font-inter)] text-[clamp(2.25rem,9vw,3.75rem)] font-extrabold text-white leading-[1.08] tracking-[-0.04em] mb-6">
            Preach with more clarity, confidence, and{" "}
            <span className="font-[family-name:var(--font-lora)] italic font-semibold tracking-[-0.01em] text-[1.08em] leading-none text-white">impact.</span>{" "}
            <span className="whitespace-nowrap">Every week.</span>
          </h1>
          <p className="hero-sub text-xl text-blue-100/80 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
            Prepare your sermons, preach with confidence, and get personalized feedback to keep improving every week. All in one place.
          </p>
          <div className="hero-cta flex flex-col items-center lg:items-start">
            <div className="flex flex-col items-center gap-2 w-full sm:w-fit">
              <a href={SIGNUP_URL} className="cta-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 text-[#0b1230] font-bold px-4 sm:px-7 py-4 rounded-full text-[15px] sm:text-base whitespace-nowrap shadow-lg bg-white hover:bg-blue-50">
                {TRIAL_CTA_LABEL}
                <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#0b1230" strokeWidth={2.5} />
              </a>
              <TrialDisclosure stacked className="text-xs text-blue-100/75 text-center leading-relaxed" />
            </div>
          </div>
        </div>

        {/* Mockup */}
        <div className="hero-mockup relative min-w-0">
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-10"
            style={{ background: "linear-gradient(135deg, #3760ad, #7c3aed)" }}
          />
          <div className="relative rotate-2 hover:rotate-0 transition-transform duration-500">
            <ScaledMockup>
              <DashboardMockup />
            </ScaledMockup>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Problem statement ──────────────────────────────────────────────────────────

function ProblemStatement() {
  return (
    <section className="py-16 sm:py-24 px-6 bg-white">
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
    icon: ["m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.8 1.9a2 2 0 0 1 1.288 1.287L12 21l1.9-5.8a2 2 0 0 1 1.287-1.288L21 12l-5.8-1.9a2 2 0 0 1-1.288-1.287Z"],
    label: "Instant Sermon Feedback",
    title: "Expert coaching on every sermon",
    body: "Every sermon you preach is a chance to grow. Upload a recording, your notes, or even a YouTube link, and get expert coaching — built by real preaching coaches — to help you preach with more clarity, confidence, and impact, sermon after sermon.",
    features: ["Detailed Coaching Report", "Voice Memo from Your AI Coach", "Pacing Analysis", "Tone/Volume Analyzer", "Face/Body Language Analyzer", "Full Sermon Transcript"],
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
    <section id="features" className="py-16 sm:py-24 px-6 bg-slate-50">
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
          <div className="min-w-0">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 bg-white" style={{ border: `1px solid ${bigFeature.accent}25` }}>
              <Icon d={bigFeature.icon} size={20} color={bigFeature.accent} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: bigFeature.accent }}>{bigFeature.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">{bigFeature.title}</h3>
            <p className="text-slate-500 leading-relaxed mb-5">{bigFeature.body}</p>
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {bigFeature.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon d="M20 6 9 17l-5-5" size={14} color="#16a34a" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex justify-center md:justify-end">
            <div className="feature-mockup-scale relative w-full max-w-[600px]">
              <div className="absolute -bottom-8 -right-8 scale-[0.5] origin-bottom-right rotate-2" style={{ zIndex: 0 }}>
                <FeedbackReportMockup />
              </div>
              <div className="relative" style={{ zIndex: 1 }}>
                <ScaledMockup designWidth={600}><FeedbackInputMockup /></ScaledMockup>
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

// ─── Process cycle ──────────────────────────────────────────────────────────

function ProcessCycle() {
  const steps = [
    {
      number: "01",
      title: "Prepare",
      icon: ["M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z", "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"],
      body: "Use the Sermon Builder to craft your message with a proven, fully customizable prep process.",
      tools: ["Sermon Builder", "Customizable Prep Process", "Research Tool Library"],
    },
    {
      number: "02",
      title: "Refine",
      icon: ["M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z", "M19 10v2a7 7 0 0 1-14 0v-2", "M12 19v4", "M8 23h8"],
      body: "Upload your notes or a rehearsal recording and get coaching feedback before you ever step into the pulpit.",
      tools: ["Live Recording", "AI Feedback Reports"],
    },
    {
      number: "03",
      title: "Preach",
      icon: ["M11 5 6 9H2v6h4l5 4V5z", "M15.54 8.46a5 5 0 0 1 0 7.07"],
      body: "Step up with confidence, knowing your message is clear, faithful, and ready.",
      tools: ["Pulpit Mode", "Sermon Organizer"],
    },
    {
      number: "04",
      title: "Review",
      icon: ["M22 12h-4l-3 9L9 3l-3 9H2"],
      body: "Get a detailed coaching report — strengths, growth areas, and pacing analysis — so you keep growing sermon after sermon.",
      tools: ["PDF Coaching Report", "Voice Memo from Your AI Coach", "Pacing Analysis", "Tone/Volume Analysis", "Visual Delivery Analysis"],
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16" data-animate="fade-up">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#3760ad" }}>The Process</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            How we help preachers grow.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            The same four-step rhythm, every single week — until it&apos;s just how you preach.
          </p>
        </div>

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.title} className="relative">
              <div
                className="feature-card bg-white rounded-2xl border border-slate-200 p-6 h-full"
                data-animate="fade-up"
                data-delay={String(i * 100)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-11 h-11 shrink-0 rounded-2xl flex items-center justify-center bg-blue-50" style={{ border: "1px solid #3760ad25" }}>
                    <Icon d={step.icon} size={18} color="#3760ad" strokeWidth={2} />
                    <span
                      className="step-pulse absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: "#3760ad", animationDelay: `${i * 0.6}s` }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{step.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{step.body}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tools we offer</p>
                <ul className="space-y-1.5">
                  {step.tools.map((tool) => (
                    <li key={tool} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon d="M20 6 9 17l-5-5" size={13} color="#16a34a" strokeWidth={2.5} />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connector arrow to next step (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-6 -translate-y-1/2 z-10 items-center justify-center w-6 h-6">
                  <span className="step-arrow" style={{ animationDelay: `${i * 0.6}s` }}>
                    <Icon d="M5 12h14M12 5l7 7-7 7" size={18} color="#3760ad" strokeWidth={2.5} />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-10 text-sm text-slate-400" data-animate="fade-up" data-delay="400">
          <Icon d={["M3 12a9 9 0 1 1 3 6.7", "M3 16v-4h4"]} size={16} color="#94a3b8" strokeWidth={2} />
          Back to prepare an even stronger sermon next week.
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  return (
    <section className="py-16 sm:py-24 px-6 bg-slate-50">
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
    <section className="py-16 sm:py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div data-animate="fade-up">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/50" style={{ aspectRatio: "4/5" }}>
            <Image src="/images/founder/founder-blazer.jpg" alt="Bryson Breakey preaching" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-5 px-6">
              <p className="text-white font-bold text-lg leading-tight">Bryson Breakey</p>
              <p className="text-white/70 text-sm">Founder</p>
            </div>
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
          <a href={SIGNUP_URL} className="inline-flex items-center justify-center gap-2 text-white font-semibold px-7 py-4 rounded-full text-base transition-colors hover:brightness-110" style={{ backgroundColor: "#4F46E5" }}>
            {TRIAL_CTA_LABEL}
            <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} />
          </a>
          <TrialDisclosure className="text-slate-500 text-xs mt-3" />
          <a href="/about" className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold hover:underline" style={{ color: "#4F46E5" }}>
            More about us <Icon d="M5 12h14M12 5l7 7-7 7" size={14} strokeWidth={2.5} />
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
      className="relative py-16 sm:py-24 px-6 overflow-hidden text-center"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2c4a9e 45%, #3760ad 100%)" }}
    >
      {/* Decorative glow orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[420px] h-[420px] rounded-full opacity-40 blur-3xl pointer-events-none" style={{ backgroundColor: "#3760ad" }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[480px] h-[480px] rounded-full opacity-30 blur-3xl pointer-events-none" style={{ backgroundColor: "#7c3aed" }} />

      <div className="relative max-w-2xl mx-auto" data-animate="fade-up">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] inline-block"></span>
          14-Day Free Trial &middot; Cancel Anytime
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.05] tracking-tight mb-6">
          Ready to make your next sermon your best one yet?
        </h2>
        <p className="text-xl text-blue-100/80 max-w-xl mx-auto mb-10 leading-relaxed">
          Join preachers who use PreachingHub to prepare with more clarity, preach with more confidence, and grow every single week.
        </p>
        <a href={SIGNUP_URL} className="cta-btn inline-flex items-center justify-center gap-2 text-[#0b1230] font-bold px-8 py-4 rounded-full text-base shadow-lg bg-white hover:bg-blue-50">
          {TRIAL_CTA_LABEL}
          <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="#0b1230" strokeWidth={2.5} />
        </a>
        <TrialDisclosure className="text-blue-100/75 text-xs mt-5" />
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
      <ProcessCycle />
      <Testimonials />
      <AboutCompany />
      <PricingTeaser />
      <SampleReportShowcase />
      <FaqSection ids={HOME_FAQ_IDS} bg="bg-slate-50" />
      <FinalCTA />
      <Footer />
    </main>
  );
}
