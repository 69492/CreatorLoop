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
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-purple focus:ring-offset-2 focus:ring-offset-navy-900
        ${
          selected
            ? 'border-brand-purple/60 bg-brand-purple/15 shadow-sm'
            : disabled
              ? 'border-white/5 bg-white/3 opacity-40 cursor-not-allowed'
              : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Radio indicator */}
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
            selected ? 'border-brand-purple-light' : 'border-gray-600'
          }`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-brand-purple-light" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {icon && <span className="text-base leading-none">{icon}</span>}
            <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </button>
  )
}
