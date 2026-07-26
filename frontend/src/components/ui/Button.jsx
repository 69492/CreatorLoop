/**
 * Reusable button component.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
import { forwardRef } from 'react'

const Button = forwardRef(function Button(
  { children, variant = 'primary', className = '', disabled = false, ...props },
  ref
) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost:
      'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 font-semibold text-sm transition-all duration-200 focus:outline-none active:scale-95',
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${variants[variant] ?? variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

export default Button
