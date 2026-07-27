/**
 * FilterPanel — platform filter chips + sort selector.
 * Props: platform, onPlatform, sortBy, onSortBy
 */
const PLATFORMS = ['', 'youtube', 'linkedin', 'instagram', 'twitter', 'blog', 'podcast']
const PLATFORM_LABELS = {
  '':          'All Platforms',
  youtube:     'YouTube',
  linkedin:    'LinkedIn',
  instagram:   'Instagram',
  twitter:     'Twitter / X',
  blog:        'Blog',
  podcast:     'Podcast',
}

const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Recently Updated' },
  { value: 'created_at', label: 'Date Created' },
]

export default function FilterPanel({ platform, onPlatform, sortBy, onSortBy }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Platform chips */}
      <div className="flex flex-wrap gap-2 flex-1">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => onPlatform(p)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150
              ${platform === p
                ? 'bg-brand-purple/25 border-brand-purple/50 text-brand-purple-light'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }
            `}
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
          className="
            px-3 py-2 rounded-xl bg-navy-600/50 border border-white/10
            text-sm text-gray-300 focus:outline-none focus:border-brand-purple/60
            transition-colors cursor-pointer
          "
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
