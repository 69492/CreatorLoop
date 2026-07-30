/**
 * Card — Midnight Studio card wrapper
 * hover: true (adds hover lift + border brightening)
 * compact: true (reduces padding)
 * elevated: true (slightly lighter surface)
 */
export default function Card({ children, className = '', hover = false, compact = false, elevated = false, id, ...props }) {
  let base = hover ? 'card-hover' : elevated ? 'card-elevated' : 'card'
  const padding = compact ? 'p-4' : 'p-6'

  return (
    <div id={id} className={`${base} ${padding} ${className}`} {...props}>
      {children}
    </div>
  )
}
