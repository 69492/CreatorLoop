import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Card from '@/components/ui/Card'
import { HiClock, HiCheckCircle, HiGlobeAlt } from 'react-icons/hi'

const REASONS = [
  {
    icon: <HiClock size={24} />,
    title: 'Save Hours, Not Minutes',
    description:
      'Eliminate manual reformatting and repetitive rewrites. The AI pipeline handles production so you can stay in your creative zone.',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border border-amber-500/18',
    stat: '10×',
    statLabel: 'faster production',
    statColor: 'text-amber-400',
    accentBg: 'from-amber-500/6',
  },
  {
    icon: <HiCheckCircle size={24} />,
    title: 'Consistent Brand Voice',
    description:
      'Publish content that always matches your tone, structure, and quality — regardless of how much output you are producing.',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border border-emerald-500/18',
    stat: '100%',
    statLabel: 'brand alignment',
    statColor: 'text-emerald-400',
    accentBg: 'from-emerald-500/6',
  },
  {
    icon: <HiGlobeAlt size={24} />,
    title: 'One Idea, Every Platform',
    description:
      'YouTube scripts, LinkedIn posts, newsletters — all generated from a single concept in one session.',
    iconColor: 'text-brand-blue-light',
    iconBg: 'bg-brand-blue/10 border border-brand-blue/18',
    stat: '6+',
    statLabel: 'platforms supported',
    statColor: 'text-brand-blue-light',
    accentBg: 'from-brand-blue/6',
  },
]

export default function WhyCreatorLoop() {
  return (
    <SectionWrapper id="why">
      <SectionHeader
        label="Why CreatorLoop"
        heading={
          <>
            The Smarter Way to{' '}
            <span className="gradient-text">Build Content</span>
          </>
        }
        subheading="Stop reinventing your workflow for every platform. CreatorLoop gives you a repeatable system that scales with your ambitions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {REASONS.map((reason) => (
          <div key={reason.title} className="glass-card-hover group relative overflow-hidden p-6 flex flex-col gap-5">
            {/* Subtle gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${reason.accentBg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

            <div className="relative flex items-start justify-between">
              <div className={`inline-flex p-3 rounded-2xl ${reason.iconBg} transition-transform duration-300 group-hover:scale-105`}>
                <span className={reason.iconColor}>{reason.icon}</span>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-black ${reason.statColor} leading-none`}>{reason.stat}</div>
                <div className="text-xs text-gray-600 mt-1">{reason.statLabel}</div>
              </div>
            </div>

            <div className="relative">
              <h3 className="text-white font-semibold text-base mb-2 tracking-tight group-hover:text-brand-purple-light transition-colors duration-300">{reason.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
