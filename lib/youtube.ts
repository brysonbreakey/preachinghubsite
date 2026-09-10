export type YouTubeSearchResult = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
};

export class YouTubeQuotaExceededError extends Error {
  constructor() {
    super("YouTube API quota exceeded");
    this.name = "YouTubeQuotaExceededError";
  }
}

export async function searchYouTube(query: string): Promise<YouTubeSearchResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("youtube: YOUTUBE_API_KEY not configured");
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: "6",
    q: query,
    key: apiKey,
  });

  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const reason = body?.error?.errors?.[0]?.reason;
    if (res.status === 403 && (reason === "quotaExceeded" || reason === "dailyLimitExceeded")) {
      throw new YouTubeQuotaExceededError();
    }
    throw new Error(`YouTube search failed (${res.status}): ${JSON.stringify(body)}`);
  }

  const data = await res.json();
  return (data.items ?? []).map((item: any) => ({
    videoId: item.id?.videoId ?? "",
    title: item.snippet?.title ?? "",
    channelTitle: item.snippet?.channelTitle ?? "",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url ?? "",
  })).filter((r: YouTubeSearchResult) => r.videoId);
}
