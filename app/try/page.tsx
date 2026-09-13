"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { YouTubeSearchInput } from "@/components/YouTubeSearchInput";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

type InputType = "video" | "text" | "audio";
type View = "form" | "processing" | "ineligible";

function YouTubeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="22" height="16" rx="5" fill="#FF0000" />
      <path d="M10 8.5 16 12l-6 3.5v-7Z" fill="white" />
    </svg>
  );
}

const INPUT_OPTIONS: { value: InputType; shortLabel: string; label: string }[] = [
  { value: "video", shortLabel: "YouTube", label: "YouTube" },
  { value: "text", shortLabel: "Paste", label: "Paste Text" },
  { value: "audio", shortLabel: "Upload", label: "Upload File" },
];

const NON_VIDEO_ICONS: Record<string, string | string[]> = {
  text: ["M4 7V4h16v3", "M9 20h6", "M12 4v16"],
  audio: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
};

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 10)].filter(Boolean);
  return parts.join("-");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

const RECEIVE_ITEMS = [
  { icon: ["M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z"], label: "Your Biggest Wins", body: "The one thing to protect and develop" },
  { icon: ["M9 11l3 3L22 4", "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"], label: "Category Breakdown", body: "Feedback across 7 preaching areas" },
  { icon: ["M23 6l-9.5 9.5-5-5L1 18", "M17 6h6v6"], label: "Top Growth Areas", body: "Specific, actionable coaching priorities" },
  { icon: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", "M12 17h.01"], label: "Questions to Consider", body: "Questions to help deepen your preaching" },
  { icon: ["M22 12h-4l-3 9L9 3l-3 9H2"], label: "Pacing Analysis", body: "For video & audio submissions" },
];

const TEXT_MESSAGES = ["Reading your sermon...", "Writing your coaching report...", "Almost done..."];
const AV_MESSAGES = ["Grabbing the audio...", "Listening to your sermon...", "Writing your coaching report...", "Almost done..."];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TryPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sermonTitle, setSermonTitle] = useState("");
  const [inputType, setInputType] = useState<InputType>("video");
  const [transcript, setTranscript] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [permissionChecked, setPermissionChecked] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [view, setView] = useState<View>("form");
  const [ineligibleDate, setIneligibleDate] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState("");

  const messageInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function selectInputType(value: InputType) {
    setInputType(value);
    setErrors((prev) => ({ name: prev.name, email: prev.email }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address.";
    if (phone.replace(/\D/g, "").length !== 10) errs.phone = "Enter a valid 10-digit phone number.";

    if (inputType === "text" && !transcript.trim()) {
      errs.transcript = "Please paste your notes or transcript.";
    } else if (inputType === "audio" && !audioFile) {
      errs.audioFile = "Please choose an audio or video file.";
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

    const { firstName, lastName } = splitName(name);

    // Side-channel lead capture (Mailchimp + holding spreadsheet for phone
    // numbers) — fire-and-forget, must never block the actual eval flow.
    fetch("/api/try-lead-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: email.trim(),
        phone: phone.trim(),
      }),
    }).catch((err) => console.error("try-lead-capture failed", err));

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
        first_name: firstName,
        last_name: lastName,
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
        const name = audioFile!.name.toLowerCase();
        const isDocument = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
        const isVideoFile = !isDocument && (audioFile!.type.startsWith("video/") || /\.(mp4|mov)$/i.test(name));

        // Use a safe content type for uploads (browser sometimes sends empty string for docs)
        let contentType = audioFile!.type;
        if (!contentType) {
          if (name.endsWith(".pdf")) contentType = "application/pdf";
          else if (name.endsWith(".docx")) contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          else if (name.endsWith(".doc")) contentType = "application/msword";
        }

        const uploadUrlRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: audioFile!.name, contentType }),
        });
        if (!uploadUrlRes.ok) throw new Error("upload_url_failed");
        const { uploadUrl, storagePath } = await uploadUrlRes.json();

        const putRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType || "application/octet-stream" },
          body: audioFile!,
        });
        if (!putRes.ok) throw new Error("audio_upload_failed");

        payload.input_type = isDocument ? "document" : isVideoFile ? "video" : "audio";
        payload.storage_path = storagePath;
      }

      const startRes = await fetch(`${APP_URL}/api/free-evaluation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const startData = await startRes.json().catch(() => null);

      if (!startRes.ok || !startData?.token) throw new Error("start_failed");

      stopProcessingMessages();
      window.location.href = `${APP_URL}/try/${startData.token}`;
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
            <p className="text-xs text-slate-400">$39/month (billed annually) after your trial. Card required to start.</p>
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
            Submit a YouTube link, paste your notes, or upload audio, video, or a PDF/Word doc.{" "}
            <strong className="font-semibold text-slate-700">In minutes</strong>,{" "}
            you&apos;ll receive helpful sermon feedback to take your preaching to the next level. No account needed.
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
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                    errors.name ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                  }`}
                />
                {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
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
                {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="xxx-xxx-xxxx"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                    errors.phone ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-600 mt-1.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Sermon submission */}
            <div>
              <p className="block text-lg font-bold text-slate-900 mb-3">
                Submit your sermon
              </p>

              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 sm:p-6">
                <div className="flex gap-2 mb-5">
                  {INPUT_OPTIONS.map(({ value, shortLabel, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => selectInputType(value)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                        inputType === value
                          ? "border-[#3760ad] bg-blue-50 text-[#3760ad]"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {value === "video" ? (
                        <YouTubeIcon size={15} />
                      ) : (
                        <Icon d={NON_VIDEO_ICONS[value]} size={15} color={inputType === value ? "#3760ad" : "#64748b"} strokeWidth={2} className="shrink-0" />
                      )}
                      <span className="hidden min-[420px]:inline">{label}</span>
                      <span className="min-[420px]:hidden">{shortLabel}</span>
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
                      ref={fileInputRef}
                      type="file"
                      id="audioFile"
                      name="audioFile"
                      accept=".mp3,.m4a,.wav,.mp4,.mov,.pdf,.doc,.docx"
                      onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                      className="hidden"
                    />
                    {audioFile ? (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#3760ad]/10 flex items-center justify-center shrink-0">
                            <Icon d={NON_VIDEO_ICONS.audio} size={15} color="#3760ad" strokeWidth={2} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-slate-700 truncate">{audioFile.name}</div>
                            <div className="text-xs text-slate-400">{(audioFile.size / (1024 * 1024)).toFixed(1)} MB</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setAudioFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
                          aria-label="Remove file"
                        >
                          <Icon d="M18 6 6 18M6 6l12 12" size={16} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="audioFile"
                        className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white py-6 cursor-pointer hover:border-[#3760ad] hover:bg-blue-50/40 transition-colors"
                      >
                        <Icon d={["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"]} size={20} color="#94a3b8" strokeWidth={2} />
                        <span className="text-sm font-medium text-slate-600">Click to upload</span>
                        <span className="text-xs text-slate-400">Audio, video, PDF, or Word doc</span>
                      </label>
                    )}
                    {errors.audioFile && <p className="text-xs text-red-600 mt-1.5">{errors.audioFile}</p>}
                  </div>
                )}

                {inputType === "video" && (
                  <div className="space-y-3">
                    <div>
                      <YouTubeSearchInput value={videoUrl} onChange={setVideoUrl} error={errors.videoUrl} />
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
                placeholder="Optional"
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] focus:border-[#3760ad]"
              />
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="cta-btn w-full inline-flex items-center justify-center gap-2 font-semibold px-4 sm:px-6 py-4 rounded-xl text-sm sm:text-base text-white disabled:opacity-60 whitespace-nowrap"
              style={{ backgroundColor: "#3760ad" }}
            >
              <Icon d="M13 2 3 14h9l-1 8 10-12h-9z" size={17} color="white" strokeWidth={2} className="shrink-0" />
              <span>{isChecking ? "Checking..." : "Get My Free Report"}</span>
              {!isChecking && <Icon d="M5 12h14M12 5l7 7-7 7" size={16} color="white" strokeWidth={2.5} className="shrink-0" />}
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
