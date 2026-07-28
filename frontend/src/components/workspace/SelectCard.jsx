/**
 * Selectable option card used in the Create page.
 * selected: bool, onClick: fn, icon, label, description
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
      className={`w-full text-left p-4 rounded-2xl transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900
        ${disabled ? 'opacity-35 cursor-not-allowed' : 'active:scale-[0.99]'}
      `}
      style={
        selected
          ? {
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.45)',
              boxShadow: '0 0 0 1px rgba(124,58,237,0.2), 0 2px 8px rgba(124,58,237,0.15)',
            }
          : disabled
            ? { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
      }
      onMouseEnter={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
        }
      }}
      onMouseLeave={(e) => {
        if (!selected && !disabled) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
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
              ? { borderColor: 'rgba(167,139,250,1)', background: 'rgba(124,58,237,0.15)' }
              : { borderColor: 'rgba(255,255,255,0.2)' }
          }
        >
          {selected && (
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #c084fc, #a78bfa)' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {icon && (
              <span className={`text-base leading-none ${selected ? 'text-brand-purple-light' : 'text-gray-500'}`}>
                {icon}
              </span>
            )}
            <span className={`text-sm font-semibold tracking-tight ${selected ? 'text-white' : 'text-gray-300'}`}>
              {label}
            </span>
          </div>
          {description && (
            <p className={`text-xs leading-relaxed ${selected ? 'text-gray-400' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
