import SectionWrapper from '@/components/common/SectionWrapper'
import SectionHeader from '@/components/common/SectionHeader'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import {
  SiReact,
  SiFastapi,
  SiTailwindcss,
  SiPython,
} from 'react-icons/si'
import { HiCube } from 'react-icons/hi'

const TECH_STACK = [
  {
    icon: <SiReact size={32} />,
    name: 'React',
    description: 'Component-driven UI built with React 18 and modern hooks for a fast, responsive workspace.',
    badge: 'v18',
    badgeVariant: 'blue',
    iconColor: 'text-cyan-400',
    category: 'Frontend',
  },
  {
    icon: <SiFastapi size={32} />,
    name: 'FastAPI',
    description: 'High-performance async Python API powering the creative workflow backend.',
    badge: 'v0.111',
    badgeVariant: 'blue',
    iconColor: 'text-teal-400',
    category: 'Backend',
  },
  {
    icon: <SiPython size={32} />,
    name: 'Python',
    description: 'Clean, typed Python runtime powering all backend services and the AI pipeline layer.',
    badge: '3.11+',
    badgeVariant: 'blue',
    iconColor: 'text-yellow-400',
    category: 'Runtime',
  },
  {
    icon: <SiTailwindcss size={32} />,
    name: 'Tailwind CSS',
    description: 'Utility-first CSS framework delivering a consistent, premium design system.',
    badge: 'v3',
    badgeVariant: 'blue',
    iconColor: 'text-sky-400',
    category: 'Styling',
  },
  {
    icon: <HiCube size={32} />,
    name: 'IBM Bob',
    description: 'Primary AI development tool used to architect, scaffold, and build CreatorLoop.',
    badge: 'Primary Dev Tool',
    badgeVariant: 'purple',
    iconColor: 'text-violet-400',
    category: 'Dev',
  },
  {
    icon: <HiCube size={32} />,
    name: 'IBM Granite',
    description: 'Enterprise-grade foundation AI model planned as the core inference engine in Phase 3.',
    badge: 'Planned AI Model',
    badgeVariant: 'purple',
    iconColor: 'text-brand-purple-light',
    category: 'AI',
  },
]

export default function TechStack() {
  return (
    <SectionWrapper id="tech" className="bg-navy-800/50">
      <SectionHeader
        label="Technology"
        heading={
          <>
            Built on a{' '}
            <span className="gradient-text">Modern Stack</span>
          </>
        }
        subheading="Production-grade tools chosen for performance, developer experience, and long-term scalability."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {TECH_STACK.map((tech) => (
          <Card key={tech.name} hover className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className={`${tech.iconColor}`}>{tech.icon}</div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={tech.badgeVariant}>{tech.badge}</Badge>
                <span className="text-xs text-gray-600">{tech.category}</span>
              </div>
            </div>

            {/* Info */}
            <div>
              <h3 className="text-white font-semibold text-base mb-1">{tech.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{tech.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  )
}
