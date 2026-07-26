import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Button from '@/components/ui/Button'
import { HiArrowRight } from 'react-icons/hi'

export default function CallToAction() {
  return (
    <SectionWrapper id="cta" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-purple/20 rounded-full filter blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-purple-light bg-brand-purple/15 border border-brand-purple/30">
          Get Started — It's Free
        </span>

        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
          Ready to Build{' '}
          <span className="gradient-text">Better Content?</span>
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Join creators who are building a more efficient, consistent content production
          workflow with CreatorLoop.
        </p>

        <Link to="/about">
          <Button variant="primary" className="text-base px-10 py-4 glow-purple">
            Start Creating Today
            <HiArrowRight size={18} />
          </Button>
        </Link>

        <p className="mt-6 text-sm text-gray-500">
          No credit card required. Open-source project.
        </p>
      </div>
    </SectionWrapper>
  )
}
