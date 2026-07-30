import { useEffect, useRef } from 'react'
import { HiDocumentText, HiRefresh } from 'react-icons/hi'

/**
 * ResumeDraftModal
 *
 * Shown on Create page mount when a previous draft exists.
 *
 * Props:
 *   open       {boolean}
 *   savedAt    {string}  ISO timestamp when draft was saved
 *   onResume   {Function}
 *   onFresh    {Function}
 */
export default function ResumeDraftModal({ open, savedAt, onResume, onFresh }) {
  const resumeRef = useRef(null)

  useEffect(() => {
    if (open) requestAnimationFrame(() => resumeRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onFresh?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onFresh])

  if (!open) return null

  const fmtTime = (iso) => {
    if (!iso) return ''
    try {
      return new Date(iso).toLocaleString(undefined, {
        month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rdm-title"
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
          <HiDocumentText size={22} />
        </div>

        <h2
          id="rdm-title"
          className="text-white font-bold text-lg mb-2 tracking-tight"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          Resume your draft?
        </h2>

        <p className="text-sm text-slate-400 leading-relaxed mb-1">
          You have an unsaved draft from a previous session.
        </p>
        {savedAt && (
          <p className="text-xs text-slate-600 mb-6">
            Last saved: {fmtTime(savedAt)}
          </p>
        )}

        <div className="flex items-center gap-3 justify-end">
          <button
            type="button"
            onClick={onFresh}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color = '#f1f5f9'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color = '#94a3b8'
            }}
          >
            <HiRefresh size={14} />
            Start Fresh
          </button>

          <button
            ref={resumeRef}
            type="button"
            onClick={onResume}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-150 focus-visible:outline-none"
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
            <HiDocumentText size={14} />
            Resume Draft
          </button>
        </div>
      </div>
    </div>
  )
}
