export function Icon({ d, size = 20, color = "currentColor", strokeWidth = 1.75, className }: { d: string | string[]; size?: number; color?: string; strokeWidth?: number; className?: string }) {
  const paths = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
