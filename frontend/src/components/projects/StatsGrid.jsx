/**
 * StatsGrid — Midnight Studio stat cards
 */
import { HiCollection, HiDocumentText, HiGlobe, HiClock } from 'react-icons/hi'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const ITEMS_CONFIG = [
  { key: 'projects', icon: <HiCollection size={16} />, label: 'Total Projects',  color: '#FF7A1A' },
  { key: 'words',    icon: <HiDocumentText size={16} />,label: 'Words Generated', color: '#2DD4BF' },
  { key: 'platforms',icon: <HiGlobe size={16} />,       label: 'Platforms Used',  color: '#22C55E' },
  { key: 'date',     icon: <HiClock size={16} />,        label: 'Last Generation', color: '#F59E0B' },
]

export default function StatsGrid({ stats }) {
  if (!stats) return null

  const values = [
    stats.total_projects,
    stats.total_words?.toLocaleString() ?? '0',
    stats.platforms_used?.length ?? 0,
    fmtDate(stats.last_generation_date),
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {ITEMS_CONFIG.map((item, i) => (
        <div
          key={item.label}
          className="rounded-xl p-4 flex flex-col gap-2.5 transition-all duration-150"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${item.color}25`
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.transform = ''
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${item.color}10`, border: `1px solid ${item.color}20`, color: item.color }}
          >
            {item.icon}
          </div>
          <div className="text-xl font-bold text-white leading-tight tabular-nums" style={{ fontFamily: "'Sora', sans-serif" }}>
            {values[i]}
          </div>
          <div className="text-xs text-slate-600 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
