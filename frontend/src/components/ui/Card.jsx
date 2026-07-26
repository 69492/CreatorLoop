/**
 * Glassmorphism card wrapper.
 * hover: true (adds hover lift effect)
 */
export default function Card({ children, className = '', hover = false }) {
  return (
    <div
      className={`glass-card p-6 ${
        hover
          ? 'transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-navy-500/50 cursor-default'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
