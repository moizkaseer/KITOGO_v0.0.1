interface IconProps { size?: number; color?: string; strokeWidth?: number; className?: string; }
export default function EHRConnectIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="3" width="8" height="6" rx="1" />
      <rect x="14" y="15" width="8" height="6" rx="1" />
      <path d="M10 6h2a2 2 0 012 2v8a2 2 0 002 2" />
    </svg>
  );
}
