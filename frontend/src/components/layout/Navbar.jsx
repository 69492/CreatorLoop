import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { HiMenuAlt3, HiX, HiArrowRight } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
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
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-xl'
          : 'bg-transparent'
      }`}
      style={scrolled ? {
        background: 'rgba(8,13,26,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      } : {}}
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
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-white/8'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-150"
              aria-label="GitHub repository"
            >
              <FaGithub size={14} />
              GitHub
            </a>
          </li>
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to="/workspace" className="btn-primary px-5 py-2 text-sm">
              Go to Workspace
              <HiArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                Sign In
              </Link>
              <Link to="/auth" className="btn-primary px-5 py-2 text-sm">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/8 transition-all duration-150"
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
          className="md:hidden backdrop-blur-xl animate-fade-in-down"
          style={{
            background: 'rgba(8,13,26,0.96)',
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
                    `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive ? 'text-white bg-white/8' : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-150"
              >
                <FaGithub size={14} />
                GitHub
              </a>
            </li>
            <li className="pt-1 flex flex-col gap-2">
              {isAuthenticated ? (
                <Link
                  to="/workspace"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center py-2.5"
                >
                  Go to Workspace
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="btn-secondary w-full justify-center py-2.5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMenuOpen(false)}
                    className="btn-primary w-full justify-center py-2.5"
                  >
                    Get Started Free
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
