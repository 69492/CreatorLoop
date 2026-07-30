import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'

const STATS = [
  {
    emoji: '⚡',
    stat: '10×',
    label: 'Faster Production',
    desc: 'Eliminate manual reformatting and repetitive rewrites across platforms.',
    color: '#F59E0B',
  },
  {
    emoji: '🎯',
    stat: '100%',
    label: 'Brand Alignment',
    desc: 'Publish content that always matches your tone, structure, and quality.',
    color: '#2DD4BF',
  },
  {
    emoji: '🌐',
    stat: '6+',
    label: 'Platforms',
    desc: 'YouTube, LinkedIn, Instagram, Blog, X, Podcast — all from one session.',
    color: '#FF7A1A',
  },
]

export default function WhyCreatorLoop() {
  return (
    <SectionWrapper id="why">
      <SectionHeader
        label="Why CreatorLoop"
        heading="The Smarter Way to Build Content"
        subheading="Stop reinventing your workflow for every platform. CreatorLoop gives you a repeatable, scalable system."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STATS.map((item) => (
          <div
            key={item.stat}
            className="group relative flex flex-col gap-5 p-7 rounded-xl cursor-default transition-all duration-200"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${item.color}30`
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px ${item.color}15`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{ background: `linear-gradient(to right, transparent, ${item.color}, transparent)` }} />

            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                   style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}>
                {item.emoji}
              </div>
              <div className="text-right">
                <div className="text-4xl font-black leading-none" style={{ fontFamily: "'Sora', sans-serif", color: item.color }}>
                  {item.stat}
                </div>
                <div className="text-xs text-slate-600 mt-1 font-medium">{item.label}</div>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
