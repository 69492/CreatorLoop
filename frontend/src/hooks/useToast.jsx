import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from 'react-icons/hi'

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

const TYPE_CONFIG = {
  success: {
    icon: <HiCheckCircle size={16} />,
    cls: 'border-emerald-500/30 text-emerald-300',
    iconCls: 'text-emerald-400',
    bg: 'rgba(8,17,26,0.92)',
  },
  error: {
    icon: <HiXCircle size={16} />,
    cls: 'border-red-500/30 text-red-300',
    iconCls: 'text-red-400',
    bg: 'rgba(8,17,26,0.92)',
  },
  info: {
    icon: <HiInformationCircle size={16} />,
    cls: 'border-white/12 text-gray-300',
    iconCls: 'text-brand-purple-light',
    bg: 'rgba(8,17,26,0.92)',
  },
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
        const config = TYPE_CONFIG[t.type] ?? TYPE_CONFIG.info
        return (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl
              border backdrop-blur-md
              max-w-[340px] w-full animate-slide-up text-sm font-medium
              ${config.cls}
            `}
            style={{ background: config.bg, boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
            role="alert"
          >
            <span className={`shrink-0 mt-0.5 ${config.iconCls}`} aria-hidden="true">
              {config.icon}
            </span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-40 hover:opacity-80 transition-opacity ml-1"
              aria-label="Dismiss notification"
            >
              <HiX size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
