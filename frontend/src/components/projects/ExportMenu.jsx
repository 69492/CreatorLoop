import { useState } from 'react'
import { HiDownload } from 'react-icons/hi'
import { projectService } from '@/services/projectService'

const FORMATS = [
  { value: 'markdown', label: 'Markdown (.md)',   ext: '.md'   },
  { value: 'docx',     label: 'Word (.docx)',      ext: '.docx' },
  { value: 'pdf',      label: 'PDF / Text (.pdf)', ext: '.pdf'  },
]

export default function ExportMenu({ projectId, projectTitle }) {
  const [open, setOpen] = useState(false)
  const [downloading, setDownloading] = useState(null)

  const handleDownload = async (fmt) => {
    setOpen(false)
    setDownloading(fmt)
    try {
      const url = projectService.exportUrl(projectId, fmt)
      const a = document.createElement('a')
      a.href = url
      a.download = `${projectTitle ?? 'project'}${FORMATS.find((f) => f.value === fmt)?.ext ?? ''}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 transition-all duration-150"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-elevated)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'var(--color-surface)'
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.color = ''
        }}
      >
        <HiDownload size={15} />
        Export
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-48 p-1.5 rounded-xl shadow-xl animate-enter-from-top"
               style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 12px 40px rgba(0,0,0,0.5)' }}>
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleDownload(f.value)}
                disabled={downloading === f.value}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-slate-300 transition-colors disabled:opacity-50"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-hover)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '' }}
              >
                <HiDownload size={13} className="text-slate-600" />
                {downloading === f.value ? 'Downloading…' : f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
