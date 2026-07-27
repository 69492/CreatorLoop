/**
 * Glassmorphism card wrapper.
 * hover: true (adds hover lift effect)
 * compact: true (reduces padding)
 */
export default function Card({ children, className = '', hover = false, compact = false, ...props }) {
  const baseStyle = hover ? 'glass-card-hover' : 'glass-card'
  const paddingStyle = compact ? 'p-4' : 'p-6'

  return (
    <div className={`${baseStyle} ${paddingStyle} ${className}`} {...props}>
      {children}
    </div>
  )
}
