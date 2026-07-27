import { createContext, useContext, useState, useCallback, useRef } from 'react'

/**
 * Lightweight toast notification system.
 *
 * Usage:
 *   const { toast } = useToast()
 *   toast.success('Saved!')
 *   toast.error('Failed')
 *   toast.info('Processing…')
 */
const ToastContext = createContext(null)

let _nextId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const add = useCallback(
    (message, type = 'info', duration = 3000) => {
      const id = ++_nextId
      setToasts((prev) => [...prev.slice(-4), { id, message, type }])
      if (duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const toast = {
    success: (msg, opts) => add(msg, 'success', opts?.duration ?? 3000),
    error:   (msg, opts) => add(msg, 'error',   opts?.duration ?? 4500),
    info:    (msg, opts) => add(msg, 'info',     opts?.duration ?? 3000),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

// ── Visual component ──────────────────────────────────────────────────────────

const TYPE_STYLES = {
  success: 'bg-green-900/80 border-green-600/50 text-green-200',
  error:   'bg-red-900/80   border-red-600/50   text-red-200',
  info:    'bg-navy-600/90  border-white/15      text-gray-200',
}

const TYPE_ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
}

function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl
            border backdrop-blur-sm shadow-lg max-w-xs w-full
            animate-slide-up text-sm font-medium
            ${TYPE_STYLES[t.type] ?? TYPE_STYLES.info}
          `}
        >
          <span className="shrink-0 mt-0.5 text-base leading-none">
            {TYPE_ICONS[t.type]}
          </span>
          <span className="flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
