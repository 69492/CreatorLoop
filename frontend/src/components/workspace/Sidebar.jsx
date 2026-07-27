import { NavLink, Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'
import Badge from '@/components/ui/Badge'
import {
  HiViewGrid,
  HiPencilAlt,
  HiFolder,
  HiTemplate,
  HiCog,
  HiClock,
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
    label: 'Projects',
    to: '/projects',
    icon: <HiFolder size={18} />,
    disabled: false,
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: <HiTemplate size={18} />,
    disabled: true,
    badge: 'Coming Soon',
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: <HiCog size={18} />,
    disabled: true,
    badge: 'Beta',
  },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-navy-800/80 border-r border-white/10 min-h-screen backdrop-blur-md">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-white/10 shrink-0">
        <Link to="/workspace" aria-label="CreatorLoop workspace" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5" aria-label="Workspace navigation">
        {NAV_ITEMS.map((item) => {
          if (item.disabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 cursor-not-allowed select-none opacity-60 hover:opacity-75 transition-opacity"
                title={`${item.label} (${item.badge})`}
              >
                <span>{item.icon}</span>
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                    {item.badge}
                  </span>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === '/workspace'}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-purple/20 text-white border border-brand-purple/35 shadow-sm shadow-brand-purple/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-brand-purple-light" />
                  )}
                  <span className={isActive ? 'text-brand-purple-light' : 'text-gray-400 group-hover:text-white'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="glass-card px-3 py-3 text-center flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-gray-300">CreatorLoop</span>
          </div>
          <Badge variant="purple">v1.0 Pro</Badge>
        </div>
      </div>
    </aside>
  )
}
