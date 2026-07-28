import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Badge from '@/components/ui/Badge'
import {
  SiReact,
  SiFastapi,
  SiTailwindcss,
  SiPython,
} from 'react-icons/si'
import { HiCube, HiDatabase } from 'react-icons/hi'

const TECH_STACK = [
  {
    icon: <SiReact size={28} />,
    name: 'React 18',
    description: 'Component-driven UI with modern hooks and concurrent rendering for a fast, responsive workspace.',
    badge: 'Frontend',
    badgeVariant: 'blue',
    iconColor: 'text-cyan-400',
    ring: 'ring-cyan-500/15',
  },
  {
    icon: <SiFastapi size={28} />,
    name: 'FastAPI',
    description: 'High-performance async Python API with automatic OpenAPI documentation and typed requests.',
    badge: 'Backend',
    badgeVariant: 'success',
    iconColor: 'text-teal-400',
    ring: 'ring-teal-500/15',
  },
  {
    icon: <SiPython size={28} />,
    name: 'Python 3.11',
    description: 'Typed, clean Python runtime powering all backend services and the multi-stage AI pipeline.',
    badge: 'Runtime',
    badgeVariant: 'warning',
    iconColor: 'text-yellow-400',
    ring: 'ring-yellow-500/15',
  },
  {
    icon: <SiTailwindcss size={28} />,
    name: 'Tailwind CSS',
    description: 'Utility-first design system with a consistent, premium visual language across every component.',
    badge: 'Styling',
    badgeVariant: 'blue',
    iconColor: 'text-sky-400',
    ring: 'ring-sky-500/15',
  },
  {
    icon: <HiCube size={28} />,
    name: 'Groq AI',
    description: "Ultra-fast LLaMA-3 inference via Groq's dedicated AI hardware — sub-second token generation.",
    badge: 'AI Engine',
    badgeVariant: 'purple',
    iconColor: 'text-violet-400',
    ring: 'ring-violet-500/15',
  },
  {
    icon: <HiDatabase size={28} />,
    name: 'SQLite + Async',
    description: 'Async SQLAlchemy with aiosqlite for lightweight, zero-config persistent storage.',
    badge: 'Database',
    badgeVariant: 'default',
    iconColor: 'text-gray-400',
    ring: 'ring-white/8',
  },
]

export default function TechStack() {
  return (
    <SectionWrapper id="tech" className="bg-navy-800/20">
      <SectionHeader
        label="Technology"
        heading={
          <>
            Built on a{' '}
            <span className="gradient-text">Production-Grade Stack</span>
          </>
        }
        subheading="Every tool chosen for performance, developer experience, and long-term reliability at scale."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TECH_STACK.map((tech, i) => (
          <div
            key={tech.name}
            className="glass-card-hover group flex flex-col gap-4 p-6"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ring-1 ${tech.ring} bg-white/4 ${tech.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                {tech.icon}
              </div>
              <Badge variant={tech.badgeVariant}>{tech.badge}</Badge>
            </div>

            <div>
              <h3 className="text-white font-semibold text-base mb-1.5 tracking-tight">{tech.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors duration-300">{tech.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  )
}
