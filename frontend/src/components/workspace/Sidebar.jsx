import { NavLink, Link, useLocation } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import {
  HiViewGrid,
  HiPencilAlt,
  HiCollection,
  HiTemplate,
  HiCog,
  HiLockClosed,
} from 'react-icons/hi'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/workspace',
    icon: <HiViewGrid size={18} />,
    disabled: false,
  },
  {
    label: 'Create',
    to: '/create',
    icon: <HiPencilAlt size={18} />,
    disabled: false,
  },
  {
    label: 'History',
    to: '/history',
    icon: <HiCollection size={18} />,
    disabled: true,
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: <HiTemplate size={18} />,
    disabled: true,
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <HiCog size={18} />,
    disabled: true,
  },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-navy-800/60 border-r border-white/10 min-h-screen">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
        <Link to="/workspace" aria-label="CreatorLoop workspace">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1" aria-label="Workspace navigation">
        {NAV_ITEMS.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 cursor-not-allowed select-none"
                title="Coming soon"
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                <HiLockClosed size={12} className="text-gray-700" />
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/workspace'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-purple/20 text-white border border-brand-purple/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="glass-card px-3 py-3 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Phase 2 — AI features
            <br />
            arriving in Phase 3
          </p>
        </div>
      </div>
    </aside>
  )
}
