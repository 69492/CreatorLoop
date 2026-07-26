import { Link } from 'react-router-dom'
import { FaGithub } from 'react-icons/fa'
import Logo from '@/components/common/Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2" aria-label="CreatorLoop home">
            <Logo size="sm" />
          </Link>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                  aria-label="GitHub repository"
                >
                  <FaGithub size={15} />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-gray-500">
          © {year} CreatorLoop. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
