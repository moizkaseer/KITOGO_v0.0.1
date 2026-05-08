interface IconProps { size?: number; color?: string; strokeWidth?: number; className?: string; }
export default function StethoscopeIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 3v6a6 6 0 0012 0V3" />
      <path d="M12 15a5 5 0 010 10" />
      <circle cx="19" cy="19" r="2" />
      <line x1="6" y1="3" x2="6" y2="5" />
      <line x1="18" y1="3" x2="18" y2="5" />
    </svg>
  );
}
