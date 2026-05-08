interface IconProps { size?: number; color?: string; strokeWidth?: number; className?: string; }
export default function LockEncryptIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
      <circle cx="12" cy="16" r="1.5" fill={color} stroke="none" />
    </svg>
  );
}
