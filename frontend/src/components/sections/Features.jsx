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
    icon: <HiLightBulb size={24} />,
    title: 'AI Brainstorming Partner',
    description:
      'Collaborate with AI to explore ideas, angles, and creative directions before committing to a content path.',
    gradient: 'from-yellow-500/20 to-orange-500/10',
    iconColor: 'text-yellow-400',
  },
  {
    icon: <HiPencilAlt size={24} />,
    title: 'Creative Story Development',
    description:
      'Transform a raw concept into a fully developed narrative with structured story arcs and compelling beats.',
    gradient: 'from-brand-purple/20 to-blue-500/10',
    iconColor: 'text-brand-purple-light',
  },
  {
    icon: <HiGlobeAlt size={24} />,
    title: 'Multi-Platform Content Creation',
    description:
      'Create content natively suited for YouTube, LinkedIn, Instagram, Blogs, Twitter, and Podcasts in one workflow.',
    gradient: 'from-brand-blue/20 to-cyan-500/10',
    iconColor: 'text-brand-blue-light',
  },
  {
    icon: <HiSwitchHorizontal size={24} />,
    title: 'Intelligent Content Adaptation',
    description:
      'Automatically reshape and reformat your content to match the tone, format, and audience of each platform.',
    gradient: 'from-pink-500/20 to-purple-500/10',
    iconColor: 'text-pink-400',
  },
  {
    icon: <HiCog size={24} />,
    title: 'Creative Workflow Automation',
    description:
      'Automate the repetitive steps of content production so you can focus entirely on the creative work.',
    gradient: 'from-green-500/20 to-teal-500/10',
    iconColor: 'text-green-400',
  },
  {
    icon: <HiUserCircle size={24} />,
    title: 'Personalized Creative Assistance',
    description:
      'AI that learns your voice, style, and preferences to deliver content that feels authentically yours.',
    gradient: 'from-brand-blue/20 to-indigo-500/10',
    iconColor: 'text-indigo-400',
  },
]

export default function Features() {
  return (
    <SectionWrapper id="features" className="bg-navy-800/50">
      <SectionHeader
        label="Features"
        heading={
          <>
            Your Complete{' '}
            <span className="gradient-text">AI Creative Toolkit</span>
          </>
        }
        subheading="Everything you need to move from idea to finished content — with AI as your creative collaborator at every step."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Card key={feature.title} hover>
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-5`}
            >
              <span className={feature.iconColor}>{feature.icon}</span>
            </div>

            <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
