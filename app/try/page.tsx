"use client";

import { useRef, useState } from "react";
import { PHMark } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

type InputType = "video" | "text" | "audio";
type View = "form" | "processing" | "ineligible" | "success";

type EvalCategory = {
  key: string;
  label: string;
  strength: string;
  growth_area?: string;
};

type PacingInterval = {
  time_marker: string;
  wpm: number;
  flag: "rushed" | "slow" | null;
  label?: string;
};

type PacingSection = {
  label: string;
  time_marker: string;
};

type Pacing = {
  average_wpm: number;
  intervals: PacingInterval[];
  sections?: PacingSection[];
};

type EvalResult = {
  categories: EvalCategory[];
  overall_summary: string;
  top_coaching_priorities: string[];
  one_thing_to_keep: string;
  questions_worth_considering?: string[];
  pacing?: Pacing;
};

const INPUT_OPTIONS: { value: InputType; label: string; icon: string | string[] }[] = [
  { value: "video", label: "Paste Video Link", icon: ["M23 7l-7 5 7 5V7z", "M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"] },
  { value: "text", label: "Paste Text", icon: ["M4 7V4h16v3", "M9 20h6", "M12 4v16"] },
  { value: "audio", label: "Upload File", icon: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"] },
];

const RECEIVE_ITEMS = [
  { icon: ["M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z"], label: "Your Biggest Win", body: "The one thing to protect and develop" },
  { icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"], label: "Category Breakdown", body: "Feedback across 7 preaching areas" },
  { icon: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"], label: "Top Growth Areas", body: "Specific, actionable coaching priorities" },
  { icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"], label: "Questions to Consider", body: "Questions to help deepen your preaching" },
  { icon: ["M22 12h-4l-3 9L9 3l-3 9H2"], label: "Pacing Analysis", body: "For video & audio submissions" },
];

const TEXT_MESSAGES = ["Reading your sermon...", "Writing your coaching report...", "Almost done..."];
const AV_MESSAGES = ["Grabbing the audio...", "Listening to your sermon...", "Writing your coaching report...", "Almost done..."];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TryPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [sermonTitle, setSermonTitle] = useState("");
  const [inputType, setInputType] = useState<InputType>("video");
  const [transcript, setTranscript] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [view, setView] = useState<View>("form");
  const [ineligibleDate, setIneligibleDate] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState("");
  const [result, setResult] = useState<EvalResult | null>(null);

  const messageInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function selectInputType(value: InputType) {
    setInputType(value);
    setErrors((prev) => ({ firstName: prev.firstName, email: prev.email }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address.";

    if (inputType === "text" && !transcript.trim()) {
      errs.transcript = "Please paste your notes or transcript.";
    } else if (inputType === "audio" && !audioFile) {
      errs.audioFile = "Please choose an audio file.";
    } else if (inputType === "video") {
      if (!videoUrl.trim()) errs.videoUrl = "Please paste a video URL.";
      if (!permissionChecked) errs.permission = "Please confirm you have permission to use this content.";
    }
    return errs;
  }

  function startProcessingMessages(type: InputType) {
    const messages = type === "text" ? TEXT_MESSAGES : AV_MESSAGES;
    let i = 0;
    setProcessingMessage(messages[0]);
    messageInterval.current = setInterval(() => {
      i += 1;
      if (i < messages.length) {
        setProcessingMessage(messages[i]);
      } else if (messageInterval.current) {
        clearInterval(messageInterval.current);
      }
    }, 4000);
  }

  function stopProcessingMessages() {
    if (messageInterval.current) {
      clearInterval(messageInterval.current);
      messageInterval.current = null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsChecking(true);
    let eligible = true;
    try {
      const checkRes = await fetch(`${APP_URL}/api/free-evaluation/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const checkData = await checkRes.json().catch(() => null);
      if (!checkRes.ok || !checkData) throw new Error("check_failed");

      if (checkData.eligible === false) {
        eligible = false;
        setIneligibleDate(checkData.submitted_at ?? null);
        setView("ineligible");
      }
    } catch {
      setIsChecking(false);
      setSubmitError("Something went wrong on our end — this won't count as your free evaluation. Please try again.");
      return;
    }
    setIsChecking(false);
    if (!eligible) return;

    setView("processing");
    startProcessingMessages(inputType);

    try {
      const payload: Record<string, unknown> = {
        email: email.trim(),
        first_name: firstName.trim(),
        sermon_title: sermonTitle.trim(),
        source: "marketing_try",
      };

      if (inputType === "text") {
        payload.input_type = "text";
        payload.transcript_text = transcript.trim();
      } else if (inputType === "video") {
        payload.input_type = "video_url";
        payload.video_url = videoUrl.trim();
      } else {
        const uploadUrlRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: audioFile!.name, contentType: audioFile!.type }),
        });
        if (!uploadUrlRes.ok) throw new Error("upload_url_failed");
        const { uploadUrl, storagePath } = await uploadUrlRes.json();

        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": audioFile!.type || "application/octet-stream" },
          body: audioFile!,
        });
        if (!putRes.ok) throw new Error("audio_upload_failed");

        payload.input_type = "audio";
        payload.storage_path = storagePath;
      }

      const submitRes = await fetch(`${APP_URL}/api/free-evaluation/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const submitData = await submitRes.json().catch(() => null);

      if (!submitRes.ok || !submitData?.result) throw new Error("submit_failed");

      stopProcessingMessages();
      setResult(submitData.result);
      setView("success");
    } catch {
      stopProcessingMessages();
      setSubmitError("Something went wrong on our end — this won't count as your free evaluation. Please try again.");
      setView("form");
    }
  }

  // ─── Ineligible ───────────────────────────────────────────────────────────
  if (view === "ineligible") {
    const dateLabel = ineligibleDate
      ? new Date(ineligibleDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "a previous visit";
    return (
      <main>
        <Navbar />
        <section className="min-h-[80vh] flex items-center bg-slate-50 pt-32 pb-16 px-6">
          <div className="max-w-lg mx-auto text-center bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-8 sm:p-10">
            <p className="text-lg text-slate-700 leading-relaxed mb-2">
              You&apos;ve already received a free coaching report on {dateLabel}.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-8">
              Ready to get unlimited coaching on every sermon?
            </p>
            <a
              href={SIGNUP_URL}
              className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white mb-4"
              style={{ backgroundColor: "#3760ad" }}
            >
              Start Your Free Trial →
            </a>
            <p className="text-xs text-slate-400">Plans start at $29/month after your trial. No card required to start.</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ─── Processing ───────────────────────────────────────────────────────────
  if (view === "processing") {
    return (
      <main>
        <Navbar />
        <section className="min-h-[80vh] flex items-center bg-slate-50 pt-32 pb-16 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-14 h-14 rounded-full border-4 border-slate-200 mx-auto mb-6" style={{ borderTopColor: "#3760ad", animation: "spin 0.9s linear infinite" }} />
            <p className="text-lg font-medium text-slate-700">{processingMessage}</p>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ─── Results ──────────────────────────────────────────────────────────────
  if (view === "success" && result) {
    return (
      <main>
        <Navbar />
        <section className="bg-slate-50 pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-2 tracking-tight">
              Here&apos;s your coaching report, {firstName.trim()}.
            </h1>
            <p className="text-slate-500">We&apos;ve sent a copy to {email.trim()}.</p>
          </div>

          {/* Overall Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#3760ad" }}>
              Overall Summary
            </p>
            <p className="text-slate-600 leading-relaxed">{result.overall_summary}</p>
          </div>

          {/* Breakdown by Area */}
          <p className="text-sm font-medium text-slate-500 mb-3 px-1">Breakdown by Area</p>
          <div className="space-y-3 mb-6">
            {result.categories?.map((cat, i) => (
              <div key={cat.key ?? i} className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                  {!cat.growth_area && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700">Strong</span>
                  )}
                </div>

                <div className={`flex items-start gap-2.5 ${cat.growth_area ? "mb-4" : ""}`}>
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon d="M20 6 9 17l-5-5" size={11} color="#16a34a" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Strength</p>
                    <p className="text-slate-600 leading-relaxed">{cat.strength}</p>
                  </div>
                </div>

                {cat.growth_area && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon d={["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 16v-4", "M12 8h.01"]} size={11} color="#3760ad" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#3760ad" }}>Growth Area</p>
                      <p className="text-slate-600 leading-relaxed">{cat.growth_area}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pacing Analysis (audio/video submissions with word-level timing only) */}
          {result.pacing && result.pacing.intervals.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#3760ad" }}>Pacing Analysis</p>
              <div className="flex items-end gap-1 h-16 mb-2">
                {result.pacing.intervals.map((interval, i) => {
                  const maxWpm = Math.max(...result.pacing!.intervals.map((iv) => iv.wpm), 1);
                  const color = interval.flag === "rushed" ? "#f59e0b" : interval.flag === "slow" ? "#93c5fd" : "#3760ad";
                  const heightPct = Math.max(8, (interval.wpm / maxWpm) * 100);
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-sm"
                      style={{ height: `${heightPct}%`, backgroundColor: color }}
                      title={`${interval.time_marker} — ${interval.wpm} wpm`}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                <span>{result.pacing.intervals[0]?.time_marker}</span>
                <span>{result.pacing.intervals[result.pacing.intervals.length - 1]?.time_marker}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: "#3760ad" }} />Steady pace</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: "#f59e0b" }} />Rushed</div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: "#93c5fd" }} />Slow</div>
                <div className="ml-auto font-semibold text-slate-700">Avg {result.pacing.average_wpm} wpm</div>
              </div>
              {result.pacing.sections && result.pacing.sections.length > 0 && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Sermon Sections</p>
                  <div className="flex flex-wrap gap-2">
                    {result.pacing.sections.map((s, i) => (
                      <span key={i} className="text-xs bg-slate-50 border border-slate-200 rounded-full px-2.5 py-1 text-slate-600">
                        <span className="text-slate-400">{s.time_marker}</span> {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Coaching Priorities */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Top Coaching Priorities</p>
            <ol className="space-y-4">
              {result.top_coaching_priorities?.map((priority, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-bold shrink-0" style={{ color: "#3760ad" }}>{i + 1}.</span>
                  <span className="text-slate-600 leading-relaxed">{priority}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Biggest Win */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-3">Biggest Win</p>
            <p className="text-slate-600 leading-relaxed">{result.one_thing_to_keep}</p>
          </div>

          {/* Questions Worth Considering */}
          {result.questions_worth_considering && result.questions_worth_considering.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Questions Worth Considering</p>
              <ul className="space-y-4">
                {result.questions_worth_considering.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-slate-300 shrink-0">—</span>
                    <span className="text-slate-600 leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Conversion prompt */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-10 mt-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Want coaching like this on every sermon you preach?
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-xl mx-auto mb-8">
              PreachingHub gives you a structured prep process, unlimited AI coaching on your notes and audio, pacing analysis on rehearsal recordings, a series planner, and a library of every sermon you&apos;ve prepared — with plans starting at $29/month.
            </p>
            <a
              href={SIGNUP_URL}
              className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white mb-3"
              style={{ backgroundColor: "#3760ad" }}
            >
              Start Your Free Trial →
            </a>
            <a
              href="/#features"
              className="w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base border-2 mb-4 transition-colors hover:bg-blue-50"
              style={{ borderColor: "#3760ad", color: "#3760ad" }}
            >
              See Everything PreachingHub Does →
            </a>
            <p className="text-xs text-slate-400">14 days free. No card required. Cancel anytime.</p>
          </div>
        </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  return (
    <main>
      <Navbar />
      <section className="bg-slate-50 pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-5">
            Get a free coaching report on your last sermon
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Submit a YouTube link, paste your notes, or upload audio. In minutes you&apos;ll receive helpful sermon feedback to take your preaching to the next level.
            <br />
            No account needed. No card required.
            <br />
            Get your report in minutes. No long wait. No demo call. No account needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 p-6 sm:p-8 space-y-8">
            {submitError && (
              <div className="rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3">
                {submitError}
              </div>
            )}

            {/* Name & email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                    errors.firstName ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                  }`}
                />
                {errors.firstName && <p className="text-xs text-red-600 mt-1.5">{errors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                    errors.email ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                  }`}
                />
                {errors.email ? (
                  <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1.5">So we can send you your report.</p>
                )}
              </div>
            </div>

            {/* Sermon title */}
            <div>
              <label htmlFor="sermonTitle" className="block text-sm font-medium text-slate-700 mb-1.5">
                Sermon title
              </label>
              <input
                id="sermonTitle"
                name="sermonTitle"
                type="text"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                placeholder="Optional — helps personalize your report"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] focus:border-[#3760ad]"
              />
            </div>

            {/* Sermon submission */}
            <div>
              <p className="block text-sm font-medium text-slate-700 mb-3">
                How would you like to submit your sermon?
              </p>

              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="flex flex-col items-center gap-2 text-center mb-5">
                  <div className="w-10 h-10 rounded-full bg-[#3760ad]/10 flex items-center justify-center">
                    <PHMark size={18} color="#3760ad" />
                  </div>
                  <div className="font-semibold text-slate-700 text-sm">Drop your sermon here</div>
                  <div className="text-xs text-slate-400">Upload a file, paste your notes, or link a video</div>
                </div>

                <div className="flex gap-2 mb-5">
                  {INPUT_OPTIONS.map(({ value, label, icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectInputType(value)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                        inputType === value
                          ? "border-[#3760ad] bg-blue-50 text-[#3760ad]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <Icon d={icon} size={15} color={inputType === value ? "#3760ad" : "#64748b"} strokeWidth={2} />
                      {label}
                    </button>
                  ))}
                </div>

                {inputType === "text" && (
                  <div>
                    <textarea
                      name="transcript"
                      rows={8}
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      placeholder="Paste your sermon notes, outline, or full transcript here. The more detail you include, the more specific your coaching report will be."
                      className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                        errors.transcript ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                      }`}
                    />
                    {errors.transcript && <p className="text-xs text-red-600 mt-1.5">{errors.transcript}</p>}
                  </div>
                )}

                {inputType === "audio" && (
                  <div>
                    <input
                      type="file"
                      name="audioFile"
                      accept=".mp3,.m4a,.wav"
                      onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                      className="w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-[#3760ad] file:text-white file:text-sm file:font-medium file:px-4 file:py-2.5 file:cursor-pointer hover:file:bg-blue-700"
                    />
                    <p className="text-xs text-slate-400 mt-2">Audio file up to 90 minutes. Sermon or rehearsal recording.</p>
                    {errors.audioFile && <p className="text-xs text-red-600 mt-1.5">{errors.audioFile}</p>}
                  </div>
                )}

                {inputType === "video" && (
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste a YouTube or video URL"
                        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                          errors.videoUrl ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                        }`}
                      />
                      {errors.videoUrl && <p className="text-xs text-red-600 mt-1.5">{errors.videoUrl}</p>}
                    </div>
                    <div>
                      <label className="flex items-start gap-2.5 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={permissionChecked}
                          onChange={(e) => setPermissionChecked(e.target.checked)}
                          className="accent-[#3760ad] w-4 h-4 mt-0.5 shrink-0"
                        />
                        This is my own content or I have permission to use it for coaching.
                      </label>
                      {errors.permission && <p className="text-xs text-red-600 mt-1.5">{errors.permission}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-6 py-4 rounded-xl text-base text-white disabled:opacity-60"
              style={{ backgroundColor: "#3760ad" }}
            >
              <Icon d="M13 2 3 14h9l-1 8 10-12h-9z" size={17} color="white" strokeWidth={2} />
              {isChecking ? "Checking..." : "Get My Free Coaching Report →"}
            </button>
          </form>

          {/* What you'll receive */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:sticky lg:top-16">
            <div className="font-semibold text-slate-800 mb-4">What you&apos;ll receive</div>
            <div className="space-y-4">
              {RECEIVE_ITEMS.map(({ icon, label, body }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3760ad]/10 flex items-center justify-center shrink-0">
                    <Icon d={icon} size={15} color="#3760ad" strokeWidth={2} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{label}</div>
                    <div className="text-xs text-slate-500">{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </section>
      <Footer />
    </main>
  );
}
