/**
 * Badge — Midnight Studio variant chips
 * variant: 'default' | 'orange' | 'teal' | 'purple' | 'blue' | 'success' | 'warning' | 'danger'
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/8 text-slate-300 border border-white/12',
    orange:  'bg-orange-500/10 text-orange-300 border border-orange-500/25',
    teal:    'bg-teal-500/10 text-teal-300 border border-teal-500/25',
    purple:  'bg-violet-500/10 text-violet-300 border border-violet-500/25',
    blue:    'bg-blue-500/10 text-blue-300 border border-blue-500/25',
    success: 'bg-green-500/10 text-green-400 border border-green-500/25',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/25',
    danger:  'bg-red-500/10 text-red-400 border border-red-500/25',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
