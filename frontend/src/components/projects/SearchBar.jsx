import { HiSearch, HiX } from 'react-icons/hi'

export default function SearchBar({ value, onChange, placeholder = 'Search projects…' }) {
  return (
    <div className="relative group">
      <HiSearch
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none transition-colors duration-150"
        aria-hidden="true"
        style={{ '--group-focus-color': '#FF7A1A' }}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-base pl-9 pr-9"
        aria-label="Search projects"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded text-slate-600 hover:text-slate-300 hover:bg-white/8 transition-all duration-150"
          aria-label="Clear search"
        >
          <HiX size={12} />
        </button>
      )}
    </div>
  )
}
