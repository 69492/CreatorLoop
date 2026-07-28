import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatsGrid from '@/components/projects/StatsGrid'
import { useProjects } from '@/hooks/useProjects'
import { useAuth } from '@/contexts/AuthContext'
import {
  HiPencilAlt,
  HiArrowRight,
  HiLightBulb,
  HiSparkles,
  HiMap,
  HiSwitchHorizontal,
  HiFolder,
  HiCheckCircle,
} from 'react-icons/hi'

const PIPELINE_STEPS = [
  { icon: <HiLightBulb size={14} />,       label: 'Idea',       color: 'text-amber-400 bg-amber-500/10 border-amber-500/18' },
  { icon: <HiSparkles size={14} />,        label: 'Brainstorm', color: 'text-violet-400 bg-violet-500/10 border-violet-500/18' },
  { icon: <HiMap size={14} />,             label: 'Direction',  color: 'text-brand-purple-light bg-brand-purple/10 border-brand-purple/18' },
  { icon: <HiPencilAlt size={14} />,       label: 'Draft',      color: 'text-brand-blue-light bg-brand-blue/10 border-brand-blue/18' },
  { icon: <HiSwitchHorizontal size={14} />, label: 'Adapt',     color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/18' },
]

export default function Workspace() {
  const { stats, fetchProjects } = useProjects()
  const { user } = useAuth()
  useEffect(() => { fetchProjects({ perPage: 1 }) }, [fetchProjects])

  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Creator'

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6 animate-fade-in">

      {/* ── Welcome hero card ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(12,17,32,0.9) 0%, rgba(15,11,31,0.95) 60%, rgba(8,13,26,0.98) 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 0 60px rgba(124,58,237,0.08)',
        }}
      >
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-purple/12 rounded-full filter blur-[80px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-blue/8 rounded-full filter blur-[70px]" />
        </div>

        <div className="relative z-10">
          {/* Status pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-semibold text-brand-purple-light"
               style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-light animate-pulse-slow" />
            Creator Workspace
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Welcome back,{' '}
            <span className="text-brand-purple-light">{firstName}</span>.{' '}
            <span className="gradient-text">Build ideas into content.</span>
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Turn raw ideas into structured stories, scripts, and tailored posts — across all major platforms.
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
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-700 px-0.5">
            Activity Overview
          </p>
          <StatsGrid stats={stats} />
        </div>
      )}

      {/* ── Pipeline overview + Quick actions ── */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Pipeline card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold text-sm flex items-center gap-2">
              <HiSparkles size={14} className="text-brand-purple-light" />
              AI Creative Pipeline
            </h2>
            <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              Active
            </span>
          </div>
          <div className="space-y-1.5">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label}
                   className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${step.color}`}>
                <div className="flex items-center justify-center w-5 h-5 rounded-lg">
                  {step.icon}
                </div>
                <span className="text-sm text-gray-300">{step.label}</span>
                {i < PIPELINE_STEPS.length - 1 && (
                  <HiArrowRight size={10} className="ml-auto text-gray-700" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl"
                 style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <HiCheckCircle size={14} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Publish-Ready Package</span>
            </div>
          </div>
        </Card>

        {/* Quick actions */}
        <Card className="flex flex-col gap-4">
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <HiPencilAlt size={14} className="text-brand-blue-light" />
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              to="/create"
              className="group flex items-center justify-between p-4 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl text-brand-purple-light flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                     style={{ background: 'rgba(124,58,237,0.12)' }}>
                  <HiPencilAlt size={17} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Start New Creation</span>
                  <span className="text-xs text-gray-600">YouTube, LinkedIn, Blog &amp; more</span>
                </div>
              </div>
              <HiArrowRight size={14} className="text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>

            <Link
              to="/projects"
              className="group flex items-center justify-between p-4 rounded-xl transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.08)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl text-brand-blue-light flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                     style={{ background: 'rgba(59,130,246,0.12)' }}>
                  <HiFolder size={17} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white block">Manage Projects</span>
                  <span className="text-xs text-gray-600">Edit, export, and organize</span>
                </div>
              </div>
              <HiArrowRight size={14} className="text-gray-700 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
            </Link>
          </div>
        </Card>
      </div>

      {/* ── Bottom CTA ── */}
      <div
        className="text-center py-10 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-purple-light"
             style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <HiSparkles size={18} />
        </div>
        <h3 className="text-white font-semibold text-base mb-2">
          Ready to create your next piece?
        </h3>
        <p className="text-gray-600 text-sm max-w-sm mx-auto mb-5 leading-relaxed">
          Define your concept in seconds and let AI generate full drafts with cross-platform adaptations.
        </p>
        <Link to="/create">
          <Button variant="primary" size="md">
            Start Creative Session
            <HiArrowRight size={14} />
          </Button>
        </Link>
      </div>
    </div>
  )
}
