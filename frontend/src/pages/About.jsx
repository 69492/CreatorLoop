import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { HiArrowRight, HiCode, HiLightBulb, HiSparkles } from 'react-icons/hi'

const CAPABILITIES = [
  {
    label: 'Core Platform',
    status: 'Live',
    badgeVariant: 'success',
    items: [
      'React + Vite + Tailwind CSS frontend architecture',
      'FastAPI backend with async endpoints and CORS',
      'Responsive design system and component library',
      'Health monitoring and session management',
    ],
  },
  {
    label: 'Creator Workspace',
    status: 'Live',
    badgeVariant: 'success',
    items: [
      'Professional workspace dashboard with analytics',
      'Multi-step creative session builder',
      'Target platform and content depth configuration',
      'Project management, CRUD, and export engine',
    ],
  },
  {
    label: 'AI Generation Pipeline',
    status: 'Active',
    badgeVariant: 'purple',
    items: [
      'Multi-stage AI creative pipeline integration',
      'Brainstorming, direction synthesis, and drafting',
      'Full content generation and outline structuring',
      'Multi-platform content adaptation engine',
    ],
  },
]

export default function About() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full filter blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-brand-blue/8 rounded-full filter blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <div className="badge-label mb-6 inline-flex">About CreatorLoop</div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            AI-Powered Creative Platform for{' '}
            <span className="gradient-text">Modern Creators</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            CreatorLoop is an AI creative platform that takes your raw concept and delivers fully-developed
            scripts, stories, and platform-ready posts — with AI as your collaborator throughout.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {[
            {
              icon: <HiLightBulb size={22} />,
              title: 'The Challenge',
              text: 'Content creators spend endless hours reformatting and adapting concepts across platforms without a unified, repeatable system.',
              iconBg: 'bg-amber-500/12 border border-amber-500/20',
              iconColor: 'text-amber-400',
            },
            {
              icon: <HiCode size={22} />,
              title: 'Our Approach',
              text: 'A structured AI creative workspace where you collaborate with AI to brainstorm, draft, and adapt content natively for every platform.',
              iconBg: 'bg-brand-purple/12 border border-brand-purple/20',
              iconColor: 'text-brand-purple-light',
            },
            {
              icon: <HiSparkles size={22} />,
              title: 'The Vision',
              text: 'Empowering independent creators and media teams to operate with production-level efficiency while preserving their authentic voice.',
              iconBg: 'bg-brand-blue/12 border border-brand-blue/20',
              iconColor: 'text-brand-blue-light',
            },
          ].map((item) => (
            <Card key={item.title} hover className="flex flex-col gap-4 animate-stagger-1">
              <div className={`inline-flex p-3 rounded-2xl ${item.iconBg} w-fit`}>
                <span className={item.iconColor}>{item.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-base tracking-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>

        {/* ── Architecture ── */}
        <div className="mb-6">
          <h2 className="section-heading text-center mb-3">
            Product <span className="gradient-text">Architecture</span>
          </h2>
          <p className="section-subheading text-center mx-auto mb-12">
            CreatorLoop is engineered with robust, modular architecture designed for scale.
          </p>

          <div className="grid md:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap) => (
              <Card key={cap.label} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {cap.label}
                  </span>
                  <Badge variant={cap.badgeVariant}>{cap.status}</Badge>
                </div>
                <ul className="space-y-2.5">
                  {cap.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-brand-purple-light shrink-0" />
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
            <Link to="/workspace">
              <Button variant="primary" size="lg">
                Start Creating
                <HiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
