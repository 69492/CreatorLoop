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
      icon: <HiCollection size={17} />,
      value: stats.total_projects,
      label: 'Total Projects',
      color: 'text-brand-purple-light',
      bg: 'rgba(124,58,237,0.1)',
      border: 'rgba(124,58,237,0.18)',
    },
    {
      icon: <HiDocumentText size={17} />,
      value: stats.total_words?.toLocaleString() ?? '0',
      label: 'Words Generated',
      color: 'text-brand-blue-light',
      bg: 'rgba(59,130,246,0.1)',
      border: 'rgba(59,130,246,0.18)',
    },
    {
      icon: <HiGlobe size={17} />,
      value: stats.platforms_used?.length ?? 0,
      label: 'Platforms Used',
      color: 'text-cyan-400',
      bg: 'rgba(34,211,238,0.08)',
      border: 'rgba(34,211,238,0.15)',
    },
    {
      icon: <HiClock size={17} />,
      value: fmtDate(stats.last_generation_date),
      label: 'Last Generation',
      color: 'text-amber-400',
      bg: 'rgba(245,158,11,0.08)',
      border: 'rgba(245,158,11,0.15)',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl p-4 flex flex-col gap-2.5 transition-all duration-200"
          style={{
            background: 'rgba(12,17,32,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
            style={{ background: item.bg, border: `1px solid ${item.border}` }}
          >
            {item.icon}
          </div>
          <div className="text-xl font-bold text-white leading-tight tabular-nums">{item.value}</div>
          <div className="text-xs text-gray-600 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
