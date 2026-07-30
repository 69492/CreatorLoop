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
  youtube:   { text: '#F87171', bg: 'rgba(239,68,68,0.08)',    border: 'rgba(239,68,68,0.18)' },
  linkedin:  { text: '#60A5FA', bg: 'rgba(59,130,246,0.08)',   border: 'rgba(59,130,246,0.18)' },
  instagram: { text: '#F472B6', bg: 'rgba(236,72,153,0.08)',   border: 'rgba(236,72,153,0.18)' },
  twitter:   { text: '#38BDF8', bg: 'rgba(14,165,233,0.08)',   border: 'rgba(14,165,233,0.18)' },
  blog:      { text: '#4ADE80', bg: 'rgba(34,197,94,0.08)',    border: 'rgba(34,197,94,0.18)' },
  podcast:   { text: '#FB923C', bg: 'rgba(249,115,22,0.08)',   border: 'rgba(249,115,22,0.18)' },
}

const DEFAULT_PLATFORM = { text: '#94A3B8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' }

export default function ProjectCard({ project, onDelete, onDuplicate, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const pc = PLATFORM_COLORS[project.platform?.toLowerCase()] ?? DEFAULT_PLATFORM

  const handleMenuAction = (action) => {
    setMenuOpen(false)
    action()
  }

  return (
    <div
      className="group relative flex flex-col gap-3 p-5 rounded-xl transition-all duration-200 cursor-default"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border)'
        e.currentTarget.style.transform = ''
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-snug flex-1 min-w-0 pr-1 line-clamp-2"
            style={{ fontFamily: "'Sora', sans-serif" }}>
          {project.title}
        </h3>

        {/* Kebab menu */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-md text-slate-700 transition-all duration-150 focus-visible:outline-none opacity-0 group-hover:opacity-100"
            onMouseEnter={(e) => { e.currentTarget.style.color = '#CBD5E1'; e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
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
                  background: 'var(--color-elevated)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
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
                <div className="h-px my-1" style={{ background: 'var(--color-border)' }} />
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
          className="text-xs font-medium px-2 py-0.5 rounded capitalize"
          style={{ color: pc.text, background: pc.bg, border: `1px solid ${pc.border}` }}
        >
          {project.platform}
        </span>
        <span className="text-xs text-slate-600 capitalize">{project.goal?.replace(/-/g, ' ')}</span>
      </div>

      {/* Word count */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600">
        <HiDocumentText size={12} />
        <span>{project.word_count?.toLocaleString() ?? 0} words</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <span className="text-xs text-slate-600">{fmtDate(project.updated_at)}</span>
        <Link
          to={`/projects/${project.id}`}
          className="text-xs font-semibold transition-colors duration-150"
          style={{ color: '#FF7A1A' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FF9A4D'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#FF7A1A'}
        >
          Open →
        </Link>
      </div>
    </div>
  )
}

function MenuItem({ icon, label, danger, onClick, as: As = 'button', ...rest }) {
  const style = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '7px 10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'background 140ms, color 140ms',
    color: danger ? '#F87171' : '#94A3B8',
  }

  const enter = (e) => {
    e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.07)' : 'var(--color-hover)'
    e.currentTarget.style.color = danger ? '#FCA5A5' : '#fff'
  }
  const leave = (e) => {
    e.currentTarget.style.background = ''
    e.currentTarget.style.color = danger ? '#F87171' : '#94A3B8'
  }

  if (As === Link) {
    return <Link style={style} onClick={onClick} onMouseEnter={enter} onMouseLeave={leave} role="menuitem" {...rest}>{icon}{label}</Link>
  }
  return (
    <button style={style} onClick={onClick} onMouseEnter={enter} onMouseLeave={leave} role="menuitem" type="button" {...rest}>
      {icon}{label}
    </button>
  )
}
