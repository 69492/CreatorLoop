/**
 * SelectCard — Midnight Studio selectable option card
 */
export default function SelectCard({
  icon,
  label,
  description,
  selected = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200
        focus-visible:outline-none
        ${disabled ? 'opacity-35 cursor-not-allowed' : 'active:scale-[0.99]'}
      `}
      style={
        selected
          ? {
              background: 'rgba(255,122,26,0.08)',
              border: '1px solid rgba(255,122,26,0.35)',
              boxShadow: '0 0 0 1px rgba(255,122,26,0.15)',
            }
          : disabled
            ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }
            : { background: 'var(--color-surface)', border: '1px solid var(--color-border)' }
      }
      onMouseEnter={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.background = 'var(--color-elevated)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.background = 'var(--color-surface)'
          e.currentTarget.style.borderColor = 'var(--color-border)'
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Radio dot */}
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-150 ${
            selected ? 'scale-110' : ''
          }`}
          style={
            selected
              ? { borderColor: '#FF7A1A', background: 'rgba(255,122,26,0.1)' }
              : { borderColor: 'rgba(255,255,255,0.2)' }
          }
        >
          {selected && (
            <div className="w-2 h-2 rounded-full" style={{ background: '#FF7A1A' }} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {icon && (
              <span className="text-base leading-none" style={{ color: selected ? '#FF7A1A' : '#64748B' }}>
                {icon}
              </span>
            )}
            <span className="text-sm font-semibold tracking-tight" style={{ color: selected ? '#F8FAFC' : '#CBD5E1' }}>
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs leading-relaxed" style={{ color: selected ? '#94A3B8' : '#475569' }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
