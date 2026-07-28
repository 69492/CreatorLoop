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
      <div className="min-h-screen bg-navy-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center animate-pulse-slow">
            <HiSparkles size={22} className="text-brand-purple-light" />
          </div>
          <p className="text-xs text-gray-600 font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return children
}
