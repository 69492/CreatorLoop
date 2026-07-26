import { Link } from 'react-router-dom'
import SectionWrapper from '@/components/common/SectionWrapper'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { HiArrowRight, HiCode, HiLightBulb, HiSparkles } from 'react-icons/hi'

const ROADMAP = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'Complete',
    badgeVariant: 'blue',
    items: [
      'React + Vite + Tailwind CSS frontend',
      'FastAPI backend with CORS & logging',
      'Responsive landing page',
      'Health API endpoint',
      'Component library & routing',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Creator Workspace',
    status: 'In Progress',
    badgeVariant: 'purple',
    items: [
      'Professional workspace dashboard',
      'Idea input & creative goal selection',
      'Platform & length configuration',
      'Provider-independent AI architecture',
      'Creative pipeline manager',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'AI Integration',
    status: 'Planned',
    badgeVariant: 'default',
    items: [
      'IBM Granite model integration',
      'Full creative pipeline execution',
      'Multi-platform content generation',
      'Voice & style personalisation',
      'Export & delivery system',
    ],
  },
]

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-purple/15 rounded-full filter blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="purple" className="mb-6">
            About CreatorLoop
          </Badge>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            Your AI Creative Partner for{' '}
            <span className="gradient-text">Content Creation</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            CreatorLoop is an AI-powered creative platform that helps you brainstorm ideas,
            develop stories, build scripts, and adapt content for every platform — with AI
            as your collaborator throughout the entire creative process.
          </p>
        </div>
      </section>

      {/* Mission */}
      <SectionWrapper>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: <HiLightBulb size={24} />,
              title: 'The Problem',
              text: 'Content creators waste hours reformatting, rephrasing, and republishing the same ideas across platforms. There is no structured, repeatable system.',
              iconBg: 'bg-yellow-500/15',
              iconColor: 'text-yellow-400',
            },
            {
              icon: <HiCode size={24} />,
              title: 'Our Solution',
              text: 'A structured AI creative workspace where you collaborate with AI to brainstorm, develop, and adapt content across every platform — in your voice.',
              iconBg: 'bg-brand-purple/15',
              iconColor: 'text-brand-purple-light',
            },
            {
              icon: <HiSparkles size={24} />,
              title: 'The Vision',
              text: 'A world where any creator can operate with the production efficiency of a media company — without the team size or budget that normally requires.',
              iconBg: 'bg-brand-blue/15',
              iconColor: 'text-brand-blue-light',
            },
          ].map((item) => (
            <Card key={item.title} className="flex flex-col gap-4">
              <div className={`inline-flex p-3 rounded-2xl ${item.iconBg} w-fit`}>
                <span className={item.iconColor}>{item.icon}</span>
              </div>
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>

        {/* Roadmap */}
        <div className="mb-6">
          <h2 className="section-heading text-center mb-3">
            Project <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="section-subheading text-center mx-auto mb-12">
            CreatorLoop is being built in focused phases. Here is where we are and where we are
            heading.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {ROADMAP.map((phase) => (
              <Card key={phase.phase} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {phase.phase}
                  </span>
                  <Badge variant={phase.badgeVariant}>{phase.status}</Badge>
                </div>
                <h3 className="text-white font-semibold text-xl">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-purple-light shrink-0" />
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
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/workspace">
              <Button variant="primary">
                Start Creating
                <HiArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
