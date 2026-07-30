import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { HiSparkles } from 'react-icons/hi'

/**
 * GuestRoute — only accessible to unauthenticated users.
 * Authenticated users are redirected to /workspace with replace,
 * preventing them from returning to Login/Register via browser Back.
 */
export default function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse-slow"
            style={{ background: 'rgba(255,122,26,0.12)', border: '1px solid rgba(255,122,26,0.2)', color: '#FF9A4D' }}
          >
            <HiSparkles size={22} />
          </div>
          <p className="text-xs text-slate-600 font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    // Replace prevents going back to login with browser Back
    return <Navigate to="/workspace" replace />
  }

  return children
}
