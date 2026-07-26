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
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-purple-light bg-brand-purple/15 border border-brand-purple/30">
              <span className="w-2 h-2 rounded-full bg-brand-purple-light animate-pulse-slow" />
              AI Creative Partner — Phase 2
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Your AI Creative Partner for{' '}
              <span className="gradient-text">Content Creation</span>
            </h1>

            <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              CreatorLoop helps creators brainstorm ideas, develop stories, build scripts,
              adapt content for multiple platforms, and collaborate with AI throughout
              the creative process.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link to="/workspace">
                <Button variant="primary" className="text-base px-8 py-4">
                  Get Started
                  <HiArrowRight size={18} />
                </Button>
              </Link>
              <a href="#pipeline">
                <Button variant="secondary" className="text-base px-8 py-4">
                  <HiPlay size={16} />
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Illustration placeholder */}
          <div className="hidden lg:flex items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-md">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-purple/30 to-brand-blue/20 blur-2xl" />

              <div className="relative glass-card p-8 rounded-3xl glow-purple">
                {/* Mock pipeline preview */}
                <div className="space-y-3">
                  {[
                    { label: 'Idea', icon: '💡', active: true },
                    { label: 'Brainstorm', icon: '🧠', active: false },
                    { label: 'Creative Direction', icon: '🎯', active: false },
                    { label: 'Content Dev', icon: '✍️', active: false },
                    { label: 'Final Package', icon: '🚀', active: false },
                  ].map((step, i) => (
                    <div
                      key={step.label}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                        step.active
                          ? 'bg-brand-purple/30 border border-brand-purple/50'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <span className="text-lg">{step.icon}</span>
                      <span
                        className={`text-sm font-medium ${step.active ? 'text-white' : 'text-gray-400'}`}
                      >
                        {step.label}
                      </span>
                      {step.active && (
                        <span className="ml-auto text-xs text-brand-purple-light font-semibold">
                          Active
                        </span>
                      )}
                      {i < 4 && !step.active && (
                        <span className="ml-auto text-xs text-gray-600">Soon</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-xs text-gray-500 text-center">
                  CreatorLoop Pipeline — Coming Soon
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
