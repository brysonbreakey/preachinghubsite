"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icon";

type YTResult = { videoId: string; title: string; channelTitle: string; thumbnailUrl: string };

const YT_URL_RE = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/)/i;

export function YouTubeSearchInput({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<YTResult[]>([]);
  const [selected, setSelected] = useState<YTResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchDisabled, setSearchDisabled] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value === "" && query !== "") {
      setQuery("");
      setSelected(null);
      setResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(next: string) {
    setQuery(next);
    setSelected(null);

    if (YT_URL_RE.test(next.trim())) {
      onChange(next);
      setResults([]);
      return;
    }

    onChange("");
    if (searchDisabled) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (next.trim().length < 3) {
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/youtube-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: next.trim() }),
        });
        const data = await res.json().catch(() => null);
        if (res.status === 503 && data?.error === "quota_exceeded") {
          setSearchDisabled(true);
          setResults([]);
          return;
        }
        setResults(res.ok && Array.isArray(data?.results) ? data.results : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }

  function selectResult(r: YTResult) {
    const url = `https://www.youtube.com/watch?v=${r.videoId}`;
    setSelected(r);
    setResults([]);
    setQuery(url);
    onChange(url);
  }

  function clearSelection() {
    setSelected(null);
    setQuery("");
    onChange("");
  }

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selected.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded shrink-0" />
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-700 truncate">{selected.title}</div>
            <div className="text-xs text-slate-400 truncate">{selected.channelTitle}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={clearSelection}
          className="text-slate-400 hover:text-slate-600 shrink-0 p-1"
          aria-label="Change video"
        >
          <Icon d="M18 6 6 18M6 6l12 12" size={16} strokeWidth={2} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search YouTube, or paste a link"
        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3760ad] ${
          error ? "border-red-300" : "border-slate-300 focus:border-[#3760ad]"
        }`}
      />
      {loading && <p className="text-xs text-slate-400 mt-1.5">Searching YouTube...</p>}
      {searchDisabled && query.trim() && !YT_URL_RE.test(query.trim()) && (
        <p className="text-xs text-slate-400 mt-1.5">Search is temporarily unavailable — please paste your video link.</p>
      )}
      {results.length > 0 && (
        <div className="mt-2 rounded-lg border border-slate-200 bg-white divide-y divide-slate-100 max-h-72 overflow-y-auto shadow-sm">
          {results.map((r) => (
            <button
              type="button"
              key={r.videoId}
              onClick={() => selectResult(r)}
              className="flex items-center gap-3 w-full p-2.5 text-left hover:bg-slate-50 transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded shrink-0" />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">{r.title}</div>
                <div className="text-xs text-slate-400 truncate">{r.channelTitle}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
