import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Button from '@/components/ui/Button'
import { HiArrowRight, HiSparkles } from 'react-icons/hi'

export default function CallToAction() {
  return (
    <SectionWrapper id="cta" className="relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-purple/10 rounded-full filter blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-brand-blue/7 rounded-full filter blur-[80px]" />
        {/* Subtle border line at top */}
        <div className="absolute top-0 inset-x-0 h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.3), transparent)' }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Icon mark */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-purple/12 border border-brand-purple/22 mb-8 mx-auto"
             style={{ boxShadow: '0 0 30px rgba(124,58,237,0.15)' }}>
          <HiSparkles size={24} className="text-brand-purple-light" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-5">
          Ready to Create{' '}
          <span className="gradient-text">Better Content?</span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
          Join creators who are building a more efficient, consistent content production
          workflow — powered by AI.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/workspace">
            <Button variant="primary" size="lg" className="px-10">
              Start Creating Free
              <HiArrowRight size={18} />
            </Button>
          </Link>
          <a href="#pipeline">
            <Button variant="secondary" size="lg" className="px-8">
              See How It Works
            </Button>
          </a>
        </div>

        <p className="mt-8 text-xs text-gray-700 tracking-wide">
          Free to use · Open source · MIT licensed
        </p>
      </div>
    </SectionWrapper>
  )
}
