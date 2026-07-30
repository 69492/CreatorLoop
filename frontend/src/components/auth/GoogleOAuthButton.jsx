/**
 * GoogleOAuthButton — custom-styled Google sign-in button.
 *
 * Uses @react-oauth/google's `useGoogleLogin` (popup flow) so we can apply
 * our own design instead of rendering Google's fixed-style button widget.
 *
 * The GoogleOAuthProvider wrapping the app (App.jsx) must have a clientId.
 * If VITE_GOOGLE_CLIENT_ID is not set the button renders in a graceful
 * "not configured" state that looks identical but shows a tooltip — never
 * crashes or shows an ugly disabled stub.
 *
 * Flow:
 *   1. User clicks button → Google popup opens
 *   2. User authenticates → Google returns a credential (ID token)
 *   3. We POST { credential } to POST /api/auth/google
 *   4. Backend verifies & returns { access_token, user }
 *   5. AuthContext persists the session and we redirect to /workspace
 */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'

const CLIENT_ID_SET = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

/* ── Google "G" logo — official 2023 colours ──────────────────────────────── */
function GoogleLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

/* ── Spinner ──────────────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      className="animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function GoogleOAuthButton({ mode = 'login' }) {
  const { googleLogin } = useAuth()
  const { toast }       = useToast()
  const navigate        = useNavigate()

  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isSignup = mode === 'signup'
  const label    = isSignup ? 'Sign up with Google' : 'Continue with Google'

  /* ── Success handler — called after Google popup resolves ─────────────── */
  const handleGoogleSuccess = useCallback(
    async (tokenResponse) => {
      // tokenResponse.access_token is a Google OAuth2 access token (NOT an ID token).
      // useGoogleLogin with flow="auth-code" returns code; with flow="implicit" returns access_token.
      // We use flow="implicit" here — googleLogin() calls the backend POST /api/auth/google
      // which verifies via Google's tokeninfo endpoint.
      const credential = tokenResponse.access_token

      if (!credential) {
        toast.error('Google returned an empty credential. Please try again.')
        setLoading(false)
        return
      }

      try {
        await googleLogin(credential)
        toast.success(isSignup ? 'Account created — welcome to CreatorLoop!' : 'Welcome back!')
        navigate('/workspace', { replace: true })
      } catch (err) {
        const msg = (err?.message || '').toLowerCase()
        if (msg.includes('network') || msg.includes('fetch')) {
          toast.error('Network error. Please check your connection and try again.')
        } else {
          toast.error(err?.message || 'Google sign-in failed. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    },
    [googleLogin, navigate, toast, isSignup],
  )

  /* ── Error handler — popup closed / blocked / failed ─────────────────── */
  const handleGoogleError = useCallback(() => {
    setLoading(false)
    // Do NOT show a toast for popup_closed_by_user — that is intentional UX
    // (user clicked the X on the Google popup). Only log for actual errors.
  }, [])

  /* ── Hook — must always be called (Rules of Hooks) ───────────────────── */
  const openGooglePopup = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError:   handleGoogleError,
    onNonOAuthError: (error) => {
      setLoading(false)
      if (error.type !== 'popup_closed') {
        toast.error('Google sign-in was cancelled or blocked. Please try again.')
      }
    },
    flow: 'implicit',
  })

  /* ── Click handler ────────────────────────────────────────────────────── */
  const handleClick = useCallback(() => {
    if (loading) return

    if (!CLIENT_ID_SET) {
      toast.info('Google OAuth is not configured. Set VITE_GOOGLE_CLIENT_ID to enable it.')
      return
    }

    setLoading(true)
    openGooglePopup()
  }, [loading, openGooglePopup, toast])

  /* ── Dynamic styles ───────────────────────────────────────────────────── */
  const buttonStyle = {
    // White background — matches Google's brand guidelines for OAuth buttons
    // and stays legible on the dark CreatorLoop surface
    background:    loading ? 'rgba(255,255,255,0.90)' : hovered ? '#f5f5f5' : '#ffffff',
    border:        '1px solid rgba(0,0,0,0.12)',
    borderRadius:  '10px',
    boxShadow:     hovered && !loading
      ? '0 2px 12px rgba(0,0,0,0.20), 0 1px 4px rgba(0,0,0,0.12)'
      : '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
    transform:     hovered && !loading ? 'translateY(-1px)' : 'none',
    transition:    'all 180ms cubic-bezier(0.4,0,0.2,1)',
    cursor:        loading ? 'wait' : 'pointer',
    opacity:       loading ? 0.85 : 1,
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={()    => setHovered(true)}
      onBlur={()     => setHovered(false)}
      disabled={loading}
      aria-label={label}
      aria-busy={loading}
      style={buttonStyle}
      className="w-full flex items-center justify-center gap-3 px-4 h-11 text-sm font-semibold select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      {/* Logo or spinner */}
      <span className="shrink-0 w-[18px] flex items-center justify-center">
        {loading ? <Spinner /> : <GoogleLogo />}
      </span>

      {/* Label */}
      <span
        style={{
          color:          '#3c4043',
          fontFamily:     "'Google Sans', Roboto, -apple-system, sans-serif",
          fontSize:       '14px',
          fontWeight:     600,
          letterSpacing:  '0.01em',
        }}
      >
        {loading ? 'Connecting…' : label}
      </span>
    </button>
  )
}
