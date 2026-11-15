interface IconProps {
  className?: string;
}

const stroke = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const;

export function PickIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 32 34" aria-hidden="true" focusable="false">
      <path
        d="M16 1.5C8.6 1.5 3 5.2 3 11.5c0 8.5 8.2 20.5 13 20.5s13-12 13-20.5C29 5.2 23.4 1.5 16 1.5Z"
        fill="currentColor"
      />
      <path
        d="M11 12.5c2.2-1.6 7.8-1.6 10 0"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        style={{ stroke: 'var(--pared)' }}
      />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20c.8-3.6 3.9-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.1L20.5 8H6.2" />
      <circle cx="9.5" cy="19.5" r="1.4" />
      <circle cx="17" cy="19.5" r="1.4" />
    </svg>
  );
}

export function TruckIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M3 6.5h11v9H3z" />
      <path d="M14 9.5h4l3 3v3h-7" />
      <circle cx="7.5" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  );
}

export function CardIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3 10h18M7 15h4" />
    </svg>
  );
}

export function SwapIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <path d="M4 9h13l-3.5-3.5M20 15H7l3.5 3.5" />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg {...stroke} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}
