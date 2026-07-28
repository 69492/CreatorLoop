import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { HiArrowRight, HiSparkles } from 'react-icons/hi'

const PIPELINE_STEPS = [
  { label: 'Idea Analysis',       icon: '🔍', accent: 'border-amber-500/20 bg-amber-500/6' },
  { label: 'Concept Brainstorm',  icon: '💡', accent: 'border-violet-500/20 bg-violet-500/6' },
  { label: 'Creative Direction',  icon: '🎯', accent: 'border-brand-purple/25 bg-brand-purple/8' },
  { label: 'Content Generation',  icon: '✍️', accent: 'border-blue-500/20 bg-blue-500/6' },
  { label: 'Platform Package',    icon: '🚀', accent: 'border-emerald-500/20 bg-emerald-500/6' },
]

const STATS = [
  { stat: '5 AI stages',   label: 'end-to-end pipeline' },
  { stat: '6 platforms',   label: 'native adaptation' },
  { stat: 'Zero limits',   label: 'on creativity' },
]

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-[15%] w-[560px] h-[560px] bg-brand-purple/10 rounded-full filter blur-[160px]" />
        <div className="absolute bottom-1/3 right-[15%] w-[440px] h-[440px] bg-brand-blue/8 rounded-full filter blur-[140px]" />
        <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-violet-600/6 rounded-full filter blur-[100px]" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(167,139,250,0.8) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Top fade */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-navy-900 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 sm:py-36">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* ── Copy column ── */}
          <div className="animate-slide-up">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold tracking-widest text-brand-purple-light bg-brand-purple/10 border border-brand-purple/22">
              <span className="status-dot bg-emerald-400 animate-pulse-slow" />
              AI Creative Platform · Live
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-bold text-white leading-[1.1] tracking-tight mb-6 text-balance">
              Turn Any Idea Into{' '}
              <span className="gradient-text">Publish-Ready&nbsp;Content</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-lg text-pretty">
              CreatorLoop's AI pipeline takes your raw concept and delivers fully-developed scripts,
              stories, and platform-adapted posts — in a single seamless workflow.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/workspace">
                <Button variant="primary" size="lg" className="px-8">
                  Start Creating Free
                  <HiArrowRight size={17} />
                </Button>
              </Link>
              <a href="#pipeline">
                <Button variant="secondary" size="lg" className="px-8">
                  <HiSparkles size={16} />
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-5 flex-wrap">
              {STATS.map((item, i) => (
                <div key={item.stat} className="flex items-center gap-3">
                  <div>
                    <span className="text-sm font-bold text-white block leading-none">{item.stat}</span>
                    <span className="text-xs text-gray-600">{item.label}</span>
                  </div>
                  {i < STATS.length - 1 && (
                    <div className="w-px h-7 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Illustration column ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-[400px] animate-float">
              {/* Outer glow */}
              <div className="absolute -inset-10 rounded-3xl bg-gradient-to-br from-brand-purple/12 to-brand-blue/8 blur-3xl pointer-events-none" />

              {/* Card */}
              <div className="relative glass-card p-7 rounded-3xl" style={{ boxShadow: '0 0 60px rgba(124,58,237,0.15), var(--shadow-card)' }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
                      <HiSparkles size={15} className="text-brand-purple-light" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block leading-none">AI Pipeline</span>
                      <span className="text-[10px] text-gray-500">5-stage creative engine</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                    <span className="text-[11px] font-semibold text-emerald-400">Processing</span>
                  </div>
                </div>

                {/* Pipeline steps */}
                <div className="space-y-2">
                  {PIPELINE_STEPS.map((step, i) => (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 p-3 rounded-xl border ${step.accent} transition-all`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <span className="text-base w-6 text-center shrink-0">{step.icon}</span>
                      <span className="text-sm font-medium text-gray-200 flex-1 leading-none">
                        {step.label}
                      </span>
                      {i < PIPELINE_STEPS.length - 1 ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-5 pt-4 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Generating content…</span>
                  <div className="flex gap-1 items-end">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-brand-purple-light animate-pulse-slow"
                        style={{
                          height: `${10 + i * 4}px`,
                          animationDelay: `${i * 200}ms`,
                          opacity: 0.4 + i * 0.25,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-3 -right-4 glass-card px-3 py-2 flex items-center gap-2 animate-stagger-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">Ready to publish</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-25 hover:opacity-50 transition-opacity duration-300" aria-hidden="true">
        <div className="w-5 h-8 rounded-full border-2 border-brand-purple-light/50 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-brand-purple-light animate-bounce" />
        </div>
      </div>
    </section>
  )
}
