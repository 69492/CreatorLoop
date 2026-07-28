import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HiDotsVertical,
  HiTrash,
  HiDuplicate,
  HiPencil,
  HiExternalLink,
  HiDocumentText,
} from 'react-icons/hi'

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

const PLATFORM_COLORS = {
  youtube:   { text: 'text-red-400',     bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.18)' },
  linkedin:  { text: 'text-blue-400',    bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.18)' },
  instagram: { text: 'text-pink-400',    bg: 'rgba(236,72,153,0.08)',   border: 'rgba(236,72,153,0.18)' },
  twitter:   { text: 'text-sky-400',     bg: 'rgba(14,165,233,0.08)',   border: 'rgba(14,165,233,0.18)' },
  blog:      { text: 'text-emerald-400', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.18)' },
  podcast:   { text: 'text-orange-400',  bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.18)' },
}

const DEFAULT_PLATFORM = { text: 'text-gray-400', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }

export default function ProjectCard({ project, onDelete, onDuplicate, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const platformStyle = PLATFORM_COLORS[project.platform?.toLowerCase()] ?? DEFAULT_PLATFORM

  const handleMenuAction = (action) => {
    setMenuOpen(false)
    action()
  }

  return (
    <div
      className="group relative flex flex-col gap-3.5 p-5 rounded-2xl transition-all duration-200"
      style={{
        background: 'rgba(12,17,32,0.7)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.35)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug flex-1 min-w-0 pr-1 line-clamp-2">
          {project.title}
        </h3>

        {/* Kebab menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-700 transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-purple"
            onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(209,213,219,1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.background = '' }}
            aria-label="Project options"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <HiDotsVertical size={15} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden="true" />
              <div
                className="absolute right-0 top-8 z-20 w-44 rounded-xl p-1 animate-scale-in-spring"
                role="menu"
                style={{
                  background: 'rgba(6,11,22,0.97)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <MenuItem
                  icon={<HiExternalLink size={13} />}
                  label="Open"
                  as={Link}
                  to={`/projects/${project.id}`}
                  onClick={() => setMenuOpen(false)}
                />
                <MenuItem
                  icon={<HiPencil size={13} />}
                  label="Rename"
                  onClick={() => handleMenuAction(() => onRename(project.id, project.title))}
                />
                <MenuItem
                  icon={<HiDuplicate size={13} />}
                  label="Duplicate"
                  onClick={() => handleMenuAction(() => onDuplicate(project.id))}
                />
                <div className="h-px my-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <MenuItem
                  icon={<HiTrash size={13} />}
                  label="Delete"
                  danger
                  onClick={() => handleMenuAction(() => onDelete(project.id))}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Platform + goal */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize ${platformStyle.text}`}
          style={{ background: platformStyle.bg, border: `1px solid ${platformStyle.border}` }}
        >
          {project.platform}
        </span>
        <span className="text-xs text-gray-700 capitalize">{project.goal?.replace(/-/g, ' ')}</span>
      </div>

      {/* Word count */}
      <div className="flex items-center gap-1.5 text-xs text-gray-700">
        <HiDocumentText size={12} />
        <span>{project.word_count?.toLocaleString() ?? 0} words</span>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <span className="text-xs text-gray-700">{fmtDate(project.updated_at)}</span>
        <Link
          to={`/projects/${project.id}`}
          className="text-xs text-brand-purple-light hover:text-white transition-colors duration-150 font-semibold"
        >
          Open →
        </Link>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, danger, onClick, as: As = 'button', ...rest }) {
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '7px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background 150ms, color 150ms',
    color: danger ? 'rgb(248,113,113)' : 'rgb(156,163,175)',
  }

  const handleEnter = (e) => {
    e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)'
    e.currentTarget.style.color = danger ? 'rgb(252,165,165)' : '#fff'
  }
  const handleLeave = (e) => {
    e.currentTarget.style.background = ''
    e.currentTarget.style.color = danger ? 'rgb(248,113,113)' : 'rgb(156,163,175)'
  }

  if (As === Link) {
    return (
      <Link
        style={baseStyle}
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        role="menuitem"
        {...rest}
      >
        {icon}{label}
      </Link>
    )
  }
  return (
    <button
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      role="menuitem"
      type="button"
      {...rest}
    >
      {icon}{label}
    </button>
  )
}
