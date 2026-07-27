/**
 * Reusable badge / pill chip.
 * variant: 'default' | 'purple' | 'blue' | 'success' | 'warning' | 'danger'
 */
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-gray-300 border border-white/15',
    purple: 'bg-brand-purple/15 text-brand-purple-light border border-brand-purple/30',
    blue: 'bg-brand-blue/15 text-brand-blue-light border border-brand-blue/30',
    success: 'bg-green-500/15 text-green-400 border border-green-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-xs transition-colors ${variants[variant] ?? variants.default} ${className}`}
    >
      {children}
    </span>
  )
}
