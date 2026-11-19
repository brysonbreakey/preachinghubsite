"use client";

import { useEffect, useRef, useState } from "react";

// Lays children out at a fixed design width, then scales the whole thing to fit its container,
// so a mockup looks the same on a phone as on a desktop instead of reflowing into a squeeze.
// When the container is wider than the design, it stays at full size and is centered.
export function ScaledMockup({ designWidth = 600, children }: { designWidth?: number; children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const update = () => {
      const s = Math.min(1, wrap.clientWidth / designWidth);
      setScale(s);
      setHeight(inner.offsetHeight * s);
      setOffset(Math.max(0, (wrap.clientWidth - designWidth * s) / 2));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [designWidth]);

  return (
    <div ref={wrapRef} className="w-full" style={{ height }}>
      <div ref={innerRef} style={{ width: designWidth, marginLeft: offset, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        {children}
      </div>
    </div>
  );
}
