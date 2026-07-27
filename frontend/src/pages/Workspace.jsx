import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatsGrid from '@/components/projects/StatsGrid'
import { useProjects } from '@/hooks/useProjects'
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

const PIPELINE_OVERVIEW = [
  { icon: <HiLightBulb size={16} />, label: 'Idea', color: 'text-amber-400 bg-amber-500/10' },
  { icon: <HiSparkles size={16} />, label: 'Brainstorm', color: 'text-purple-400 bg-purple-500/10' },
  { icon: <HiMap size={16} />, label: 'Creative Direction', color: 'text-brand-purple-light bg-brand-purple/10' },
  { icon: <HiPencilAlt size={16} />, label: 'Content Development', color: 'text-brand-blue-light bg-brand-blue/10' },
  { icon: <HiSwitchHorizontal size={16} />, label: 'Platform Adaptation', color: 'text-cyan-400 bg-cyan-500/10' },
]

export default function Workspace() {
  const { stats, fetchProjects } = useProjects()
  useEffect(() => { fetchProjects({ perPage: 1 }) }, [fetchProjects])

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome hero card */}
      <Card className="relative overflow-hidden border-brand-purple/20 bg-gradient-to-br from-navy-800/90 via-navy-800/70 to-navy-900/90">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-12 -right-12 w-72 h-72 bg-brand-purple/20 rounded-full filter blur-[80px]" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-brand-blue/15 rounded-full filter blur-[80px]" />
        </div>

        <div className="relative z-10 p-2 sm:p-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/15 border border-brand-purple/30 text-xs font-semibold uppercase tracking-widest text-brand-purple-light mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-light animate-pulse" />
            Creator Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Welcome back.{' '}
            <span className="gradient-text">Build ideas into publish-ready content.</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Turn raw ideas into structured stories, long-form scripts, and tailored posts across all major creator platforms.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/create">
              <Button variant="primary" size="lg">
                <HiPencilAlt size={18} />
                Create New Content
                <HiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" size="lg">
                <HiFolder size={18} />
                View Saved Projects
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      {stats && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">Performance & Analytics</h2>
          <StatsGrid stats={stats} />
        </div>
      )}

      {/* Pipeline overview & Quick links */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                <HiSparkles className="text-brand-purple-light" />
                AI Creative Pipeline
              </h2>
              <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Active</span>
            </div>
            <div className="space-y-2.5">
              {PIPELINE_OVERVIEW.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-lg ${step.color}`}
                  >
                    {step.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-200">{step.label}</span>
                  {i < PIPELINE_OVERVIEW.length - 1 && (
                    <HiArrowRight size={12} className="ml-auto text-gray-600" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20">
                  <HiCheckCircle size={16} />
                </div>
                <span className="text-sm font-semibold">Publish-Ready Asset Package</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between gap-4">
          <div>
            <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <HiPencilAlt className="text-brand-blue-light" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/create"
                className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-purple/40 hover:bg-brand-purple/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-purple/20 text-brand-purple-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiPencilAlt size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">Start New Creation</span>
                    <span className="text-xs text-gray-400 block">Draft YouTube, LinkedIn, Blog & more</span>
                  </div>
                </div>
                <HiArrowRight size={16} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              
              <Link
                to="/projects"
                className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-blue/40 hover:bg-brand-blue/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue/20 text-brand-blue-light flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiFolder size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white block">Manage Projects</span>
                    <span className="text-xs text-gray-400 block">Edit, export, and organize saved content</span>
                  </div>
                </div>
                <HiArrowRight size={16} className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* CTA */}
      <Card className="text-center py-10 relative overflow-hidden border-white/10 bg-gradient-to-r from-navy-800/80 via-navy-700/60 to-navy-800/80">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center mx-auto mb-4 text-brand-purple-light shadow-lg shadow-brand-purple/20">
          <HiSparkles size={24} />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">
          Ready to Create Next Level Content?
        </h3>
        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          Define your core concept in seconds and let AI generate full drafts and cross-platform adaptations.
        </p>
        <Link to="/create">
          <Button variant="primary" size="lg">
            Start Creative Session
            <HiArrowRight size={16} />
          </Button>
        </Link>
      </Card>
    </div>
  )
}
