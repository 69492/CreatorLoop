import { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { HiUser, HiLogout, HiCog, HiChevronDown, HiViewGrid } from 'react-icons/hi'
import Logo from '@/components/common/Logo'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'

const PAGE_TITLES = {
  '/workspace': { label: 'Overview',          breadcrumb: 'Workspace' },
  '/create':    { label: 'New Creation',       breadcrumb: 'Workspace' },
  '/results':   { label: 'Generation Results', breadcrumb: 'Create' },
  '/projects':  { label: 'Projects',           breadcrumb: 'Workspace' },
  '/profile':   { label: 'Profile',            breadcrumb: 'Account' },
  '/settings':  { label: 'Settings',           breadcrumb: 'Account' },
}

function getTitleForPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/projects/')) return { label: 'Project Detail', breadcrumb: 'Projects' }
  return { label: 'Workspace', breadcrumb: 'App' }
}

export default function TopNav() {
  const { pathname } = useLocation()
  const { label, breadcrumb } = getTitleForPath(pathname)
  const { user, logout, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    toast.success('Signed out successfully')
    navigate('/', { replace: true })
  }

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Creator'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-40"
      style={{
        background: 'rgba(8,13,26,0.7)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
      }}
    >
      {/* Left — logo on mobile / breadcrumb on desktop */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <Link to="/workspace" aria-label="CreatorLoop — workspace home">
            <Logo size="sm" />
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-gray-600 font-medium">{breadcrumb}</span>
          <svg className="w-3 h-3 text-gray-700" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M1 1l4 4-4 4" />
          </svg>
          <span className="text-gray-300 font-semibold">{label}</span>
        </div>
      </div>

      {/* Right — user dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          style={dropdownOpen ? { background: 'rgba(255,255,255,0.08)' } : {}}
          onMouseEnter={(e) => { if (!dropdownOpen) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={(e) => { if (!dropdownOpen) e.currentTarget.style.background = '' }}
          aria-label="Account menu"
          aria-expanded={dropdownOpen}
          aria-haspopup="menu"
        >
          {/* Avatar */}
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold ring-1 ring-white/10"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
            >
              {initials}
            </div>
          )}
          <span className="text-xs font-medium text-gray-400 hidden sm:block max-w-[120px] truncate">
            {displayName}
          </span>
          <HiChevronDown
            size={12}
            className={`text-gray-600 transition-transform duration-150 hidden sm:block ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setDropdownOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-11 z-20 w-56 rounded-2xl p-1.5 animate-scale-in-spring"
              style={{
                background: 'rgba(6,11,22,0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
              }}
              role="menu"
              aria-label="Account options"
            >
              {/* User info */}
              <div
                className="px-3 py-3 mb-1"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-xs font-semibold text-white truncate">
                  {user?.full_name || displayName}
                </p>
                <p className="text-xs text-gray-600 truncate mt-0.5">{user?.email}</p>
              </div>

              <MenuLink
                to="/workspace"
                onClick={() => setDropdownOpen(false)}
                icon={<HiViewGrid size={13} />}
                label="Dashboard"
              />
              <MenuLink
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                icon={<HiUser size={13} />}
                label="Profile"
              />
              <MenuLink
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                icon={<HiCog size={13} />}
                label="Settings"
              />

              <div className="h-px my-1.5" style={{ background: 'rgba(255,255,255,0.07)' }} />

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-400 transition-all duration-150"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = ''}
                role="menuitem"
              >
                <HiLogout size={13} />
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 transition-all duration-150"
      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
      role="menuitem"
    >
      {icon}
      {label}
    </Link>
  )
}
