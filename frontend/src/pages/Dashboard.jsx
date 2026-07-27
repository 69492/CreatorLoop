import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { HiPencilAlt, HiArrowRight, HiPlus, HiFolderOpen } from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ProjectCard from '@/components/projects/ProjectCard'
import StatsGrid from '@/components/projects/StatsGrid'
import SearchBar from '@/components/projects/SearchBar'
import FilterPanel from '@/components/projects/FilterPanel'
import { useProjects } from '@/hooks/useProjects'

const PIPELINE_OVERVIEW = [
  { label: 'Idea', color: 'bg-amber-400' },
  { label: 'Brainstorm', color: 'bg-purple-400' },
  { label: 'Direction', color: 'bg-brand-purple-light' },
  { label: 'Content', color: 'bg-brand-blue-light' },
  { label: 'Adapt', color: 'bg-cyan-400' },
  { label: 'Export', color: 'bg-emerald-400' },
]

export default function Dashboard() {
  const { projects, total, stats, loading, fetchProjects, deleteProject, duplicateProject, renameProject } =
    useProjects()

  const [search, setSearch]     = useState('')
  const [platform, setPlatform] = useState('')
  const [sortBy, setSortBy]     = useState('updated_at')
  const [page, setPage]         = useState(1)
  const [renameState, setRenameState] = useState(null) // { id, value }

  const PER_PAGE = 12
  const totalPages = Math.ceil(total / PER_PAGE)

  const load = useCallback(() => {
    fetchProjects({ search, platform, sortBy, page, perPage: PER_PAGE })
  }, [search, platform, sortBy, page, fetchProjects])

  useEffect(() => {
    load()
  }, [load])

  const handleRenameStart = (id, currentTitle) => {
    setRenameState({ id, value: currentTitle })
  }

  const handleRenameCommit = async () => {
    if (!renameState || !renameState.value.trim()) return
    await renameProject(renameState.id, renameState.value.trim())
    setRenameState(null)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Projects</h1>
          <p className="text-sm text-gray-400 mt-1">Manage, edit, and export your creative project library.</p>
        </div>
        <Link to="/create">
          <Button variant="primary" size="md">
            <HiPlus size={18} />
            New Creation
          </Button>
        </Link>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div>
        <StatsGrid stats={stats} />
      </div>

      {/* ── Pipeline mini-map for brand new state ───────────────────────── */}
      {!projects.length && !loading && !search && !platform && (
        <Card className="py-12 text-center border-brand-purple/20 bg-gradient-to-b from-navy-800/80 to-navy-900/90">
          <div className="w-14 h-14 rounded-2xl bg-brand-purple/15 border border-brand-purple/30 flex items-center justify-center mx-auto mb-4 text-brand-purple-light">
            <HiFolderOpen size={28} />
          </div>
          
          <h3 className="text-white font-bold text-xl mb-2">No projects created yet</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Start a new creative session to generate structured drafts and platform adaptations.
          </p>

          <div className="flex items-center justify-center gap-1.5 mb-6 max-w-md mx-auto flex-wrap">
            {PIPELINE_OVERVIEW.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full text-white/90 ${s.color} bg-opacity-20 border border-white/10`}>
                  {s.label}
                </span>
                {i < PIPELINE_OVERVIEW.length - 1 && (
                  <HiArrowRight size={10} className="text-gray-600" />
                )}
              </div>
            ))}
          </div>

          <Link to="/create">
            <Button variant="primary" size="lg">
              <HiPencilAlt size={18} />
              Start Your First Creation
            </Button>
          </Link>
        </Card>
      )}

      {/* ── Search + Filters ─────────────────────────────────────────────── */}
      {(projects.length > 0 || search || platform) && (
        <div className="flex flex-col gap-3">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <FilterPanel
            platform={platform}
            onPlatform={(v) => { setPlatform(v); setPage(1) }}
            sortBy={sortBy}
            onSortBy={(v) => { setSortBy(v); setPage(1) }}
          />
        </div>
      )}

      {/* ── Projects grid ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-48 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-3 w-2/3" />
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

      {/* ── Empty search state ───────────────────────────────────────────── */}
      {!loading && projects.length === 0 && (search || platform) && (
        <Card className="text-center py-12">
          <p className="text-gray-300 font-medium text-base mb-1">No matching projects found</p>
          <p className="text-gray-500 text-xs mb-4">Try refining your search terms or clearing platform filters.</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => { setSearch(''); setPlatform(''); setPage(1) }}
          >
            Clear Filters
          </Button>
        </Card>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Previous
          </Button>
          <span className="text-xs font-semibold text-gray-400 px-2">
            Page {page} of {totalPages}
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

      {/* ── Rename modal ─────────────────────────────────────────────────── */}
      {renameState && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rename-modal-title"
        >
          <div className="glass-card p-6 w-full max-w-md rounded-2xl shadow-2xl border-white/15 bg-navy-800">
            <h3 id="rename-modal-title" className="text-white font-bold text-lg mb-1">Rename Project</h3>
            <p className="text-xs text-gray-400 mb-4">Update the title of your saved project.</p>
            <input
              autoFocus
              type="text"
              value={renameState.value}
              onChange={(e) => setRenameState((s) => ({ ...s, value: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameCommit()
                if (e.key === 'Escape') setRenameState(null)
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/15 text-sm text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple mb-5"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setRenameState(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRenameCommit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
