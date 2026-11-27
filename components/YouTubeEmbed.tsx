"use client";

// A YouTube player that nudges "auto" quality up to 1080p. YouTube no longer lets a page request a
// quality; it picks one from the player's size. So on sharp, wide screens the player is rendered
// large enough to cover 1920 screen pixels and then scaled down to fit. Phones and standard screens
// get a normal player (the extra pixels couldn't be seen, and the controls would shrink).
// This is a workaround, not a YouTube feature, so it may stop working.

import { useEffect, useRef, useState } from "react";

const TARGET_PIXELS = 1920;

/** The CSS width to render the player at, for a given space and screen sharpness. */
export function playerWidth(space: number, pixelRatio: number): number {
  if (pixelRatio < 1.5 || space < 600) return space;
  return Math.max(space, Math.round(TARGET_PIXELS / pixelRatio));
}

export function YouTubeEmbed({ id, title }: { id: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; scale: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const space = entry.contentRect.width;
      if (!space) return;
      const width = playerWidth(space, window.devicePixelRatio || 1);
      setSize({ width, scale: space / width });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute inset-0">
      {/* Waits for the measurement, so the player starts at the right size. */}
      {size && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ width: size.width, height: (size.width * 9) / 16, maxWidth: "none", transform: `scale(${size.scale})` }}
        />
      )}
    </div>
  );
}
