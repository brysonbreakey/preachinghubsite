import type { PacingResult } from "@/lib/sampleReport";

// Read-only words-per-minute chart for the sample report — a plain SVG so the
// marketing site doesn't need a charting library. Same look as the app's pacing
// analysis: line over 60-second intervals, an average line, and dots coloured by
// pace (faster / normal / slower).
const W = 640;
const H = 220;
const PAD = { top: 12, right: 26, bottom: 28, left: 34 };
const Y_MIN = 89;
const Y_MAX = 250;

export function PacingChart({ result }: { result: PacingResult }) {
  const pts = result.intervals;
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / Math.max(1, pts.length - 1)) * iw;
  const y = (v: number) => PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * ih;
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.wpm).toFixed(1)}`).join(" ");
  const ticks = [89, 129, 170, 210, 250];
  const color = (f: PacingResult["intervals"][number]["flag"]) => (f === "rushed" ? "#22d3ee" : f === "slow" ? "#6d28d9" : "#3b82f6");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
        {[["Normal", "#3b82f6"], ["Faster", "#22d3ee"], ["Slower", "#6d28d9"]].map(([label, c]) => (
          <span key={label} className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />{label}</span>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5"><span className="w-4 h-0.5 bg-amber-500" />avg {result.average_wpm} wpm</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Words per minute across the sermon, averaging ${result.average_wpm}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray="3 3" />
            <text x={PAD.left - 6} y={y(t) + 3} textAnchor="end" fontSize="10" fill="#94a3b8">{t}</text>
          </g>
        ))}
        <line x1={PAD.left} x2={W - PAD.right} y1={y(result.average_wpm)} y2={y(result.average_wpm)} stroke="#f59e0b" strokeWidth="1.5" />
        <path d={line} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={p.time_marker} cx={x(i)} cy={y(p.wpm)} r="3.5" fill={color(p.flag)} />
        ))}
        {pts.map((p, i) => (i % 5 === 0 ? (
          <text key={`x${p.time_marker}`} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="#94a3b8">{p.time_marker}</text>
        ) : null))}
      </svg>
    </div>
  );
}
