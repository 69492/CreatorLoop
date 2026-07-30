import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatsGrid from '@/components/projects/StatsGrid'
import ProjectCard from '@/components/projects/ProjectCard'
import { useProjects } from '@/hooks/useProjects'
import { useAuth } from '@/contexts/AuthContext'
import OnboardingModal, { useOnboarding } from '@/components/workspace/OnboardingModal'
import {
  HiPencilAlt,
  HiArrowRight,
  HiSparkles,
  HiFolder,
  HiCheckCircle,
  HiClock,
  HiExternalLink,
  HiDocumentText,
} from 'react-icons/hi'

const PIPELINE_STEPS = [
  { emoji: '🧠', label: 'Understand Idea',   accent: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' } },
  { emoji: '✨', label: 'Brainstorm',         accent: { color: '#FF9A4D', bg: 'rgba(255,122,26,0.08)', border: 'rgba(255,122,26,0.18)' } },
  { emoji: '📝', label: 'Write Content',      accent: { color: '#5EEAD4', bg: 'rgba(45,212,191,0.08)', border: 'rgba(45,212,191,0.18)' } },
  { emoji: '🎯', label: 'Platform Optimise', accent: { color: '#60a5fa', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)' } },
  { emoji: '🚀', label: 'Final Polish',       accent: { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.18)' } },
]

const RECENT_LIMIT = 3

export default function Workspace() {
  const { stats, projects, loading, fetchProjects, deleteProject, duplicateProject, renameProject } = useProjects()
  const { user } = useAuth()
  const { show: showOnboarding, dismiss: dismissOnboarding } = useOnboarding()

  useEffect(() => { fetchProjects({ perPage: RECENT_LIMIT, sortBy: 'updated_at' }) }, [fetchProjects])

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Creator'
  const recentProjects = projects.slice(0, RECENT_LIMIT)

  const fmtDate = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now - d) / 1000)
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <>
      {showOnboarding && <OnboardingModal onClose={dismissOnboarding} />}

      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* ── Welcome hero card ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(23,32,51,0.9) 60%, rgba(15,23,42,0.98) 100%)',
            border: '1px solid rgba(255,122,26,0.15)',
            boxShadow: '0 0 60px rgba(255,122,26,0.06)',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full filter blur-[80px]"
                 style={{ background: 'rgba(255,122,26,0.07)' }} />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full filter blur-[70px]"
                 style={{ background: 'rgba(45,212,191,0.05)' }} />
          </div>

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-semibold"
              style={{ background: 'rgba(255,122,26,0.1)', border: '1px solid rgba(255,122,26,0.2)', color: '#FF9A4D' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#FF7A1A' }} />
              Creator Workspace
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Welcome back,{' '}
              <span style={{ color: '#FF9A4D' }}>{firstName}</span>.{' '}
              <span className="gradient-text">Build ideas into content.</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
              Transform raw ideas into structured stories, scripts, and tailored posts — across all major platforms.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link to="/create">
                <Button variant="primary" size="lg">
                  <HiPencilAlt size={16} />
                  New Creation
                  <HiArrowRight size={14} />
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary" size="md">
                  <HiFolder size={16} />
                  My Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        {stats && (
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600 px-0.5">
              Activity Overview
            </p>
            <StatsGrid stats={stats} />
          </div>
        )}

        {/* ── Recent Projects + Pipeline ── */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Recent Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-600">Recent Projects</p>
              <Link to="/projects" className="text-xs font-medium transition-colors"
                    style={{ color: '#FF7A1A' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FF9A4D')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#FF7A1A')}>
                View all →
              </Link>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-4 h-16">
                    <div className="skeleton h-3.5 w-2/3 mb-2" />
                    <div className="skeleton h-2.5 w-1/3" />
                  </div>
                ))}
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="space-y-2">
                {recentProjects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="group flex items-center gap-3 p-4 rounded-xl transition-all duration-150"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'var(--color-elevated)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.background = 'var(--color-surface)' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs"
                      style={{ background: 'rgba(255,122,26,0.08)', border: '1px solid rgba(255,122,26,0.15)', color: '#FF9A4D' }}
                    >
                      <HiDocumentText size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{p.title}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <HiClock size={10} />
                        {fmtDate(p.updated_at)} · {p.platform}
                      </p>
                    </div>
                    <HiExternalLink size={13} className="text-slate-700 group-hover:text-slate-400 transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="card p-6 text-center"
                style={{ background: 'linear-gradient(160deg, rgba(15,23,42,0.8) 0%, rgba(8,13,26,0.9) 100%)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(255,122,26,0.08)', border: '1px solid rgba(255,122,26,0.15)', color: '#FF9A4D' }}
                >
                  <HiFolder size={16} />
                </div>
                <p className="text-sm font-semibold text-white mb-1">No projects yet</p>
                <p className="text-xs text-slate-500 mb-4">Start your first creation to see it here.</p>
                <Link to="/create">
                  <Button variant="primary" size="sm">
                    <HiPencilAlt size={13} />
                    Create Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Pipeline + Quick actions */}
          <div className="space-y-3">

            {/* Pipeline card */}
            <Card className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                  <span>✨</span>
                  AI Creative Pipeline
                </h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}
                >
                  Active
                </span>
              </div>
              <div className="space-y-1.5">
                {PIPELINE_STEPS.map((step, i) => (
                  <div
                    key={step.label}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                    style={{ background: step.accent.bg, borderColor: step.accent.border }}
                  >
                    <span className="text-sm leading-none">{step.emoji}</span>
                    <span className="text-sm text-slate-300">{step.label}</span>
                    {i < PIPELINE_STEPS.length - 1 && (
                      <HiArrowRight size={10} className="ml-auto text-slate-700" />
                    )}
                  </div>
                ))}
                <div
                  className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                  style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.2)' }}
                >
                  <HiCheckCircle size={14} className="text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Publish-Ready Package</span>
                </div>
              </div>
            </Card>

            {/* Quick actions */}
            <Card className="flex flex-col gap-3">
              <h2 className="text-white font-semibold text-sm flex items-center gap-2">
                <HiSparkles size={14} style={{ color: '#FF9A4D' }} />
                Quick Actions
              </h2>
              <div className="space-y-2">
                <Link
                  to="/create"
                  className="group flex items-center justify-between p-3.5 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,122,26,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,122,26,0.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                      style={{ background: 'rgba(255,122,26,0.12)', color: '#FF9A4D' }}
                    >
                      <HiPencilAlt size={15} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Start New Creation</span>
                      <span className="text-xs text-slate-500">YouTube, LinkedIn, Blog &amp; more</span>
                    </div>
                  </div>
                  <HiArrowRight size={13} className="text-slate-700 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>

                <Link
                  to="/projects"
                  className="group flex items-center justify-between p-3.5 rounded-xl transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(45,212,191,0.06)'; e.currentTarget.style.borderColor = 'rgba(45,212,191,0.2)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                      style={{ background: 'rgba(45,212,191,0.1)', color: '#5EEAD4' }}
                    >
                      <HiFolder size={15} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block">Manage Projects</span>
                      <span className="text-xs text-slate-500">Edit, export, and organize</span>
                    </div>
                  </div>
                  <HiArrowRight size={13} className="text-slate-700 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
