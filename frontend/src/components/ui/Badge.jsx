/**
 * Reusable badge / pill chip.
 */
export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-white/10 text-gray-300',
    purple: 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30',
    blue: 'bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30',
  }

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] ?? variants.default}`}
    >
      {children}
    </span>
  )
}
