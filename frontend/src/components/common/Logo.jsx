/**
 * Brand logo mark + wordmark.
 * size: 'sm' | 'md' (default)
 */
export default function Logo({ size = 'md' }) {
  const textCls = size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <span className={`inline-flex items-center gap-2.5 font-bold tracking-tight group transition-transform duration-200 hover:scale-[1.02] ${textCls}`}>
      {/* SVG mark */}
      <svg
        width={size === 'sm' ? 22 : 28}
        height={size === 'sm' ? 22 : 28}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:rotate-12"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9f67ff" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="14" fill="url(#logo-grad)" opacity="0.2" />
        <path
          d="M10 16 C10 11 14 8 16 8 C18 8 22 11 22 16 C22 21 18 24 16 24 C14 24 10 21 10 16 Z"
          stroke="url(#logo-grad)"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="16" cy="16" r="3" fill="url(#logo-grad)" />
      </svg>

      {/* Wordmark */}
      <span>
        <span className="text-white font-extrabold">Creator</span>
        <span className="gradient-text font-black">Loop</span>
      </span>
    </span>
  )
}
