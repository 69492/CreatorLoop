/**
 * FilterPanel — platform filter chips + sort selector
 */
const PLATFORMS = ['', 'youtube', 'linkedin', 'instagram', 'twitter', 'blog', 'podcast']
const PLATFORM_LABELS = {
  '':          'All',
  youtube:     'YouTube',
  linkedin:    'LinkedIn',
  instagram:   'Instagram',
  twitter:     'X / Twitter',
  blog:        'Blog',
  podcast:     'Podcast',
}

const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'created_at', label: 'Date Created' },
]

export default function FilterPanel({ platform, onPlatform, sortBy, onSortBy }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
      {/* Platform chips */}
      <div className="flex flex-wrap gap-1.5 flex-1" role="group" aria-label="Filter by platform">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPlatform(p)}
            aria-pressed={platform === p}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 focus-visible:outline-none"
            style={
              platform === p
                ? { background: 'rgba(255,122,26,0.1)', borderColor: 'rgba(255,122,26,0.3)', color: '#FF9A4D' }
                : { background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: '#64748B' }
            }
            onMouseEnter={(e) => {
              if (platform !== p) {
                e.currentTarget.style.color = '#CBD5E1'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.background = 'var(--color-elevated)'
              }
            }}
            onMouseLeave={(e) => {
              if (platform !== p) {
                e.currentTarget.style.color = '#64748B'
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.background = 'var(--color-surface)'
              }
            }}
          >
            {PLATFORM_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Sort */}
      <div className="shrink-0">
        <select
          value={sortBy}
          onChange={(e) => onSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer appearance-none pr-8 focus:outline-none transition-all duration-200"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            color: '#94A3B8',
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
          }}
          aria-label="Sort projects"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ background: 'var(--color-elevated)' }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
