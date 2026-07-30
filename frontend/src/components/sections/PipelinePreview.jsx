import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'

const PIPELINE_STEPS = [
  {
    step: '01',
    emoji: '🧠',
    title: 'Idea Input',
    description: 'Describe your concept in plain language. Any topic, any format, any goal.',
    color: '#F59E0B',
  },
  {
    step: '02',
    emoji: '✨',
    title: 'Brainstorm',
    description: 'AI generates multiple creative angles, hooks, and narrative directions to explore.',
    color: '#FF7A1A',
  },
  {
    step: '03',
    emoji: '🎯',
    title: 'Direction',
    description: 'A recommended creative path is selected with tone, structure, and key messaging.',
    color: '#2DD4BF',
  },
  {
    step: '04',
    emoji: '📝',
    title: 'Draft',
    description: 'Full content is written — script, article, or story — matched to your chosen format.',
    color: '#818CF8',
  },
  {
    step: '05',
    emoji: '🔄',
    title: 'Adapt',
    description: 'The draft is reformatted natively for every target platform — automatically.',
    color: '#F472B6',
  },
  {
    step: '06',
    emoji: '🚀',
    title: 'Publish',
    description: 'Receive your complete creative package — ready to export and publish anywhere.',
    color: '#22C55E',
  },
]

export default function PipelinePreview() {
  return (
    <SectionWrapper id="pipeline">
      <SectionHeader
        label="How It Works"
        heading="A 6-Step Pipeline From Idea to Publish"
        subheading="Every session runs your content through a structured AI workflow that handles all stages of production."
      />

      {/* Desktop grid */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4 mb-6">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex flex-col items-center text-center group cursor-default">
            {/* Connector */}
            <div className="relative w-full flex items-center justify-center mb-5">
              {i > 0 && (
                <div className="absolute right-1/2 top-1/2 -translate-y-1/2 w-1/2 h-px"
                     style={{ background: 'linear-gradient(to right, transparent, var(--color-border))' }} />
              )}
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-1/2 h-px"
                     style={{ background: 'linear-gradient(to right, var(--color-border), transparent)' }} />
              )}

              {/* Node */}
              <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-200 group-hover:scale-110"
                   style={{
                     background: `${step.color}10`,
                     border: `1px solid ${step.color}25`,
                   }}
                   onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 20px ${step.color}25` }}
                   onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}>
                {step.emoji}
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold"
                      style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  {step.step}
                </span>
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm mb-1.5 group-hover:transition-colors duration-200" style={{ fontFamily: "'Sora', sans-serif" }}>
              {step.title}
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed px-1 group-hover:text-slate-500 transition-colors">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile vertical */}
      <div className="lg:hidden space-y-0">
        {PIPELINE_STEPS.map((step, i) => (
          <div key={step.step} className="flex gap-4 relative pb-1">
            {i < PIPELINE_STEPS.length - 1 && (
              <div className="absolute left-5 top-11 w-px z-0"
                   style={{ background: 'var(--color-border)', height: 'calc(100% - 2.75rem)' }} />
            )}

            <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl text-lg mt-1"
                 style={{ background: `${step.color}10`, border: `1px solid ${step.color}22` }}>
              {step.emoji}
            </div>

            <div className="flex-1 p-4 mb-3 rounded-xl"
                 style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[11px] font-bold" style={{ color: step.color }}>{step.step}</span>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{step.title}</h3>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
