export function BeeEmblem({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 34 34"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="17" cy="18" rx="8.5" ry="6" fill="#B86B11" />
      <path
        d="M13 12.6v10.8M17 12v12M21 12.6v10.8"
        stroke="#18121E"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <ellipse
        cx="14"
        cy="10.2"
        rx="4.4"
        ry="3"
        transform="rotate(-24 14 10.2)"
        fill="#F6F3F8"
        stroke="#7A1E48"
        strokeWidth="1.5"
      />
      <ellipse
        cx="20"
        cy="10.2"
        rx="4.4"
        ry="3"
        transform="rotate(24 20 10.2)"
        fill="#F6F3F8"
        stroke="#7A1E48"
        strokeWidth="1.5"
      />
      <circle cx="9.8" cy="16.8" r="1.15" fill="#18121E" />
    </svg>
  );
}

export function BotanicalWaveRule({
  className = 'w-full h-5',
  tone = 'sage',
}: {
  className?: string;
  tone?: 'sage' | 'gold';
}) {
  const stroke = tone === 'gold' ? '#F2C572' : '#1F5E4B';
  return (
    <svg
      viewBox="0 0 1200 22"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 11 Q 30 3, 60 11 T 120 11 T 180 11 T 240 11 T 300 11 T 360 11 T 420 11 T 480 11 T 540 11 T 600 11 T 660 11 T 720 11 T 780 11 T 840 11 T 900 11 T 960 11 T 1020 11 T 1080 11 T 1140 11 T 1200 11"
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeOpacity={tone === 'gold' ? '0.45' : '0.32'}
      />
    </svg>
  );
}
