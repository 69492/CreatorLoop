import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiMenuAlt3, HiX, HiArrowRight } from 'react-icons/hi'
import Logo from '@/components/common/Logo'
import { useAuth } from '@/contexts/AuthContext'

const NAV_LINKS = [
  { label: 'Home',  to: '/' },
  { label: 'About', to: '/about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(5,8,22,0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      } : { background: 'transparent' }}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link to="/" className="flex items-center shrink-0" aria-label="CreatorLoop — home">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0.5" role="list">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-white/8'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/workspace" className="btn-primary px-5 py-2 text-sm">
              Open Workspace
              <HiArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/auth/signin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="btn-primary px-5 py-2 text-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/8 transition-all duration-150"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <HiX size={20} /> : <HiMenuAlt3 size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="md:hidden animate-fade-in-down"
          style={{
            background: 'rgba(5,8,22,0.97)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <ul className="px-4 py-4 flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive ? 'text-white bg-white/8' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="pt-1 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/workspace"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center py-2.5"
                >
                  Open Workspace
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary w-full justify-center py-2.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary w-full justify-center py-2.5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
