import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { HiArrowRight, HiSparkles, HiPlay } from 'react-icons/hi'

const PIPELINE_STAGES = [
  { label: 'Understanding Idea',     icon: '🧠', color: '#F59E0B' },
  { label: 'Brainstorming',          icon: '✨', color: '#FF7A1A' },
  { label: 'Writing Content',        icon: '📝', color: '#2DD4BF' },
  { label: 'Platform Optimization',  icon: '🎯', color: '#22C55E' },
  { label: 'Final Polish',           icon: '🚀', color: '#818CF8' },
]

const PLATFORMS = ['YouTube', 'LinkedIn', 'Instagram', 'Blog', 'X / Twitter', 'Podcast']

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      {/* Subtle background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.35]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Radial fades */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-studio-bg to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-studio-bg to-transparent" />
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[160px] opacity-25" style={{ background: '#FF7A1A' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[140px] opacity-15" style={{ background: '#2DD4BF' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="animate-fade-in-up">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
                 style={{ background: 'rgba(255,122,26,0.08)', border: '1px solid rgba(255,122,26,0.2)', color: '#FF9A4D' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse-slow" />
              AI Content Studio · Available Now
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-tight"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em' }}>
              Create Once.{' '}
              <span style={{ color: '#FF7A1A' }}>Publish</span>{' '}
              <span style={{ color: '#2DD4BF' }}>Everywhere.</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl">
              Transform one idea into platform-ready content using AI-powered creative workflows.
              From raw concept to published content — in minutes.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Creating
                  <HiArrowRight size={16} />
                </Button>
              </Link>
            </div>

            {/* Platform strip */}
            <div>
              <p className="text-xs text-slate-600 mb-2.5 font-medium uppercase tracking-widest">Works with</p>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <span key={p} className="text-xs text-slate-500 px-2.5 py-1 rounded-md"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: AI Pipeline card ── */}
          <div className="hidden lg:flex items-center justify-center animate-float">
            <div className="relative w-full max-w-[380px]">
              {/* Glow */}
              <div className="absolute -inset-8 rounded-3xl blur-3xl opacity-20 pointer-events-none"
                   style={{ background: 'radial-gradient(circle, #FF7A1A 0%, transparent 70%)' }} />

              {/* Card */}
              <div className="relative rounded-2xl p-7"
                   style={{
                     background: 'var(--color-surface)',
                     border: '1px solid var(--color-border)',
                     boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                   }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                         style={{ background: 'rgba(255,122,26,0.1)', border: '1px solid rgba(255,122,26,0.2)' }}>
                      <HiSparkles size={15} style={{ color: '#FF7A1A' }} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white block leading-none" style={{ fontFamily: "'Sora', sans-serif" }}>
                        AI Pipeline
                      </span>
                      <span className="text-[10px] text-slate-500">5-stage creative engine</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold text-green-400"
                       style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
                    Running
                  </div>
                </div>

                {/* Stages */}
                <div className="space-y-2 mb-5">
                  {PIPELINE_STAGES.map((stage, i) => (
                    <div key={stage.label} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                         style={{
                           background: i === 2 ? `${stage.color}10` : 'rgba(255,255,255,0.03)',
                           border: `1px solid ${i === 2 ? `${stage.color}25` : 'rgba(255,255,255,0.06)'}`,
                         }}>
                      <span className="text-base w-5 text-center shrink-0">{stage.icon}</span>
                      <span className="text-xs font-medium text-slate-300 flex-1">{stage.label}</span>
                      {i < 2 && (
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                             style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                          <svg viewBox="0 0 8 8" width="7" height="7" fill="none">
                            <path d="M1.5 4l2 2 3-3" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                      {i === 2 && (
                        <div className="flex gap-0.5 items-end">
                          {[8, 12, 10].map((h, j) => (
                            <div key={j} className="w-1 rounded-full animate-pulse-slow"
                                 style={{ height: `${h}px`, background: stage.color, animationDelay: `${j*150}ms`, opacity: 0.7 }} />
                          ))}
                        </div>
                      )}
                      {i > 2 && <span className="text-slate-700 text-xs">—</span>}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-full rounded-full" style={{ width: '50%', background: 'linear-gradient(to right, #FF7A1A, #2DD4BF)' }} />
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">50% complete</span>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 -right-5 px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold text-slate-300 animate-stagger-2"
                   style={{
                     background: 'var(--color-elevated)',
                     border: '1px solid var(--color-border)',
                     boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                   }}>
                <span className="w-2 h-2 rounded-full bg-green-400" />
                Ready to publish
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 hover:opacity-60 transition-opacity" aria-hidden="true">
        <div className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5">
          <div className="w-0.5 h-2 rounded-full bg-slate-400 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
