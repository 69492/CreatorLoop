import { createContext, useContext, useState, useCallback, useRef } from 'react'

/**
 * Lightweight toast notification system — Midnight Studio design.
 */
const ToastContext = createContext(null)

let _nextId = 0

const TYPE_CONFIG = {
  success: {
    icon: '✓',
    accentColor: '#22C55E',
    borderColor: 'rgba(34,197,94,0.2)',
    iconColor: '#22C55E',
  },
  error: {
    icon: '✕',
    accentColor: '#EF4444',
    borderColor: 'rgba(239,68,68,0.2)',
    iconColor: '#EF4444',
  },
  info: {
    icon: 'i',
    accentColor: '#FF7A1A',
    borderColor: 'rgba(255,122,26,0.2)',
    iconColor: '#FF7A1A',
  },
}

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

function ToastContainer({ toasts, dismiss }) {
  if (!toasts.length) return null
  return (
    <div
      className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const cfg = TYPE_CONFIG[t.type] ?? TYPE_CONFIG.info
        return (
          <div
            key={t.id}
            className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl max-w-[320px] w-full animate-slide-up text-sm font-medium border"
            style={{
              background: 'var(--color-elevated)',
              borderColor: cfg.borderColor,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
            }}
            role="alert"
          >
            {/* Icon */}
            <span
              className="shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: `${cfg.accentColor}15`, border: `1px solid ${cfg.accentColor}30`, color: cfg.iconColor }}
              aria-hidden="true"
            >
              {cfg.icon}
            </span>
            <span className="flex-1 leading-snug text-slate-200">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-40 hover:opacity-80 transition-opacity ml-1 text-slate-400"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
