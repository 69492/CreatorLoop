import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { HiArrowRight } from 'react-icons/hi'

const CAPABILITIES = [
  {
    label: 'Platform',
    status: 'Available',
    badgeVariant: 'success',
    items: [
      'Fast, responsive React workspace with modern design',
      'High-performance async API with typed endpoints',
      'Comprehensive component design system',
      'Real-time session management and health monitoring',
    ],
  },
  {
    label: 'Creator Workspace',
    status: 'Available',
    badgeVariant: 'success',
    items: [
      'Personalized dashboard with activity analytics',
      'Guided multi-step creative session builder',
      'Platform targeting and content depth controls',
      'Full project management with export engine',
    ],
  },
  {
    label: 'AI Pipeline',
    status: 'Active',
    badgeVariant: 'orange',
    items: [
      '5-stage AI creative pipeline powered by Groq',
      'Brainstorming, direction synthesis, and drafting',
      'Full content generation with structured outlines',
      'Native multi-platform content adaptation',
    ],
  },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden" style={{ background: 'var(--color-bg)' }}>
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full blur-[120px] opacity-20" style={{ background: '#FF7A1A' }} />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full blur-[100px] opacity-15" style={{ background: '#2DD4BF' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="badge-label mb-6 inline-flex">About CreatorLoop</div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6"
              style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.025em' }}>
            AI-Powered Creative Platform for{' '}
            <span style={{ color: '#FF7A1A' }}>Modern Creators</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
            CreatorLoop takes your raw concept and delivers fully-developed scripts, stories,
            and platform-ready posts — with AI as your collaborator throughout.
          </p>
        </div>
      </section>

      {/* Mission */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {[
            {
              emoji: '💡',
              title: 'The Challenge',
              text: 'Content creators spend endless hours reformatting and adapting concepts across platforms without a unified, repeatable system.',
              color: '#F59E0B',
            },
            {
              emoji: '⚙️',
              title: 'Our Approach',
              text: 'A structured AI creative workspace where you collaborate with AI to brainstorm, draft, and adapt content natively for every platform.',
              color: '#FF7A1A',
            },
            {
              emoji: '✨',
              title: 'The Vision',
              text: 'Empowering independent creators and media teams to operate with production-level efficiency while preserving their authentic voice.',
              color: '#2DD4BF',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex flex-col gap-4 p-6 rounded-xl transition-all duration-200 cursor-default"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${item.color}30`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.transform = ''
              }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                   style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                {item.emoji}
              </div>
              <h3 className="text-white font-semibold text-base tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Architecture */}
        <div className="mb-6">
          <h2 className="section-heading text-center mb-3">Product Architecture</h2>
          <p className="section-subheading text-center mx-auto mb-12">
            CreatorLoop is engineered with robust, modular architecture designed for scale.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <Card key={cap.label} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {cap.label}
                  </span>
                  <Badge variant={cap.badgeVariant}>{cap.status}</Badge>
                </div>
                <ul className="space-y-2.5">
                  {cap.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/auth/signup">
              <Button variant="primary" size="lg">
                Start Creating Free
                <HiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-600 tracking-wide">
            Free to use · No credit card required
          </p>
        </div>
      </SectionWrapper>
    </>
  )
}
