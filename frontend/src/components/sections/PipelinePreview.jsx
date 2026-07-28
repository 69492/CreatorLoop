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
    description: 'Start with any raw idea — a theme, a question, or a topic you want to explore.',
    accent: 'border-amber-500/25 text-amber-400',
    bg: 'bg-amber-500/10',
    dotColor: 'bg-amber-400',
    lineColor: 'from-amber-400/30',
  },
  {
    step: 2,
    icon: <HiSparkles size={20} />,
    title: 'Brainstorm',
    description: 'AI generates multiple creative angles, hooks, and concepts to explore.',
    accent: 'border-violet-500/25 text-violet-400',
    bg: 'bg-violet-500/10',
    dotColor: 'bg-violet-400',
    lineColor: 'from-violet-400/30',
  },
  {
    step: 3,
    icon: <HiMap size={20} />,
    title: 'Direction',
    description: 'A recommended narrative path is selected with tone, structure, and key messaging.',
    accent: 'border-brand-purple/30 text-brand-purple-light',
    bg: 'bg-brand-purple/10',
    dotColor: 'bg-brand-purple-light',
    lineColor: 'from-brand-purple-light/30',
  },
  {
    step: 4,
    icon: <HiPencilAlt size={20} />,
    title: 'Draft',
    description: 'Full content is written — script, story, or article — matched to your chosen format.',
    accent: 'border-blue-500/25 text-brand-blue-light',
    bg: 'bg-blue-500/10',
    dotColor: 'bg-brand-blue-light',
    lineColor: 'from-brand-blue-light/30',
  },
  {
    step: 5,
    icon: <HiSwitchHorizontal size={20} />,
    title: 'Adapt',
    description: 'The draft is reformatted natively for every target platform — automatically.',
    accent: 'border-cyan-500/25 text-cyan-400',
    bg: 'bg-cyan-500/10',
    dotColor: 'bg-cyan-400',
    lineColor: 'from-cyan-400/30',
  },
  {
    step: 6,
    icon: <HiArchive size={20} />,
    title: 'Publish',
    description: 'Receive your complete creative package — ready to export and publish anywhere.',
    accent: 'border-emerald-500/25 text-emerald-400',
    bg: 'bg-emerald-500/10',
    dotColor: 'bg-emerald-400',
    lineColor: 'from-emerald-400/30',
  },
]

export default function PipelinePreview() {
  return (
    <SectionWrapper id="pipeline">
      <SectionHeader
        label="How It Works"
        heading={
          <>
            A 6-Step Pipeline From{' '}
            <span className="gradient-text">Idea to Publish</span>
          </>
        }
        subheading="Every CreatorLoop session runs your content through a structured AI workflow that handles all stages of production."
      />

      {/* Desktop horizontal timeline */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-3 mb-4">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex flex-col items-center text-center group cursor-default">
            {/* Connector line + node */}
            <div className="relative w-full flex items-center justify-center mb-5">
              {i > 0 && (
                <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 h-px"
                  style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.04), rgba(255,255,255,0.12))' }}
                />
              )}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 h-px"
                  style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.12), rgba(255,255,255,0.04))' }}
                />
              )}

              {/* Step node */}
              <div className={`relative z-10 flex items-center justify-center w-11 h-11 rounded-2xl ${step.bg} border ${step.accent} transition-all duration-300 group-hover:scale-110`}
                   style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                {step.icon}
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-navy-800 border border-white/12 text-[9px] font-bold text-gray-500">
                  {step.step}
                </span>
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:text-brand-purple-light transition-colors">{step.title}</h3>
            <p className="text-gray-600 text-xs leading-relaxed px-1">{step.description}</p>
          </div>
        ))}
      </div>

      {/* Mobile vertical timeline */}
      <div className="lg:hidden space-y-0">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex gap-4 relative pb-1">
            {/* Vertical connector */}
            {i < PIPELINE_STEPS.length - 1 && (
              <div
                className="absolute left-5 top-11 bottom-0 w-px z-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))',
                  height: 'calc(100% - 2.75rem)',
                }}
              />
            )}

            {/* Icon node */}
            <div className={`relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${step.bg} border ${step.accent} mt-1`}>
              {step.icon}
            </div>

            {/* Content */}
            <div className="glass-card flex-1 p-4 mb-3">
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-xs font-mono font-bold text-gray-600">0{step.step}</span>
                <h3 className="text-white font-semibold text-sm">{step.title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
