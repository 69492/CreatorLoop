import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import Button from '@/components/ui/Button'
import GoogleOAuthButton from '@/components/auth/GoogleOAuthButton'
import Logo from '@/components/common/Logo'
import { HiEye, HiEyeOff, HiMail, HiLockClosed, HiUser, HiArrowRight } from 'react-icons/hi'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { toast } = useToast()

  const [mode, setMode]           = useState('login')
  const [loading, setLoading]     = useState(false)
  const [showPass, setShowPass]   = useState(false)

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [fullName, setFullName]   = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
        toast.success('Welcome back!')
      } else {
        await register(email, password, fullName)
        toast.success('Account created! Welcome to CreatorLoop.')
      }
      navigate('/workspace', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async () => {
    navigate('/workspace', { replace: true })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #080d1a 0%, #0c1120 40%, #0f0b1f 70%, #080d1a 100%)' }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/8 rounded-full filter blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-blue/6 rounded-full filter blur-[120px]" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(167,139,250,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <Logo size="md" />
          </Link>
          <p className="text-gray-600 text-sm mt-3">
            {isLogin ? 'Welcome back — sign in to continue.' : 'Create your account to get started.'}
          </p>
        </div>

        {/* Auth card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: 'rgba(10,15,28,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {/* Tab switcher */}
          <div
            className="flex rounded-xl overflow-hidden mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-all duration-200 rounded-xl ${
                  mode === m
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-400'
                }`}
                style={mode === m ? {
                  background: 'rgba(124,58,237,0.15)',
                  borderBottom: '2px solid rgba(167,139,250,0.7)',
                } : {}}
              >
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Google OAuth */}
          <GoogleOAuthButton onSuccess={handleGoogleSuccess} mode={mode} />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs text-gray-700 font-medium">or continue with email</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div>
                <label htmlFor="full-name" className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Full Name <span className="text-gray-700">(optional)</span>
                </label>
                <div className="relative">
                  <HiUser size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                  <input
                    id="full-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="input-base pl-9"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-gray-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base pl-9"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="auth-password" className="block text-xs font-semibold text-gray-500">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-brand-purple-light hover:text-white transition-colors duration-150"
                    onClick={() => toast.info('Password reset — contact support or use Google login.')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <HiLockClosed size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? '••••••••' : 'Min 8 characters'}
                  className="input-base pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-gray-300 transition-colors duration-150"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <HiEyeOff size={14} /> : <HiEye size={14} />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-700 mt-1.5">Must be at least 8 characters long.</p>
              )}
            </div>

            {isLogin && (
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: '#7c3aed' }}
                />
                <span className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors duration-150">
                  Keep me signed in
                </span>
              </label>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!email || !password}
              className="w-full mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              {!loading && <HiArrowRight size={15} />}
            </Button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-xs text-gray-700 mt-5">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(isLogin ? 'signup' : 'login')}
              className="text-brand-purple-light hover:text-white font-semibold transition-colors duration-150"
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Footer notice */}
        <p className="text-center text-xs text-gray-700 mt-6">
          By continuing, you agree to our{' '}
          <span className="text-gray-600">Terms of Service</span>
          {' '}and{' '}
          <span className="text-gray-600">Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
