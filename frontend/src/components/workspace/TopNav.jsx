import { useLocation } from 'react-router-dom'
import { HiBell, HiUser } from 'react-icons/hi'
import Logo from '@/components/common/Logo'
import { Link } from 'react-router-dom'

const PAGE_TITLES = {
  '/workspace': 'Dashboard',
  '/create': 'New Creation',
  '/results': 'Results',
}

export default function TopNav() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'CreatorLoop'

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-navy-800/40 backdrop-blur-sm shrink-0">
      {/* Left — mobile logo + page title */}
      <div className="flex items-center gap-3">
        {/* Mobile-only brand */}
        <div className="md:hidden">
          <Link to="/workspace">
            <Logo size="sm" />
          </Link>
        </div>
        <span className="text-sm font-semibold text-gray-300 hidden md:block">{title}</span>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        {/* Notification placeholder */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Notifications"
          title="Notifications (coming soon)"
        >
          <HiBell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-purple" />
        </button>

        {/* Profile placeholder */}
        <button
          type="button"
          className="flex items-center gap-2 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Profile"
          title="Profile (coming soon)"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
            <HiUser size={14} className="text-white" />
          </div>
        </button>
      </div>
    </header>
  )
}
