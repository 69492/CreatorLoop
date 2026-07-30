import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  HiPencilAlt,
  HiArrowRight,
  HiPlus,
  HiFolderOpen,
  HiFilter,
  HiSearch,
  HiX,
  HiSparkles,
} from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProjectCard from '@/components/projects/ProjectCard'
import StatsGrid from '@/components/projects/StatsGrid'
import SearchBar from '@/components/projects/SearchBar'
import FilterPanel from '@/components/projects/FilterPanel'
import { useProjects } from '@/hooks/useProjects'

const PIPELINE_LABELS = [
  { label: 'Understand',  emoji: '🧠', color: 'rgba(245,158,11,0.7)' },
  { label: 'Brainstorm',  emoji: '✨', color: 'rgba(255,122,26,0.7)' },
  { label: 'Write',       emoji: '📝', color: 'rgba(45,212,191,0.7)' },
  { label: 'Optimise',    emoji: '🎯', color: 'rgba(96,165,250,0.7)' },
  { label: 'Polish',      emoji: '🚀', color: 'rgba(34,197,94,0.7)'  },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Creator'
  const { projects, total, stats, loading, fetchProjects, deleteProject, duplicateProject, renameProject } =
    useProjects()

  const [search, setSearch]     = useState('')
  const [platform, setPlatform] = useState('')
  const [sortBy, setSortBy]     = useState('updated_at')
  const [page, setPage]         = useState(1)
  const [renameState, setRenameState] = useState(null)

  const PER_PAGE = 12
  const totalPages = Math.ceil(total / PER_PAGE)

  const load = useCallback(() => {
    fetchProjects({ search, platform, sortBy, page, perPage: PER_PAGE })
  }, [search, platform, sortBy, page, fetchProjects])

  useEffect(() => { load() }, [load])

  const handleRenameStart  = (id, title) => setRenameState({ id, value: title })
  const handleRenameCommit = async () => {
    if (!renameState?.value.trim()) return
    await renameProject(renameState.id, renameState.value.trim())
    setRenameState(null)
  }

  const hasFilters = !!(search || platform)
  const hasProjects = projects.length > 0 || hasFilters || loading

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            {firstName}'s Projects
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">
            Manage, edit, and export your creative library.
          </p>
        </div>
        <Link to="/create">
          <Button variant="primary" size="md">
            <HiPlus size={16} />
            New Creation
          </Button>
        </Link>
      </div>

      {/* ── Stats ── */}
      {stats && (
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-0.5">
            Activity Overview
          </p>
          <StatsGrid stats={stats} />
        </div>
      )}

      {/* ── Zero state (no projects, no filters) ── */}
      {!hasProjects && !loading && (
        <div
          className="rounded-2xl py-16 px-8 text-center"
          style={{
            background: 'linear-gradient(160deg, rgba(15,23,42,0.9) 0%, rgba(8,13,26,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              background: 'rgba(255,122,26,0.08)',
              border: '1px solid rgba(255,122,26,0.15)',
              color: '#FF9A4D',
            }}
          >
            <HiFolderOpen size={26} />
          </div>

          <h3 className="text-white font-bold text-xl mb-3 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
            Your creative library is empty
          </h3>
          <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Start a creation session and your first AI-crafted project will appear here. Each project is saved automatically.
          </p>

          {/* Pipeline flow */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {PIPELINE_LABELS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-xs">{s.emoji}</span>
                  <span style={{ color: s.color }}>{s.label}</span>
                </div>
                {i < PIPELINE_LABELS.length - 1 && (
                  <HiArrowRight size={9} className="text-slate-700 shrink-0" />
                )}
              </div>
            ))}
          </div>

          <Link to="/create">
            <Button variant="primary" size="lg">
              <HiSparkles size={16} />
              Start Your First Creation
            </Button>
          </Link>
        </div>
      )}

      {/* ── Search + Filters ── */}
      {hasProjects && (
        <div className="space-y-2.5">
          <SearchBar
            value={search}
            onChange={(v) => { setSearch(v); setPage(1) }}
          />
          <FilterPanel
            platform={platform}
            onPlatform={(v) => { setPlatform(v); setPage(1) }}
            sortBy={sortBy}
            onSortBy={(v) => { setSortBy(v); setPage(1) }}
          />
        </div>
      )}

      {/* ── Project grid / skeleton ── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 h-44">
              <div className="space-y-3 mb-6">
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-3 w-2/5" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-3 w-3/5" />
              </div>
              <div className="mt-auto pt-3">
                <div className="skeleton h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={deleteProject}
              onDuplicate={duplicateProject}
              onRename={handleRenameStart}
            />
          ))}
        </div>
      )}

      {/* ── Empty search state ── */}
      {!loading && projects.length === 0 && hasFilters && (
        <div className="card text-center py-16">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748B' }}
          >
            <HiSearch size={18} />
          </div>
          <p className="text-slate-300 font-semibold text-base mb-1.5">No results found</p>
          <p className="text-slate-600 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
            Try adjusting your search terms or clearing your active filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setSearch(''); setPlatform(''); setPage(1) }}
          >
            <HiX size={13} />
            Clear Filters
          </Button>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Previous page"
          >
            ← Previous
          </Button>
          <span className="text-xs text-slate-500 px-2 font-medium tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Next page"
          >
            Next →
          </Button>
        </div>
      )}

      {/* ── Rename modal ── */}
      {renameState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-modal-title"
        >
          <div
            className="w-full max-w-md animate-scale-in-spring rounded-2xl p-6"
            style={{
              background: 'rgba(15,23,42,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            }}
          >
            <h3 id="rename-modal-title" className="text-white font-semibold text-base mb-1">
              Rename Project
            </h3>
            <p className="text-xs text-slate-500 mb-5">Enter a new title for this project.</p>
            <input
              autoFocus
              type="text"
              value={renameState.value}
              onChange={(e) => setRenameState((s) => ({ ...s, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameCommit()
                if (e.key === 'Escape') setRenameState(null)
              }}
              className="input-base mb-5"
              placeholder="Project title"
              aria-label="New project title"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setRenameState(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleRenameCommit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
