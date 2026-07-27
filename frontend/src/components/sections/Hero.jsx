import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { HiArrowRight, HiPlay } from 'react-icons/hi'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full filter blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-brand-blue/15 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div className="animate-slide-up">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-purple-light bg-brand-purple/15 border border-brand-purple/30 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-brand-purple-light animate-pulse-slow" />
              AI-Powered Creative Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
              Your AI Creative Partner for{' '}
              <span className="gradient-text">Content Production</span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              CreatorLoop helps creators brainstorm concepts, develop structured narratives, write ready-to-publish scripts, and adapt content for every platform seamlessly.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/workspace">
                <Button variant="primary" size="lg" className="px-8 py-4 shadow-xl">
                  Get Started Free
                  <HiArrowRight size={18} />
                </Button>
              </Link>
              <a href="#pipeline">
                <Button variant="secondary" size="lg" className="px-8 py-4">
                  <HiPlay size={16} />
                  Explore Pipeline
                </Button>
              </a>
            </div>
          </div>

          {/* Illustration preview */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-purple/30 to-brand-blue/20 blur-2xl" />

              <div className="relative glass-card p-8 rounded-3xl glow-purple border-white/20">
                {/* Mock pipeline preview */}
                <div className="space-y-3">
                  {[
                    { label: 'Idea Analysis', icon: '💡', active: true },
                    { label: 'Brainstorm Concepts', icon: '🧠', active: true },
                    { label: 'Creative Direction', icon: '🎯', active: true },
                    { label: 'Content Development', icon: '✍️', active: true },
                    { label: 'Platform Package', icon: '🚀', active: true },
                  ].map((step) => (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 p-3 rounded-xl bg-brand-purple/20 border border-brand-purple/40 backdrop-blur-xs"
                    >
                      <span className="text-lg">{step.icon}</span>
                      <span className="text-sm font-semibold text-white">
                        {step.label}
                      </span>
                      <span className="ml-auto text-xs text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        Active
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-gray-400 text-center">
                  CreatorLoop End-to-End Workflow Engine
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50" aria-hidden="true">
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="#9f67ff" strokeWidth="2" />
          <circle cx="10" cy="9" r="3" fill="#9f67ff" />
        </svg>
      </div>
    </section>
  )
}
