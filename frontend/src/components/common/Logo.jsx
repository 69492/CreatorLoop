/**
 * Logo — Midnight Studio identity mark
 * size: 'sm' | 'md' (default)
 */
export default function Logo({ size = 'md' }) {
  const isSmall = size === 'sm'
  const iconSize = isSmall ? 22 : 26
  const textSize = isSmall ? 'text-base' : 'text-lg'

  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight ${textSize}`}>
      {/* SVG mark — stylized "C" loop with orange accent */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-orange" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" />
            <stop offset="100%" stopColor="#FF9A4D" />
          </linearGradient>
          <linearGradient id="logo-teal" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2DD4BF" />
            <stop offset="100%" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="16" cy="16" r="13" stroke="url(#logo-orange)" strokeWidth="2" fill="none" opacity="0.25" />
        {/* Main C arc */}
        <path
          d="M22 10 A8 8 0 1 0 22 22"
          stroke="url(#logo-orange)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Center dot — teal accent */}
        <circle cx="16" cy="16" r="2.5" fill="url(#logo-teal)" />
        {/* Arrow tip */}
        <path d="M20 8.5 L22 10 L20 11.5" stroke="url(#logo-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>

      {/* Wordmark */}
      <span style={{ fontFamily: "'Sora', sans-serif" }}>
        <span style={{ color: '#F8FAFC', fontWeight: 700 }}>Creator</span>
        <span style={{ color: '#FF7A1A', fontWeight: 800 }}>Loop</span>
      </span>
    </span>
  )
}
