import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { HiSparkles } from 'react-icons/hi'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

/**
 * Google OAuth login button.
 * Uses @react-oauth/google under the hood when a client ID is configured,
 * otherwise renders a disabled stub so the app still works without OAuth.
 */
export default function GoogleOAuthButton({ onSuccess, mode = 'login' }) {
  const { googleLogin } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  if (!GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl
                   border border-white/8 bg-white/3 text-gray-600 text-sm font-semibold
                   cursor-not-allowed"
        title="Configure VITE_GOOGLE_CLIENT_ID to enable Google login"
      >
        <GoogleLogo className="opacity-40" />
        <span>Continue with Google</span>
        <span className="ml-auto text-[10px] bg-navy-700 border border-white/8 px-1.5 py-0.5 rounded text-gray-600 font-bold uppercase tracking-wider">
          Configure
        </span>
      </button>
    )
  }

  const handleClick = async () => {
    // When Google client ID is configured, we use the @react-oauth/google hook
    // For now we render the GoogleLogin component from the library
    toast.info('Redirecting to Google sign-in…')
  }

  // Render the actual Google button from the library
  return <GoogleLibraryButton onSuccess={onSuccess} googleLogin={googleLogin} toast={toast} navigate={navigate} mode={mode} />
}

/**
 * Actual Google OAuth button from @react-oauth/google library.
 * Only imported + rendered when GOOGLE_CLIENT_ID is set.
 */
function GoogleLibraryButton({ onSuccess, googleLogin, toast, navigate, mode }) {
  let GoogleLogin
  try {
    GoogleLogin = require('@react-oauth/google').GoogleLogin
  } catch {
    return null
  }

  return (
    <div className="w-full [&>div]:w-full [&>div>div]:w-full">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            await googleLogin(credentialResponse.credential)
            toast.success(mode === 'signup' ? 'Account created with Google!' : 'Welcome back!')
            onSuccess?.(credentialResponse.credential)
            navigate('/workspace', { replace: true })
          } catch (err) {
            toast.error(err.message || 'Google sign-in failed.')
          }
        }}
        onError={() => toast.error('Google sign-in failed. Please try again.')}
        theme="filled_black"
        size="large"
        width="100%"
        shape="rectangular"
        text={mode === 'signup' ? 'signup_with' : 'signin_with'}
      />
    </div>
  )
}

function GoogleLogo({ className = '' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className={className}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
