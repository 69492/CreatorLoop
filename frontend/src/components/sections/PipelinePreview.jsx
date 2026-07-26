import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import {
  HiLightBulb,
  HiSparkles,
  HiMap,
  HiPencilAlt,
  HiSwitchHorizontal,
  HiArchive,
} from 'react-icons/hi'

const PIPELINE_STEPS = [
  {
    step: 1,
    icon: <HiLightBulb size={20} />,
    title: 'Idea',
    description: 'Start with a raw creative idea, theme, or concept you want to explore.',
    iconBg: 'bg-yellow-500/20 text-yellow-400',
  },
  {
    step: 2,
    icon: <HiSparkles size={20} />,
    title: 'Brainstorm',
    description: 'AI collaborates to generate angles, hooks, and creative possibilities.',
    iconBg: 'bg-purple-500/20 text-purple-400',
  },
  {
    step: 3,
    icon: <HiMap size={20} />,
    title: 'Creative Direction',
    description: 'Define the narrative structure, tone, and creative direction for the content.',
    iconBg: 'bg-brand-purple/20 text-brand-purple-light',
  },
  {
    step: 4,
    icon: <HiPencilAlt size={20} />,
    title: 'Content Development',
    description: 'Develop the full content — scripts, stories, or articles — in your voice.',
    iconBg: 'bg-brand-blue/20 text-brand-blue-light',
  },
  {
    step: 5,
    icon: <HiSwitchHorizontal size={20} />,
    title: 'Platform Adaptation',
    description: 'Adapt and reformat the content for every target platform automatically.',
    iconBg: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    step: 6,
    icon: <HiArchive size={20} />,
    title: 'Final Creative Package',
    description: 'Receive a complete creative package ready for publishing across all platforms.',
    iconBg: 'bg-green-500/20 text-green-400',
  },
]

export default function PipelinePreview() {
  return (
    <SectionWrapper id="pipeline">
      <SectionHeader
        label="Creative Pipeline"
        heading={
          <>
            Your AI-Powered{' '}
            <span className="gradient-text">Creative Flow</span>
          </>
        }
        subheading="A 6-step creative workflow where AI collaborates with you from first spark to final publishable package."
      />

      {/* Timeline — desktop horizontal, mobile vertical */}
      <div className="hidden lg:flex items-start gap-0">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex-1 flex flex-col items-center relative">
            {/* Connector line */}
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="absolute top-6 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/20 to-white/5 z-0" />
            )}

            {/* Icon circle */}
            <div
              className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-2xl ${step.iconBg} border border-white/15 mb-4 bg-navy-700`}
            >
              {step.icon}
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-navy-600 border border-white/20 text-[10px] font-bold text-gray-300">
                {step.step}
              </span>
            </div>

            {/* Card */}
            <div className="glass-card p-4 text-center mx-1 w-full">
              <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile vertical timeline */}
      <div className="lg:hidden flex flex-col gap-0">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex gap-4 relative">
            {/* Vertical connector */}
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-full bg-white/10 z-0" />
            )}

            {/* Icon */}
            <div
              className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-2xl ${step.iconBg} border border-white/15 mt-1`}
            >
              {step.icon}
            </div>

            {/* Content */}
            <div className="glass-card flex-1 p-4 mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 font-mono">0{step.step}</span>
                <h3 className="text-white font-semibold text-sm">{step.title}</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
