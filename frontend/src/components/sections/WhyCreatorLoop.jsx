import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Card from '@/components/ui/Card'
import { HiClock, HiCheckCircle, HiGlobeAlt } from 'react-icons/hi'

const REASONS = [
  {
    icon: <HiClock size={28} />,
    title: 'Save Time',
    description:
      'Eliminate hours of manual writing, formatting, and reformatting. The pipeline handles the repetitive work so you can focus on ideas.',
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-500/15',
    stat: '10x',
    statLabel: 'Faster production',
  },
  {
    icon: <HiCheckCircle size={28} />,
    title: 'Consistency',
    description:
      'Publish content that always matches your brand voice, structure, and quality — regardless of how much you are producing.',
    iconColor: 'text-green-400',
    iconBg: 'bg-green-500/15',
    stat: '100%',
    statLabel: 'Brand aligned',
  },
  {
    icon: <HiGlobeAlt size={28} />,
    title: 'Multi-Platform Publishing',
    description:
      'One idea, adapted for every channel. YouTube scripts, LinkedIn posts, newsletter editions — all from a single source.',
    iconColor: 'text-brand-blue-light',
    iconBg: 'bg-brand-blue/15',
    stat: '6+',
    statLabel: 'Platforms supported',
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
            <span className="gradient-text">Create Content</span>
          </>
        }
        subheading="Stop spinning your wheels. CreatorLoop gives you a repeatable system that scales with your ambitions."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {REASONS.map((reason) => (
          <Card key={reason.title} hover className="flex flex-col gap-5">
            {/* Stat */}
            <div className="flex items-start justify-between">
              <div className={`inline-flex p-3 rounded-2xl ${reason.iconBg}`}>
                <span className={reason.iconColor}>{reason.icon}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold gradient-text">{reason.stat}</div>
                <div className="text-xs text-gray-500">{reason.statLabel}</div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold text-xl mb-2">{reason.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
