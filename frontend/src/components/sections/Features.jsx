import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI Brainstorming Partner',
    description: 'Explore creative angles and narrative directions with AI — before a single word is drafted.',
    accent: '#F59E0B',
  },
  {
    icon: '✍️',
    title: 'Full Content Generation',
    description: 'From raw concept to complete draft — scripts, articles, stories, and more.',
    accent: '#FF7A1A',
  },
  {
    icon: '🎯',
    title: 'Multi-Platform Adaptation',
    description: 'YouTube, LinkedIn, Instagram, Blog, X, Podcast — each formatted natively from a single source.',
    accent: '#2DD4BF',
  },
  {
    icon: '🔄',
    title: 'Workflow Automation',
    description: 'Eliminate repetitive reformatting. The pipeline handles production so you stay in your creative zone.',
    accent: '#22C55E',
  },
  {
    icon: '📦',
    title: 'Project Management',
    description: 'Save, edit, export, and organize every generated piece inside a professional workspace.',
    accent: '#818CF8',
  },
  {
    icon: '🎙️',
    title: 'Voice-Preserving AI',
    description: 'AI that enhances your style rather than overriding your authentic creative voice.',
    accent: '#F472B6',
  },
]

export default function Features() {
  return (
    <SectionWrapper id="features" style={{ background: 'var(--color-surface)' }}>
      <SectionHeader
        label="Features"
        heading="Everything You Need to Create at Scale"
        subheading="A complete creative system — from spark to publishable content — with AI as your collaborator at every stage."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            className="group relative flex flex-col gap-4 p-6 rounded-xl transition-all duration-200 cursor-default"
            style={{
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${feature.accent}30`
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${feature.accent}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-200 group-hover:scale-110"
                 style={{ background: `${feature.accent}12`, border: `1px solid ${feature.accent}25` }}>
              {feature.icon}
            </div>

            {/* Top accent line on hover */}
            <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                 style={{ background: `linear-gradient(to right, transparent, ${feature.accent}60, transparent)` }} />

            <div>
              <h3 className="text-white font-semibold text-[15px] mb-1.5 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors duration-200">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
