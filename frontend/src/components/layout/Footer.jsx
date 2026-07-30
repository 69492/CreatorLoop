import { Link } from 'react-router-dom'
import Logo from '@/components/common/Logo'

const FOOTER_LINKS = {
  Product: [
    { label: 'Workspace',  to: '/workspace' },
    { label: 'Create',     to: '/create' },
    { label: 'Projects',   to: '/projects' },
  ],
  Company: [
    { label: 'Home',       to: '/' },
    { label: 'About',      to: '/about' },
    { label: 'Help',       to: '/help' },
  ],
  Account: [
    { label: 'Sign Up',    to: '/auth/signup' },
    { label: 'Sign In',    to: '/auth/signin' },
    { label: 'Settings',   to: '/settings' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" aria-label="CreatorLoop home">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed max-w-xs">
              AI-powered creative platform for content creators and media teams.
              Transform ideas into platform-ready content — instantly.
            </p>
            <div className="flex items-center gap-1.5 mt-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-xs text-slate-600 font-medium">All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5 text-sm" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-slate-500 hover:text-slate-200 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-xs text-slate-700">
            © {year} CreatorLoop. All rights reserved.
          </p>
          <p className="text-xs text-slate-700">
            Powered by React, FastAPI &amp; Groq AI
          </p>
        </div>
      </div>
    </footer>
  )
}
