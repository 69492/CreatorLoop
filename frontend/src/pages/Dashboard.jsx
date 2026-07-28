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
} from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProjectCard from '@/components/projects/ProjectCard'
import StatsGrid from '@/components/projects/StatsGrid'
import SearchBar from '@/components/projects/SearchBar'
import FilterPanel from '@/components/projects/FilterPanel'
import { useProjects } from '@/hooks/useProjects'

const PIPELINE_LABELS = [
  { label: 'Idea',       color: 'bg-amber-400' },
  { label: 'Brainstorm', color: 'bg-violet-400' },
  { label: 'Direction',  color: 'bg-brand-purple-light' },
  { label: 'Draft',      color: 'bg-brand-blue-light' },
  { label: 'Adapt',      color: 'bg-cyan-400' },
  { label: 'Publish',    color: 'bg-emerald-400' },
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-7 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {firstName}'s Projects
          </h1>
          <p className="text-sm text-gray-600 mt-0.5">
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
      {stats && <StatsGrid stats={stats} />}

      {/* ── Zero state (no projects, no filters) ── */}
      {!projects.length && !loading && !hasFilters && (
        <div
          className="glass-card py-16 text-center"
          style={{ background: 'linear-gradient(160deg, rgba(12,17,32,0.8) 0%, rgba(8,13,26,0.9) 100%)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-brand-purple-light"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}
          >
            <HiFolderOpen size={24} />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">No projects yet</h3>
          <p className="text-gray-600 text-sm mb-8 max-w-xs mx-auto leading-relaxed">
            Start a creation session to generate and save your first AI-crafted content.
          </p>

          {/* Pipeline flow */}
          <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
            {PIPELINE_LABELS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-xs text-gray-600 font-medium">{s.label}</span>
                </div>
                {i < PIPELINE_LABELS.length - 1 && (
                  <HiArrowRight size={9} className="text-gray-800" />
                )}
              </div>
            ))}
          </div>

          <Link to="/create">
            <Button variant="primary" size="lg">
              <HiPencilAlt size={16} />
              Start Your First Creation
            </Button>
          </Link>
        </div>
      )}

      {/* ── Search + Filters ── */}
      {(projects.length > 0 || hasFilters) && (
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
            <div key={i} className="glass-card p-5 h-44">
              <div className="space-y-3 mb-6">
                <div className="skeleton h-4 w-4/5" />
                <div className="skeleton h-3 w-2/5" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-3 w-3/5" />
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
        <div className="glass-card text-center py-14">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 text-gray-500"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <HiSearch size={17} />
          </div>
          <p className="text-gray-300 font-medium text-sm mb-1">No results found</p>
          <p className="text-gray-700 text-xs mb-5">
            Try adjusting your search terms or clearing filters.
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
          >
            ← Previous
          </Button>
          <span className="text-xs text-gray-600 px-2 font-medium tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
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
              background: 'rgba(8,13,26,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
            }}
          >
            <h3 id="rename-modal-title" className="text-white font-semibold text-base mb-1">
              Rename Project
            </h3>
            <p className="text-xs text-gray-600 mb-5">Enter a new title for this project.</p>
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
