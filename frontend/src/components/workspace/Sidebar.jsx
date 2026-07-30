import { NavLink, Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import { useAuth } from '@/contexts/AuthContext'
import {
  HiViewGrid,
  HiPencilAlt,
  HiFolder,
  HiTemplate,
  HiUser,
  HiCog,
  HiQuestionMarkCircle,
} from 'react-icons/hi'

const NAV_ITEMS = [
  { label: 'Overview',  to: '/workspace', icon: <HiViewGrid size={15} />,  end: true  },
  { label: 'Create',    to: '/create',    icon: <HiPencilAlt size={15} />, end: false },
  { label: 'Projects',  to: '/projects',  icon: <HiFolder size={15} />,    end: false },
  { label: 'Templates', to: '/templates', icon: <HiTemplate size={15} />,  disabled: true },
]

const BOTTOM_ITEMS = [
  { label: 'Profile',  to: '/profile',  icon: <HiUser size={15} /> },
  { label: 'Settings', to: '/settings', icon: <HiCog size={15} />  },
  { label: 'Help',     to: '/help',     icon: <HiQuestionMarkCircle size={15} /> },
]

export default function Sidebar() {
  const { user } = useAuth()
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Creator'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 min-h-screen"
      style={{
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Brand */}
      <div
        className="h-14 flex items-center px-4 shrink-0"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <Link
          to="/workspace"
          aria-label="CreatorLoop — workspace home"
          className="rounded-lg focus-visible:outline-none"
        >
          <Logo size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Workspace navigation">
        {/* Section label */}
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-700 select-none">
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 cursor-default select-none"
                aria-label={`${item.label} — coming soon`}
              >
                <span className="shrink-0 opacity-35">{item.icon}</span>
                <span className="text-sm flex-1 opacity-35">{item.label}</span>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest text-slate-600"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  Soon
                </span>
              </div>
            )
          }
          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(255,122,26,0.08)',
                border: '1px solid rgba(255,122,26,0.18)',
              } : {}}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full"
                      style={{ background: 'linear-gradient(to bottom, #FF7A1A, #FF9A4D)' }}
                      aria-hidden="true"
                    />
                  )}
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-brand-orange' : 'text-slate-600 group-hover:text-slate-300'}`}
                        style={isActive ? { color: '#FF7A1A' } : {}}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}

        {/* Divider */}
        <div className="h-px mx-1 my-3" style={{ background: 'var(--color-border)' }} />

        {/* Account label */}
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-700 select-none">
          Account
        </p>

        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(255,122,26,0.08)',
              border: '1px solid rgba(255,122,26,0.18)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full"
                    style={{ background: 'linear-gradient(to bottom, #FF7A1A, #FF9A4D)' }}
                    aria-hidden="true"
                  />
                )}
                <span className={`shrink-0 transition-colors ${isActive ? '' : 'text-slate-600 group-hover:text-slate-300'}`}
                      style={isActive ? { color: '#FF7A1A' } : {}}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--color-border)' }}>
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 group"
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.background = ''}
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0"
              style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF7A1A, #2DD4BF)' }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-400 truncate group-hover:text-slate-200 transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-700 truncate">{user?.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
