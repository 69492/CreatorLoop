import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Badge from '@/components/ui/Badge'
import {
  SiReact, SiFastapi, SiTailwindcss, SiPython,
} from 'react-icons/si'
import { HiCube, HiDatabase } from 'react-icons/hi'

const TECH_STACK = [
  {
    icon: <SiReact size={26} />,
    name: 'React 18',
    description: 'Component-driven UI with modern hooks and concurrent rendering for a fast, responsive workspace.',
    badge: 'Frontend',
    badgeVariant: 'blue',
    color: '#22D3EE',
  },
  {
    icon: <SiFastapi size={26} />,
    name: 'FastAPI',
    description: 'High-performance async Python API with automatic OpenAPI documentation and typed requests.',
    badge: 'Backend',
    badgeVariant: 'teal',
    color: '#2DD4BF',
  },
  {
    icon: <SiPython size={26} />,
    name: 'Python 3.11+',
    description: 'Typed, clean Python runtime powering all backend services and the multi-stage AI pipeline.',
    badge: 'Runtime',
    badgeVariant: 'warning',
    color: '#FACC15',
  },
  {
    icon: <SiTailwindcss size={26} />,
    name: 'Tailwind CSS',
    description: 'Utility-first design system with a consistent, premium visual language across every component.',
    badge: 'Styling',
    badgeVariant: 'blue',
    color: '#38BDF8',
  },
  {
    icon: <HiCube size={26} />,
    name: 'Groq AI',
    description: "Ultra-fast LLaMA-3 inference via Groq's dedicated AI hardware — sub-second token generation.",
    badge: 'AI Engine',
    badgeVariant: 'orange',
    color: '#FF7A1A',
  },
  {
    icon: <HiDatabase size={26} />,
    name: 'SQLite + Async',
    description: 'Async SQLAlchemy with aiosqlite for lightweight, zero-config persistent storage at every scale.',
    badge: 'Database',
    badgeVariant: 'default',
    color: '#94A3B8',
  },
]

export default function TechStack() {
  return (
    <SectionWrapper id="tech" style={{ background: 'var(--color-surface)' }}>
      <SectionHeader
        label="Technology"
        heading="Built on a Production-Grade Stack"
        subheading="Every tool chosen for performance, developer experience, and long-term reliability."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TECH_STACK.map((tech, i) => (
          <div
            key={tech.name}
            className="group flex flex-col gap-4 p-6 rounded-xl transition-all duration-200 cursor-default"
            style={{
              background: 'var(--color-elevated)',
              border: '1px solid var(--color-border)',
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${tech.color}30`
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.transform = ''
            }}
          >
            <div className="flex items-start justify-between">
              <div className="p-2.5 rounded-xl transition-transform duration-200 group-hover:scale-110"
                   style={{ background: `${tech.color}10`, border: `1px solid ${tech.color}20`, color: tech.color }}>
                {tech.icon}
              </div>
              <Badge variant={tech.badgeVariant}>{tech.badge}</Badge>
            </div>

            <div>
              <h3 className="text-white font-semibold text-[15px] mb-1.5 tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                {tech.name}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors duration-200">
                {tech.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
