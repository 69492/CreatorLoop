import { Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
  HiPencilAlt,
  HiArrowRight,
  HiLightBulb,
  HiSparkles,
  HiMap,
  HiSwitchHorizontal,
} from 'react-icons/hi'

const PIPELINE_OVERVIEW = [
  { icon: <HiLightBulb size={16} />, label: 'Idea', color: 'text-yellow-400' },
  { icon: <HiSparkles size={16} />, label: 'Brainstorm', color: 'text-purple-400' },
  { icon: <HiMap size={16} />, label: 'Creative Direction', color: 'text-brand-purple-light' },
  { icon: <HiPencilAlt size={16} />, label: 'Content Development', color: 'text-brand-blue-light' },
  { icon: <HiSwitchHorizontal size={16} />, label: 'Platform Adaptation', color: 'text-cyan-400' },
]

export default function Workspace() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-5xl mx-auto">
      {/* Welcome hero card */}
      <Card className="relative overflow-hidden mb-8">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-purple/15 rounded-full filter blur-[60px]" />
        </div>

        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-purple-light mb-2">
            AI Creative Partner
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Welcome back.{' '}
            <span className="gradient-text">What would you like to create today?</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mb-6">
            Start a new creative session, pick a goal, choose your platform, and let AI
            collaborate with you throughout the entire process.
          </p>

          <Link to="/create">
            <Button variant="primary">
              <HiPencilAlt size={16} />
              Start Creating
              <HiArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </Card>

      {/* Pipeline overview */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <Card className="flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Creative Pipeline</h2>
          <div className="space-y-2">
            {PIPELINE_OVERVIEW.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 ${step.color}`}
                >
                  {step.icon}
                </div>
                <span className="text-sm text-gray-300">{step.label}</span>
                {i < PIPELINE_OVERVIEW.length - 1 && (
                  <HiArrowRight size={12} className="ml-auto text-gray-700" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-green-500/10 text-green-400">
                <span className="text-xs font-bold">✓</span>
              </div>
              <span className="text-sm text-gray-300">Final Creative Package</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Quick Stats</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Projects Created', value: '—', sub: 'No projects yet' },
              { label: 'Platforms', value: '6', sub: 'Supported' },
              { label: 'AI Status', value: 'Phase 3', sub: 'Coming soon' },
              { label: 'Pipeline Steps', value: '6', sub: 'End-to-end' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/5 rounded-xl p-3 border border-white/10"
              >
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                <div className="text-xs text-gray-600">{stat.sub}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* CTA */}
      <Card className="text-center py-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center mx-auto mb-4">
          <HiSparkles size={22} className="text-brand-purple-light" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">
          Ready to Collaborate with AI?
        </h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-5">
          Start a new creative session. Define your idea, goal, and platform to begin.
        </p>
        <Link to="/create">
          <Button variant="primary">
            New Creation
            <HiArrowRight size={16} />
          </Button>
        </Link>
      </Card>
    </div>
  )
}
