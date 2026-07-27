/**
 * StatsGrid — four summary stat cards for the dashboard.
 * Props: stats { total_projects, total_words, platforms_used, last_generation_date }
 */
import { HiCollection, HiDocumentText, HiGlobe, HiClock } from 'react-icons/hi'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function StatsGrid({ stats }) {
  if (!stats) return null

  const items = [
    {
      icon: <HiCollection size={20} />,
      value: stats.total_projects,
      label: 'Total Projects',
      color: 'text-brand-purple-light',
      bg: 'bg-brand-purple/10',
    },
    {
      icon: <HiDocumentText size={20} />,
      value: stats.total_words.toLocaleString(),
      label: 'Words Generated',
      color: 'text-brand-blue-light',
      bg: 'bg-brand-blue/10',
    },
    {
      icon: <HiGlobe size={20} />,
      value: stats.platforms_used.length,
      label: 'Platforms Used',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      icon: <HiClock size={20} />,
      value: fmtDate(stats.last_generation_date),
      label: 'Last Generation',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-card p-4 flex flex-col gap-2"
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
            {item.icon}
          </div>
          <div className="text-xl font-bold text-white leading-tight">{item.value}</div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
