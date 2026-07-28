import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import Logo from '@/components/common/Logo'

const FOOTER_LINKS = {
  Product: [
    { label: 'Workspace',  to: '/workspace' },
    { label: 'Create',     to: '/create' },
    { label: 'Projects',   to: '/projects' },
    { label: 'About',      to: '/about' },
  ],
  Company: [
    { label: 'Home',       to: '/' },
    { label: 'About',      to: '/about' },
    { label: 'GitHub', href: 'https://github.com', external: true },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="border-t bg-navy-900"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Brand column */}
          <div>
            <Link to="/" aria-label="CreatorLoop home">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed max-w-xs">
              AI-powered creative platform for content creators and media teams.
              Turn ideas into publish-ready content.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 text-sm text-gray-600 hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <FaGithub size={16} />
              View on GitHub
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5 text-sm" role="list">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-200 transition-colors duration-150"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-gray-500 hover:text-gray-200 transition-colors duration-150"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs text-gray-700">
            © {year} CreatorLoop. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built with React, FastAPI &amp; Groq AI
          </p>
        </div>
      </div>
    </footer>
  )
}
