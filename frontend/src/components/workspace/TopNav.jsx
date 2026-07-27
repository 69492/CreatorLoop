import { useLocation } from 'react-router-dom'
import { HiBell, HiUser } from 'react-icons/hi'
import Logo from '@/components/common/Logo'
import { Link } from 'react-router-dom'

const PAGE_TITLES = {
  '/workspace': 'Dashboard Overview',
  '/create':    'New Creation',
  '/results':   'Generation Results',
  '/projects':  'Projects Workspace',
}

function getTitleForPath(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/projects/')) return 'Project Workspace'
  return 'CreatorLoop Workspace'
}

export default function TopNav() {
  const { pathname } = useLocation()
  const title = getTitleForPath(pathname)

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-navy-800/50 backdrop-blur-md shrink-0 sticky top-0 z-40">
      {/* Left — mobile logo + page title */}
      <div className="flex items-center gap-3">
        {/* Mobile-only brand */}
        <div className="md:hidden">
          <Link to="/workspace" aria-label="CreatorLoop home">
            <Logo size="sm" />
          </Link>
        </div>
        <span className="text-sm font-semibold text-gray-200 hidden md:block">{title}</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          aria-label="Notifications"
          title="Notifications"
        >
          <HiBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2.5 p-1.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
          aria-label="User Account"
          title="Account Settings"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-md">
            <HiUser size={14} className="text-white" />
          </div>
          <span className="text-xs font-medium text-gray-300 hidden sm:block">Creator</span>
        </button>
      </div>
    </header>
  )
}
