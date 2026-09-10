"use client";

import { useRef, useState } from "react";
import { PHMark } from "@/components/Logo";
import { Icon } from "@/components/Icon";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

type InputType = "video" | "text" | "audio";
type View = "form" | "processing" | "ineligible";


const INPUT_OPTIONS: { value: InputType; label: string; icon: string | string[] }[] = [
  { value: "video", label: "Paste Video Link", icon: ["M23 7l-7 5 7 5V7z", "M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"] },
  { value: "text", label: "Paste Text", icon: ["M4 7V4h16v3", "M9 20h6", "M12 4v16"] },
  { value: "audio", label: "Upload File", icon: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"] },
];

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

  const messageInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  function selectInputType(value: InputType) {
    setInputType(value);
    setErrors((prev) => ({ firstName: prev.firstName, email: prev.email }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!lastName.trim()) errs.lastName = "Last name is required.";
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
        last_name: lastName.trim(),
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
            Submit a YouTube link, paste your notes, or upload audio.{" "}
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
            <div className="grid sm:grid-cols-2 gap-4 [&>*:last-child]:sm:col-span-2">
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
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
                    errors.lastName ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
                  }`}
                />
                {errors.lastName && <p className="text-xs text-red-600 mt-1.5">{errors.lastName}</p>}
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
