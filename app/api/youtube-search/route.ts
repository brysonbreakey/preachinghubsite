import { NextRequest, NextResponse } from "next/server";
import { searchYouTube, YouTubeQuotaExceededError } from "@/lib/youtube";

// In-process IP rate limit: max 15 searches per IP per 10 minutes.
// This endpoint is intentionally public (no auth) but shares a YouTube Data
// API key with a limited daily quota, so it needs a guard against abuse.
const ipHits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

// Once the shared YouTube API key hits its daily quota, stop even trying for
// a while — avoids wasting function invocations hammering a key we already
// know is exhausted, and gives every visitor a fast, consistent response.
let quotaExceededUntil = 0;
const QUOTA_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function POST(req: NextRequest) {
  if (Date.now() < quotaExceededUntil) {
    return NextResponse.json({ error: "quota_exceeded" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many searches. Please wait a few minutes or paste a link instead." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const query = typeof body?.query === "string" ? body.query.trim() : "";

  if (!query) {
    return NextResponse.json({ error: "Missing query." }, { status: 400 });
  }

  try {
    const results = await searchYouTube(query);
    return NextResponse.json({ results });
  } catch (err) {
    if (err instanceof YouTubeQuotaExceededError) {
      quotaExceededUntil = Date.now() + QUOTA_COOLDOWN_MS;
      console.error("youtube-search: quota exceeded, disabling search for", QUOTA_COOLDOWN_MS / 60000, "minutes");
      return NextResponse.json({ error: "quota_exceeded" }, { status: 503 });
    }
    console.error("youtube-search failed", err);
    return NextResponse.json(
      { error: "Search failed. Please try again or paste a link instead." },
      { status: 500 }
    );
  }
}
