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
} from 'react-icons/hi'

const NAV_ITEMS = [
  { label: 'Overview',  to: '/workspace', icon: <HiViewGrid size={16} />,  end: true  },
  { label: 'Create',    to: '/create',    icon: <HiPencilAlt size={16} />, end: false },
  { label: 'Projects',  to: '/projects',  icon: <HiFolder size={16} />,    end: false },
  { label: 'Templates', to: '/templates', icon: <HiTemplate size={16} />,  disabled: true },
]

const BOTTOM_ITEMS = [
  { label: 'Profile',  to: '/profile',  icon: <HiUser size={16} /> },
  { label: 'Settings', to: '/settings', icon: <HiCog size={16} />  },
]

export default function Sidebar() {
  const { user } = useAuth()
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Creator'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 min-h-screen"
      style={{
        background: 'rgba(8,13,26,0.6)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Brand */}
      <div
        className="h-14 flex items-center px-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Link
          to="/workspace"
          aria-label="CreatorLoop — workspace home"
          className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
        >
          <Logo size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5" aria-label="Workspace navigation">
        {/* Section label */}
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-700 select-none">
          Navigation
        </p>

        {NAV_ITEMS.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 cursor-default select-none"
                aria-label={`${item.label} — coming soon`}
              >
                <span className="shrink-0 opacity-40">{item.icon}</span>
                <span className="text-sm flex-1 opacity-40">{item.label}</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-gray-600 uppercase tracking-widest"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
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
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-gray-200'
                }`
              }
              style={({ isActive }) => isActive ? {
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.2)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              } : {}}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full"
                      style={{ background: 'linear-gradient(to bottom, #c084fc, #a78bfa)' }}
                      aria-hidden="true"
                    />
                  )}
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-brand-purple-light' : 'text-gray-600 group-hover:text-gray-300'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}

        {/* Divider */}
        <div className="h-px mx-1 my-3" style={{ background: 'rgba(255,255,255,0.05)' }} />

        {/* Label */}
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-700 select-none">
          Account
        </p>

        {/* Bottom nav items */}
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-200'
              }`
            }
            style={({ isActive }) => isActive ? {
              background: 'rgba(124,58,237,0.12)',
              border: '1px solid rgba(124,58,237,0.2)',
            } : {}}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full"
                    style={{ background: 'linear-gradient(to bottom, #c084fc, #a78bfa)' }}
                    aria-hidden="true"
                  />
                )}
                <span className={`shrink-0 transition-colors ${isActive ? 'text-brand-purple-light' : 'text-gray-600 group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User info footer */}
      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 group"
          style={{}}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = ''}
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10"
            />
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)' }}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 truncate group-hover:text-gray-200 transition-colors">
              {displayName}
            </p>
            <p className="text-[10px] text-gray-700 truncate">{user?.email}</p>
          </div>
        </Link>
      </div>
    </aside>
  )
}
