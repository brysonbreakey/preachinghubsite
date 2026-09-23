"use client";

import { useRef, useState } from "react";
import posthog from "posthog-js";
import { Icon } from "@/components/Icon";
import { YouTubeSearchInput } from "@/components/YouTubeSearchInput";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { APP_URL, SIGNUP_URL } from "@/lib/urls";

type InputType = "video" | "text" | "audio";
type View = "form" | "processing" | "ineligible";

// Only the audio track is ever analyzed (transcription + tone/pacing) — raw
// video files carry no benefit over audio, just 5-10x the upload size. Video
// gets a lower cap than audio/documents specifically to push people toward
// the smaller file that works just as well, rather than risk an unreliable
// in-browser video transcode on a phone. These caps exist to stop uploads
// from timing out or stalling on mobile connections, which was the most
// common way the /try upload flow was silently failing.
const MAX_FILE_SIZE_MB = 300;
// A typical phone-shot 1080p video runs ~10-12 Mbps, so a full 45-60 min
// sermon is easily 400-600MB — this just needs to catch pathological
// outliers (4K, uncompressed), not normal-length sermon recordings.
const MAX_VIDEO_FILE_SIZE_MB = 700;

// Video files over this size go through multipart upload (split into
// chunks, uploaded to R2 in parts, assembled server-side) instead of one
// giant PUT — a single multi-hundred-MB PUT on mobile has no way to recover
// from a mid-transfer network hiccup and has to restart from zero. Mirrors
// the thresholds already used on the app side for the same reason.
const MULTIPART_THRESHOLD_BYTES = 100 * 1024 * 1024;
const MULTIPART_CHUNK_SIZE_BYTES = 50 * 1024 * 1024;
const MULTIPART_CONCURRENCY = 3;
const MULTIPART_PART_ATTEMPTS = 3;

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

function isVideoFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const isDocument = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
  return !isDocument && (file.type.startsWith("video/") || /\.(mp4|mov)$/i.test(name));
}

async function uploadFileSinglePut(
  file: File,
  contentType: string,
  onProgress: (pct: number) => void
): Promise<string> {
  const uploadUrlRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType }),
  });
  if (!uploadUrlRes.ok) throw new Error("upload_url_failed");
  const { uploadUrl, storagePath } = await uploadUrlRes.json();

  // XHR instead of fetch so we can show real upload progress — a large file
  // on a slow mobile connection can take a while, and without a percentage
  // people assume the generic spinner is frozen and back out.
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType || "application/octet-stream");
    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) onProgress(Math.round((evt.loaded / evt.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("audio_upload_failed"));
    };
    xhr.onerror = () => reject(new Error("audio_upload_failed"));
    xhr.send(file);
  });

  return storagePath;
}

// Splits a large video into 50MB parts, uploads up to 3 at once directly to
// R2, and assembles them server-side. A single giant PUT has no way to
// recover from a mid-transfer network hiccup on mobile and has to restart
// from zero — chunking bounds how much is lost to any one dropped part, and
// lets several parts move in parallel instead of one long serial transfer.
async function uploadFileMultipart(
  file: File,
  contentType: string,
  onProgress: (pct: number) => void
): Promise<string> {
  const startRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url/multipart/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType }),
  });
  if (!startRes.ok) throw new Error("multipart_start_failed");
  const { uploadId, key, storagePath } = await startRes.json();

  const totalParts = Math.ceil(file.size / MULTIPART_CHUNK_SIZE_BYTES);
  const bytesLoaded = new Array(totalParts).fill(0);
  const parts: { PartNumber: number; ETag: string }[] = [];

  const reportProgress = () => {
    const loaded = bytesLoaded.reduce((a, b) => a + b, 0);
    onProgress(Math.round((loaded / file.size) * 100));
  };

  async function uploadPart(partNumber: number) {
    const start = (partNumber - 1) * MULTIPART_CHUNK_SIZE_BYTES;
    const chunk = file.slice(start, Math.min(start + MULTIPART_CHUNK_SIZE_BYTES, file.size));

    const urlRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url/multipart/part-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, key, partNumber }),
    });
    if (!urlRes.ok) throw new Error(`multipart_part_url_failed_${partNumber}`);
    const { url } = await urlRes.json();

    // Retry a dropped part a few times before giving up on the whole upload —
    // a transient mobile network blip mid-part is the common failure, and
    // only this part's bytes need re-sending, not the entire file.
    let etag = "";
    for (let attempt = 1; attempt <= MULTIPART_PART_ATTEMPTS; attempt++) {
      try {
        etag = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", url);
          xhr.upload.onprogress = (evt) => {
            bytesLoaded[partNumber - 1] = evt.loaded;
            reportProgress();
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.getResponseHeader("ETag") ?? "");
            else reject(new Error(`multipart_part_upload_failed_${partNumber}`));
          };
          xhr.onerror = () => reject(new Error(`multipart_part_upload_failed_${partNumber}`));
          xhr.send(chunk);
        });
        break;
      } catch (err) {
        bytesLoaded[partNumber - 1] = 0;
        reportProgress();
        if (attempt === MULTIPART_PART_ATTEMPTS) throw err;
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    parts.push({ PartNumber: partNumber, ETag: etag });
  }

  try {
    for (let i = 0; i < totalParts; i += MULTIPART_CONCURRENCY) {
      const batch = Array.from(
        { length: Math.min(MULTIPART_CONCURRENCY, totalParts - i) },
        (_, j) => i + j + 1
      );
      await Promise.all(batch.map(uploadPart));
    }

    const completeRes = await fetch(`${APP_URL}/api/free-evaluation/upload-url/multipart/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, key, parts: parts.sort((a, b) => a.PartNumber - b.PartNumber) }),
    });
    if (!completeRes.ok) throw new Error("multipart_complete_failed");
  } catch (err) {
    // Best-effort cleanup so a failed upload doesn't leave orphaned parts
    // billed against the R2 bucket — never lets a cleanup failure mask the
    // real error.
    fetch(`${APP_URL}/api/free-evaluation/upload-url/multipart/abort`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, key }),
    }).catch(() => {});
    throw err;
  }

  return storagePath;
}

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

/**
 * The full /try free-evaluation intake experience, extracted so it can be
 * reused as-is on other pages (e.g. the /checklist thank-you page) without
 * duplicating this logic. `aboveForm` renders above the form-view hero —
 * unused in the ineligible/processing views, which only ever appear after
 * a real submission.
 */
export function TryPageContent({
  aboveForm,
  heroContent,
  initialName,
  initialEmail,
  showPhoneField = true,
}: {
  aboveForm?: React.ReactNode;
  heroContent?: React.ReactNode;
  initialName?: string;
  initialEmail?: string;
  showPhoneField?: boolean;
} = {}) {
  const [name, setName] = useState(initialName ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadBackgrounded, setUploadBackgrounded] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isUploadingRef = useRef(false);

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
    if (showPhoneField && phone.replace(/\D/g, "").length !== 10) errs.phone = "Enter a valid 10-digit phone number.";

    if (inputType === "text" && !transcript.trim()) {
      errs.transcript = "Please paste your notes or transcript.";
    } else if (inputType === "audio" && !audioFile) {
      errs.audioFile = "Please choose an audio or video file.";
    } else if (inputType === "audio" && audioFile) {
      const cap = isVideoFile(audioFile) ? MAX_VIDEO_FILE_SIZE_MB : MAX_FILE_SIZE_MB;
      if (audioFile.size > cap * 1024 * 1024) {
        errs.audioFile = `That file is too large (${(audioFile.size / (1024 * 1024)).toFixed(0)}MB). Max size is ${cap}MB — try uploading just the audio instead of video, or a smaller file.`;
      }
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

  // Keeps the screen from locking mid-upload — a locked phone screen can
  // pause JS execution on mobile Safari and silently kill a large upload.
  // Not supported everywhere, so this is best-effort and fails silently.
  async function acquireWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
      }
    } catch {
      // Unsupported or denied — the upload still works, just without this protection.
    }
  }

  function releaseWakeLock() {
    wakeLockRef.current?.release().catch(() => {});
    wakeLockRef.current = null;
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
        const isVideo = isVideoFile(audioFile!);

        // Use a safe content type for uploads (browser sometimes sends empty string for docs)
        let contentType = audioFile!.type;
        if (!contentType) {
          if (name.endsWith(".pdf")) contentType = "application/pdf";
          else if (name.endsWith(".docx")) contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          else if (name.endsWith(".doc")) contentType = "application/msword";
        }

        // Three things fight mobile Safari's habit of pausing/killing JS on a
        // large upload: a screen wake lock (locking the phone can pause JS
        // outright), a beforeunload guard (stops an accidental swipe-to-close),
        // and a visibilitychange listener that warns on screen if they
        // background the tab anyway, since JS can stall there too.
        setUploadProgress(0);
        setUploadBackgrounded(false);
        isUploadingRef.current = true;
        await acquireWakeLock();
        const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
          e.preventDefault();
        };
        const visibilityHandler = () => {
          if (document.hidden && isUploadingRef.current) setUploadBackgrounded(true);
          else setUploadBackgrounded(false);
        };
        window.addEventListener("beforeunload", beforeUnloadHandler);
        document.addEventListener("visibilitychange", visibilityHandler);

        let storagePath: string;
        try {
          if (isVideo && audioFile!.size > MULTIPART_THRESHOLD_BYTES) {
            storagePath = await uploadFileMultipart(audioFile!, contentType, setUploadProgress);
          } else {
            storagePath = await uploadFileSinglePut(audioFile!, contentType, setUploadProgress);
          }
        } finally {
          isUploadingRef.current = false;
          setUploadProgress(null);
          setUploadBackgrounded(false);
          window.removeEventListener("beforeunload", beforeUnloadHandler);
          document.removeEventListener("visibilitychange", visibilityHandler);
          releaseWakeLock();
        }

        payload.input_type = isDocument ? "document" : isVideo ? "video" : "audio";
        payload.storage_path = storagePath;
      }

      const startRes = await fetch(`${APP_URL}/api/free-evaluation/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const startData = await startRes.json().catch(() => null);

      if (!startRes.ok || !startData?.token) throw new Error("start_failed");

      posthog.capture("free_evaluation_submitted", { input_type: payload.input_type });

      stopProcessingMessages();
      window.location.href = `${APP_URL}/try/${startData.token}`;
    } catch (err) {
      // All three network steps (upload-url, the file PUT, and start) used to
      // share this one catch with no logging at all — any of them failing
      // produced the exact same generic message and left zero trace of
      // which step actually broke. Capturing the real error message (each
      // step throws its own label; a raw failed fetch — e.g. a CORS block
      // on the R2 PUT — carries the browser's own message, like "Failed to
      // fetch") makes this diagnosable from PostHog instead of guesswork.
      posthog.capture("free_evaluation_error", {
        reason: err instanceof Error ? err.message : String(err),
        input_type: inputType,
      });
      stopProcessingMessages();
      setUploadProgress(null);
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
  // Styled to match the app's guest-evaluation results screen (dark bg, same
  // "Free Evaluation" / "Your Sermon Evaluation" heading) rather than this
  // site's own light theme + Navbar/Footer chrome — this view redirects
  // straight into that app screen once the token's ready, so matching its
  // look here makes the handoff invisible instead of a jarring page-swap.
  if (view === "processing") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0D1117" }}>
        <div className="max-w-3xl w-full mx-auto px-4 py-10">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: "#2563EB" }}>
              Free Evaluation
            </p>
            <h1 className="text-3xl font-semibold text-white">Your Sermon Evaluation</h1>
          </div>
          <div className="flex flex-col items-center gap-4 py-20 text-gray-400">
            <div className="w-7 h-7 rounded-full border-2 animate-spin" style={{ borderColor: "#374151", borderTopColor: "#9CA3AF" }} />
            <p className="text-sm">
              {uploadProgress !== null ? `Uploading… ${uploadProgress}%` : processingMessage}
            </p>
            {uploadProgress !== null && (
              <p className="text-xs text-gray-500">Stay on this screen until the upload finishes.</p>
            )}
            {uploadBackgrounded && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ color: "#FCA5A5", backgroundColor: "#7F1D1D33" }}>
                This tab was backgrounded — come back and keep it open, or the upload may fail.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────────────────────
  return (
    <main>
      <Navbar />
      <section className="bg-slate-50 pt-32 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {aboveForm}
        {heroContent ?? (
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
        )}

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
              {showPhoneField && (
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
              )}
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
                    <p className="text-xs text-slate-400 mt-1.5">
                      Have an audio file? Audio uploads much faster and works just as well.
                    </p>
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
