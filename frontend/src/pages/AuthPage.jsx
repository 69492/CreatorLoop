import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import GoogleOAuthButton from '@/components/auth/GoogleOAuthButton'
import Logo from '@/components/common/Logo'
import { HiEye, HiEyeOff, HiArrowRight, HiMail, HiLockClosed, HiCheckCircle, HiUser } from 'react-icons/hi'

/* ─────────────────────────────────────────────────────────────
   Shared layout wrapper
───────────────────────────────────────────────────────────── */
export function AuthLayout({ children, title, subtitle }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-[130px] opacity-18"
             style={{ background: '#FF7A1A' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[110px] opacity-12"
             style={{ background: '#2DD4BF' }} />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block" aria-label="CreatorLoop — back to homepage">
            <Logo size="md" />
          </Link>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-3">{subtitle}</p>
          )}
        </div>

        {children}

        <p className="text-center text-xs text-slate-700 mt-6 leading-relaxed">
          By continuing, you agree to our{' '}
          <span className="text-slate-500 cursor-default">Terms of Service</span>
          {' '}and{' '}
          <span className="text-slate-500 cursor-default">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Field error helper
───────────────────────────────────────────────────────────── */
function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5" role="alert">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.5" stroke="#F87171" strokeWidth="1" />
        <path d="M6 3.5v3M6 8v.5" stroke="#F87171" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  )
}

/* ─────────────────────────────────────────────────────────────
   Password strength bar (sign-up only)
───────────────────────────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null
  const score = password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3
  const labels  = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colours = ['', '#EF4444', '#F59E0B', '#22C55E', '#2DD4BF']
  return (
    <div className="mt-2 space-y-1" aria-live="polite" aria-label={`Password strength: ${labels[score]}`}>
      <div className="flex gap-1" role="presentation">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
               style={{ background: i <= score ? colours[score] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colours[score] }}>{labels[score]}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sign In
───────────────────────────────────────────────────────────── */
export function SignInPage() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { login } = useAuth()
  const { toast } = useToast()

  const from = location.state?.from?.pathname || '/workspace'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [success, setSuccess]   = useState(false)

  // Redirect already-authenticated users
  const { isAuthenticated } = useAuth()
  useEffect(() => { if (isAuthenticated) navigate('/workspace', { replace: true }) }, [isAuthenticated, navigate])

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Password is required.'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await login(email, password)
      setSuccess(true)
      toast.success('Welcome back!')
      setTimeout(() => navigate(from, { replace: true }), 300)
    } catch (err) {
      const msg = (err.message || '').toLowerCase()
      if (msg.includes('password') || msg.includes('credential') || msg.includes('incorrect')) {
        setErrors({ password: 'Incorrect email or password.' })
      } else if (msg.includes('not found') || msg.includes('no account')) {
        setErrors({ email: 'No account found with this email.' })
      } else {
        toast.error(err.message || 'Sign in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Welcome back — sign in to continue.">
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Sign in</h1>
          <p className="text-sm text-slate-500">Sign in to your CreatorLoop account.</p>
        </div>

        <GoogleOAuthButton mode="login" />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="text-xs text-slate-600 font-medium">or continue with email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                placeholder="you@example.com"
                className="input-base pl-9"
                aria-describedby={errors.email ? 'signin-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
            </div>
            <FieldError id="signin-email-err" message={errors.email} />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-400">
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: '#FF7A1A' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9A4D')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <HiLockClosed size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
              <input
                id="signin-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                placeholder="••••••••"
                className="input-base pl-9 pr-10"
                aria-describedby={errors.password ? 'signin-pass-err' : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors duration-150"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <HiEyeOff size={14} /> : <HiEye size={14} />}
              </button>
            </div>
            <FieldError id="signin-pass-err" message={errors.password} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full mt-2"
          >
            {success ? (
              <>
                <HiCheckCircle size={16} />
                Signed In
              </>
            ) : (
              <>
                Sign In
                {!loading && <HiArrowRight size={15} />}
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-5">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="font-semibold transition-colors duration-150"
            style={{ color: '#FF7A1A' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

/* ─────────────────────────────────────────────────────────────
   Sign Up
───────────────────────────────────────────────────────────── */
export function SignUpPage() {
  const navigate     = useNavigate()
  const { register } = useAuth()
  const { toast }    = useToast()

  const { isAuthenticated } = useAuth()
  useEffect(() => { if (isAuthenticated) navigate('/workspace', { replace: true }) }, [isAuthenticated, navigate])

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState({})
  const [success, setSuccess]   = useState(false)

  const validate = () => {
    const e = {}
    if (!email) e.email = 'Email is required.'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.'
    if (!password) e.password = 'Password is required.'
    else if (password.length < 8) e.password = 'Must be at least 8 characters.'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    try {
      await register(email, password, fullName)
      setSuccess(true)
      toast.success('Account created — welcome to CreatorLoop!')
      setTimeout(() => navigate('/workspace', { replace: true }), 400)
    } catch (err) {
      const msg = (err.message || '').toLowerCase()
      if (msg.includes('already') || msg.includes('exist') || msg.includes('duplicate')) {
        setErrors({ email: 'An account with this email already exists.' })
      } else {
        toast.error(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Create your free account. No credit card required.">
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white tracking-tight mb-1">Create your account</h1>
          <p className="text-sm text-slate-500">Free forever. No credit card required.</p>
        </div>

        <GoogleOAuthButton mode="signup" />

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          <span className="text-xs text-slate-600 font-medium">or continue with email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Full Name <span className="text-slate-700 font-normal">(optional)</span>
            </label>
            <div className="relative">
              <HiUser size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="input-base pl-9"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })) }}
                placeholder="you@example.com"
                className="input-base pl-9"
                aria-describedby={errors.email ? 'signup-email-err' : undefined}
                aria-invalid={!!errors.email}
              />
            </div>
            <FieldError id="signup-email-err" message={errors.email} />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiLockClosed size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
              <input
                id="signup-password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })) }}
                placeholder="Min 8 characters"
                className="input-base pl-9 pr-10"
                aria-describedby="signup-pass-strength"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors duration-150"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <HiEyeOff size={14} /> : <HiEye size={14} />}
              </button>
            </div>
            <div id="signup-pass-strength">
              <PasswordStrength password={password} />
            </div>
            <FieldError message={errors.password} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            disabled={loading}
            className="w-full mt-2"
          >
            {success ? (
              <>
                <HiCheckCircle size={16} />
                Account Created!
              </>
            ) : (
              <>
                Create Account
                {!loading && <HiArrowRight size={15} />}
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-5">
          Already have an account?{' '}
          <Link
            to="/auth/signin"
            className="font-semibold transition-colors duration-150"
            style={{ color: '#FF7A1A' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#F8FAFC')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}

/* ─────────────────────────────────────────────────────────────
   Forgot Password
───────────────────────────────────────────────────────────── */
export function ForgotPasswordPage() {
  const { toast } = useToast()

  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!email) { setError('Email is required.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return }
    setError('')
    setLoading(true)
    // UI-layer simulation — backend endpoint not yet wired
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
    toast.success('If that account exists, a reset link has been sent.')
  }

  return (
    <AuthLayout subtitle={submitted ? undefined : 'Enter your email to receive a reset link.'}>
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        }}
      >
        {submitted ? (
          <div className="text-center py-4 animate-fade-in">
            {/* Success state */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}
            >
              ✉️
            </div>
            <h2 className="text-lg font-bold text-white mb-2 tracking-tight">Check your inbox</h2>
            <p className="text-sm text-slate-400 leading-relaxed mb-2 max-w-xs mx-auto">
              If an account exists for{' '}
              <strong className="text-slate-200 font-semibold">{email}</strong>, you'll receive a
              password reset link shortly.
            </p>
            <p className="text-xs text-slate-600 mb-7">
              Didn't receive it? Check your spam folder.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                type="button"
                onClick={() => { setSubmitted(false); setEmail('') }}
                className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
              >
                Try a different email
              </button>
              <span className="hidden sm:block text-slate-700 text-xs self-center">·</span>
              <Link to="/auth/signin" className="text-xs font-semibold"
                    style={{ color: '#FF7A1A' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9A4D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}>
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white tracking-tight mb-1">Reset your password</h1>
              <p className="text-sm text-slate-500">We'll send a secure reset link to your email.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <HiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" aria-hidden="true" />
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="you@example.com"
                    className="input-base pl-9"
                    aria-describedby={error ? 'forgot-email-err' : undefined}
                    aria-invalid={!!error}
                  />
                </div>
                <FieldError id="forgot-email-err" message={error} />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={!email || loading}
                className="w-full"
              >
                Send Reset Link
              </Button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-5">
              Remember your password?{' '}
              <Link to="/auth/signin" className="font-semibold"
                    style={{ color: '#FF7A1A' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#F8FAFC')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}>
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

/* ─────────────────────────────────────────────────────────────
   Legacy /auth redirect → /auth/signin
───────────────────────────────────────────────────────────── */
export default function AuthPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    navigate(isAuthenticated ? '/workspace' : '/auth/signin', { replace: true })
  }, [isAuthenticated, navigate])

  return null
}
