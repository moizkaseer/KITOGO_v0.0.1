interface IconProps { size?: number; color?: string; strokeWidth?: number; className?: string; }
export default function ShieldCheckIcon({ size = 24, color = 'currentColor', strokeWidth = 1.75, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 2L20 6V12C20 17 16.5 21 12 22C7.5 21 4 17 4 12V6Z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
