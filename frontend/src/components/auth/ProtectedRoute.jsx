import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { HiSparkles } from 'react-icons/hi'

/**
 * Wraps routes that require authentication.
 * Shows a loading spinner while the auth state is being initialized.
 * Redirects to /auth if not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

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

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" state={{ from: location }} replace />
  }

  return children
}
