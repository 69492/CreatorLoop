import { HiSearch, HiX } from 'react-icons/hi'

/**
 * Full-width search bar for the project dashboard.
 * Props: value, onChange, placeholder
 */
export default function SearchBar({ value, onChange, placeholder = 'Search projects…' }) {
  return (
    <div className="relative">
      <HiSearch
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-9 pr-9 py-2.5 rounded-xl
          bg-navy-600/50 border border-white/10
          text-sm text-gray-100 placeholder-gray-500
          focus:outline-none focus:border-brand-purple/60 focus:ring-1 focus:ring-brand-purple/40
          transition-colors
        "
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <HiX size={14} />
        </button>
      )}
    </div>
  )
}
