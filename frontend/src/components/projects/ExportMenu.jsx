import { useState, useRef } from 'react'
import { HiDownload } from 'react-icons/hi'
import { projectService } from '@/services/projectService'

const FORMATS = [
  { value: 'markdown', label: 'Markdown (.md)',   ext: '.md'   },
  { value: 'docx',     label: 'Word (.docx)',      ext: '.docx' },
  { value: 'pdf',      label: 'PDF / Text (.pdf)', ext: '.pdf'  },
]

/**
 * ExportMenu — dropdown button for downloading a project.
 * Props: projectId, projectTitle
 */
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
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-sm text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
      >
        <HiDownload size={16} />
        Export
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-48 glass-card p-1.5 shadow-xl rounded-xl border border-white/15">
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleDownload(f.value)}
                disabled={downloading === f.value}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                <HiDownload size={14} className="text-gray-500" />
                {downloading === f.value ? 'Downloading…' : f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
