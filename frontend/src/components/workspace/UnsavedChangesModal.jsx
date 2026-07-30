import { useEffect, useRef } from 'react'
import { HiExclamation } from 'react-icons/hi'

/**
 * UnsavedChangesModal
 *
 * Accessible confirmation dialog that blocks navigation when there are unsaved changes.
 *
 * Props:
 *   open      {boolean}  - Show/hide
 *   onStay    {Function} - User chose "Cancel / Stay on this page"
 *   onDiscard {Function} - User chose "Discard / Leave without saving"
 */
export default function UnsavedChangesModal({ open, onStay, onDiscard }) {
  const discardRef = useRef(null)
  const stayRef    = useRef(null)

  // Focus trap — focus "Stay" button when modal opens
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => stayRef.current?.focus())
    }
  }, [open])

  // ESC key → stay
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onStay?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onStay])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ucm-title"
      aria-describedby="ucm-desc"
      // Click outside → stay
      onMouseDown={(e) => { if (e.target === e.currentTarget) onStay?.() }}
    >
      <div
        className="w-full max-w-md animate-scale-in-spring rounded-2xl p-6"
        style={{
          background: 'rgba(15,23,42,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
          style={{
            background: 'rgba(255,122,26,0.1)',
            border: '1px solid rgba(255,122,26,0.2)',
            color: '#FF9A4D',
          }}
        >
          <HiExclamation size={24} />
        </div>

        {/* Title */}
        <h2
          id="ucm-title"
          className="text-white font-bold text-lg mb-2 tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Unsaved Changes
        </h2>

        {/* Description */}
        <p id="ucm-desc" className="text-sm text-slate-400 leading-relaxed mb-6">
          You have unsaved changes.
          <br />
          If you leave now, your current progress will be lost.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          {/* Discard — secondary, less prominent */}
          <button
            ref={discardRef}
            type="button"
            onClick={onDiscard}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: '#fca5a5',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.06)'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.18)'
            }}
          >
            Discard
          </button>

          {/* Stay — primary CTA */}
          <button
            ref={stayRef}
            type="button"
            onClick={onStay}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-150 focus-visible:outline-none"
            style={{
              background: 'var(--color-orange)',
              border: '1px solid rgba(255,154,77,0.3)',
              boxShadow: '0 2px 8px rgba(255,122,26,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-orange-light)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-orange)'
              e.currentTarget.style.transform = ''
            }}
          >
            Stay on this page
          </button>
        </div>
      </div>
    </div>
  )
}
