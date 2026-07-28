import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Card from '@/components/ui/Card'
import {
  HiLightBulb,
  HiPencilAlt,
  HiGlobeAlt,
  HiSwitchHorizontal,
  HiCog,
  HiUserCircle,
} from 'react-icons/hi'

const FEATURES = [
  {
    icon: <HiLightBulb size={22} />,
    title: 'AI Brainstorming Partner',
    description:
      'Explore creative angles and narrative directions collaboratively — before a single word is drafted.',
    gradient: 'from-amber-500/10 to-orange-500/5',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/18',
    accentBar: 'from-amber-500 to-orange-500',
  },
  {
    icon: <HiPencilAlt size={22} />,
    title: 'Story Development Engine',
    description:
      'Transform raw concepts into fully structured narratives with compelling arcs, hooks, and story beats.',
    gradient: 'from-brand-purple/10 to-violet-500/5',
    iconColor: 'text-brand-purple-light',
    iconBg: 'bg-brand-purple/10 border-brand-purple/18',
    accentBar: 'from-brand-purple to-violet-600',
  },
  {
    icon: <HiGlobeAlt size={22} />,
    title: 'Multi-Platform Publishing',
    description:
      'YouTube, LinkedIn, Instagram, Blog, Twitter, Podcast — all adapted natively from a single source of truth.',
    gradient: 'from-brand-blue/10 to-cyan-500/5',
    iconColor: 'text-brand-blue-light',
    iconBg: 'bg-brand-blue/10 border-brand-blue/18',
    accentBar: 'from-brand-blue to-cyan-500',
  },
  {
    icon: <HiSwitchHorizontal size={22} />,
    title: 'Intelligent Adaptation',
    description:
      'Each platform gets content formatted for its audience, tone, and native format — automatically.',
    gradient: 'from-pink-500/10 to-rose-500/5',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/10 border-pink-500/18',
    accentBar: 'from-pink-500 to-rose-500',
  },
  {
    icon: <HiCog size={22} />,
    title: 'Workflow Automation',
    description:
      'Eliminate the repetitive reformatting cycle. Focus entirely on your creative ideas — let the pipeline handle the rest.',
    gradient: 'from-emerald-500/10 to-teal-500/5',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/18',
    accentBar: 'from-emerald-500 to-teal-500',
  },
  {
    icon: <HiUserCircle size={22} />,
    title: 'Voice-Preserving AI',
    description:
      'Content that sounds like you. AI that enhances your style rather than overriding your authentic voice.',
    gradient: 'from-indigo-500/10 to-blue-500/5',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/10 border-indigo-500/18',
    accentBar: 'from-indigo-500 to-blue-500',
  },
]

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-navy-800/20">
      <SectionHeader
        label="Features"
        heading={
          <>
            Everything You Need to{' '}
            <span className="gradient-text">Create at Scale</span>
          </>
        }
        subheading="A complete creative system — from spark to publishable content — with AI as your collaborator at every stage."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            className="glass-card-hover group relative overflow-hidden p-6"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Hover gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

            {/* Top accent bar */}
            <div className={`absolute top-0 left-6 right-6 h-px bg-gradient-to-r ${feature.accentBar} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

            <div className="relative">
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl border ${feature.iconBg} mb-5 transition-transform duration-300 group-hover:scale-110`}>
                <span className={feature.iconColor}>{feature.icon}</span>
              </div>

              <h3 className="text-white font-semibold text-base mb-2.5 tracking-tight">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
