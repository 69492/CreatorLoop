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
  youtube:   'text-red-400   bg-red-500/10   border-red-500/20',
  linkedin:  'text-blue-400  bg-blue-500/10  border-blue-500/20',
  instagram: 'text-pink-400  bg-pink-500/10  border-pink-500/20',
  twitter:   'text-sky-400   bg-sky-500/10   border-sky-500/20',
  blog:      'text-green-400 bg-green-500/10 border-green-500/20',
  podcast:   'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

/**
 * ProjectCard — dashboard card representing a saved project.
 *
 * Props:
 *   project       { id, title, platform, goal, length, word_count, created_at, updated_at }
 *   onDelete(id)
 *   onDuplicate(id)
 *   onRename(id, currentTitle)
 */
export default function ProjectCard({ project, onDelete, onDuplicate, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const platformStyle =
    PLATFORM_COLORS[project.platform?.toLowerCase()] ??
    'text-gray-400 bg-white/5 border-white/10'

  const handleMenuAction = (action) => {
    setMenuOpen(false)
    action()
  }

  return (
    <div className="glass-card p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 relative group">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug flex-1 truncate">
          {project.title}
        </h3>

        {/* Kebab menu */}
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Project options"
          >
            <HiDotsVertical size={16} />
          </button>

          {menuOpen && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 w-44 glass-card p-1.5 shadow-xl rounded-xl border border-white/15">
                <MenuItem
                  icon={<HiExternalLink size={14} />}
                  label="Open"
                  as={Link}
                  to={`/projects/${project.id}`}
                  onClick={() => setMenuOpen(false)}
                />
                <MenuItem
                  icon={<HiPencil size={14} />}
                  label="Rename"
                  onClick={() => handleMenuAction(() => onRename(project.id, project.title))}
                />
                <MenuItem
                  icon={<HiDuplicate size={14} />}
                  label="Duplicate"
                  onClick={() => handleMenuAction(() => onDuplicate(project.id))}
                />
                <div className="h-px bg-white/10 my-1" />
                <MenuItem
                  icon={<HiTrash size={14} />}
                  label="Delete"
                  danger
                  onClick={() => handleMenuAction(() => onDelete(project.id))}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Platform badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border capitalize ${platformStyle}`}>
          {project.platform}
        </span>
        <span className="text-xs text-gray-600 capitalize">{project.goal?.replace(/-/g, ' ')}</span>
      </div>

      {/* Word count */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <HiDocumentText size={13} />
        <span>{project.word_count?.toLocaleString() ?? 0} words</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-xs text-gray-600">Updated {fmtDate(project.updated_at)}</span>
        <Link
          to={`/projects/${project.id}`}
          className="text-xs text-brand-purple-light hover:text-white transition-colors font-medium"
        >
          Open →
        </Link>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, danger, onClick, as: As = 'button', ...rest }) {
  const cls = `
    flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-colors
    ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'}
  `
  if (As === Link) {
    return (
      <Link className={cls} onClick={onClick} {...rest}>
        {icon}
        {label}
      </Link>
    )
  }
  return (
    <button className={cls} onClick={onClick} {...rest}>
      {icon}
      {label}
    </button>
  )
}
