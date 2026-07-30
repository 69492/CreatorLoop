import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Button from '@/components/ui/Button'
import { HiArrowRight } from 'react-icons/hi'

export default function CallToAction() {
  return (
    <SectionWrapper id="cta" className="relative overflow-hidden" style={{ background: 'var(--color-surface)' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 inset-x-0 h-px"
             style={{ background: 'linear-gradient(to right, transparent, rgba(255,122,26,0.3), transparent)' }} />
        <div className="absolute bottom-0 inset-x-0 h-px"
             style={{ background: 'linear-gradient(to right, transparent, rgba(45,212,191,0.2), transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-15"
             style={{ background: '#FF7A1A' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-8 text-2xl"
             style={{
               background: 'rgba(255,122,26,0.08)',
               border: '1px solid rgba(255,122,26,0.2)',
               boxShadow: '0 0 30px rgba(255,122,26,0.12)',
             }}>
          ✨
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.025em' }}>
          Ready to Create{' '}
          <span style={{ color: '#FF7A1A' }}>Better Content?</span>
        </h2>

        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          Join creators who are building a more efficient, consistent content production
          workflow — powered by AI.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/auth/signup">
            <Button variant="primary" size="lg" className="px-10">
              Start Creating Free
              <HiArrowRight size={17} />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="secondary" size="lg" className="px-8">
              Explore Features
            </Button>
          </a>
        </div>

        <p className="mt-8 text-xs text-slate-600 tracking-wide">
          Free to use · No credit card required
        </p>
      </div>
    </SectionWrapper>
  )
}
