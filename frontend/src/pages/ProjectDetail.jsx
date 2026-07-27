import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  HiArrowLeft, HiSave, HiTrash, HiDuplicate, HiClipboardCopy, HiCheckCircle, HiChevronDown,
} from 'react-icons/hi'

import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import RichTextEditor from '@/components/projects/RichTextEditor'
import ExportMenu from '@/components/projects/ExportMenu'
import { projectService } from '@/services/projectService'
import { useToast } from '@/hooks/useToast'

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }) : '—'

/** Section collapse card */
function Section({ title, emoji, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <Card className="mb-4 border-white/15">
      <button
        type="button"
        aria-expanded={open}
        className="flex items-center justify-between w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base font-bold text-white flex items-center gap-2.5">
          <span>{emoji}</span> {title}
        </span>
        <HiChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-4 pt-3 border-t border-white/10 animate-fade-in">{children}</div>}
    </Card>
  )
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-gray-400 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
    >
      {copied ? <HiCheckCircle size={13} className="text-emerald-400" /> : <HiClipboardCopy size={13} />}
      {copied ? <span className="text-emerald-400">Copied</span> : 'Copy'}
    </button>
  )
}

function TextField({ label, value }) {
  return (
    <div className="mb-3.5 bg-white/5 p-3.5 rounded-xl border border-white/5">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-200 flex-1 leading-relaxed font-medium">{value || '—'}</p>
        {value && <CopyBtn text={value} />}
      </div>
    </div>
  )
}

function TagList({ label, items }) {
  if (!items?.length) return null
  return (
    <div className="mb-3.5">
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={i} variant="default">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [project, setProject]     = useState(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [savedIndicator, setSavedIndicator] = useState(false)
  const [error, setError]         = useState(null)
  const [editTitle, setEditTitle] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [draftContent, setDraftContent] = useState('')

  const autoSaveTimer = useRef(null)

  // Load project
  useEffect(() => {
    setLoading(true)
    projectService.get(id)
      .then((data) => {
        setProject(data)
        setTitleValue(data.title)
        setDraftContent(data.content?.draft ?? '')
      })
      .catch(() => setError('Project not found'))
      .finally(() => setLoading(false))
  }, [id])

  // Auto-save draft
  const scheduleSave = useCallback((draft) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(async () => {
      if (!project) return
      setSaving(true)
      try {
        const updated = await projectService.update(id, {
          content: { ...project.content, draft },
        })
        setProject((prev) => ({ ...prev, ...updated }))
        setSavedIndicator(true)
        setTimeout(() => setSavedIndicator(false), 2000)
      } catch {
        toast.error('Auto-save failed')
      } finally {
        setSaving(false)
      }
    }, 800)
  }, [id, project, toast])

  const handleDraftChange = (html) => {
    setDraftContent(html)
    scheduleSave(html)
  }

  // Rename
  const handleRenameCommit = async () => {
    if (!titleValue.trim()) return
    try {
      const updated = await projectService.update(id, { title: titleValue.trim() })
      setProject((prev) => ({ ...prev, title: updated.title }))
      setEditTitle(false)
      toast.success('Title updated')
    } catch {
      toast.error('Rename failed')
    }
  }

  // Delete
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await projectService.remove(id)
      toast.success('Project deleted')
      navigate('/projects')
    } catch {
      toast.error('Delete failed')
    }
  }

  // Duplicate
  const handleDuplicate = async () => {
    try {
      const copy = await projectService.duplicate(id)
      toast.success('Project duplicated')
      navigate(`/projects/${copy.id}`)
    } catch {
      toast.error('Duplicate failed')
    }
  }

  // Copy entire project as text
  const handleCopyAll = () => {
    if (!project) return
    const text = [
      `# ${project.title}`,
      '',
      `Idea: ${project.idea}`,
      '',
      project.content?.draft ?? '',
    ].join('\n')
    navigator.clipboard.writeText(text)
    toast.success('Project content copied to clipboard')
  }

  if (loading) return (
    <div className="px-4 py-10 max-w-4xl mx-auto space-y-4">
      <div className="skeleton h-8 w-1/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="skeleton h-64 w-full" />
    </div>
  )

  if (error) return (
    <div className="px-4 py-12 max-w-4xl mx-auto text-center">
      <p className="text-gray-400 mb-4">{error}</p>
      <Link to="/projects"><Button variant="secondary">← Back to Projects</Button></Link>
    </div>
  )

  if (!project) return null

  const { analysis, brainstorm, recommended_direction, content, adaptations, creative_suggestions } = project

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* ── Back + actions bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
        >
          <HiArrowLeft size={16} />
          Projects
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {/* Auto-save indicator */}
          {saving && (
            <span className="text-xs font-semibold text-gray-400 animate-pulse mr-2">Saving…</span>
          )}
          {savedIndicator && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mr-2">
              <HiCheckCircle size={14} /> Saved
            </span>
          )}

          <Button variant="secondary" size="sm" onClick={handleCopyAll}>
            <HiClipboardCopy size={15} />
            Copy All
          </Button>
          
          <ExportMenu projectId={id} projectTitle={project.title} />
          
          <Button variant="secondary" size="sm" onClick={handleDuplicate}>
            <HiDuplicate size={15} />
            Duplicate
          </Button>
          
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <HiTrash size={15} />
            Delete
          </Button>
        </div>
      </div>

      {/* ── Project title ────────────────────────────────────────────────── */}
      <div>
        {editTitle ? (
          <div className="flex items-center gap-3">
            <input
              autoFocus
              type="text"
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameCommit(); if (e.key === 'Escape') setEditTitle(false) }}
              onBlur={handleRenameCommit}
              className="text-2xl font-bold bg-transparent border-b-2 border-brand-purple text-white focus:outline-none flex-1 py-1"
            />
          </div>
        ) : (
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-white cursor-pointer hover:text-brand-purple-light transition-colors tracking-tight"
            title="Click to rename"
            onClick={() => setEditTitle(true)}
          >
            {project.title}
          </h1>
        )}
      </div>

      {/* ── Meta badges ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="purple" className="capitalize">
          Goal: {project.goal?.replace(/-/g, ' ')}
        </Badge>
        <Badge variant="blue" className="capitalize">
          Platform: {project.platform}
        </Badge>
        <Badge variant="default" className="capitalize">
          Length: {project.length}
        </Badge>
        <Badge variant="default">
          {project.word_count?.toLocaleString()} words
        </Badge>
        <span className="text-xs text-gray-500 self-center ml-1">
          Updated {fmtDate(project.updated_at)}
        </span>
      </div>

      {/* ── Original Idea ────────────────────────────────────────────────── */}
      <Section title="Original Creative Idea" emoji="💡" defaultOpen={false}>
        <p className="text-sm text-gray-200 leading-relaxed font-medium">{project.idea}</p>
      </Section>

      {/* ── Analysis ────────────────────────────────────────────────────── */}
      {analysis && (
        <Section title="Idea Analysis" emoji="🔍" defaultOpen={false}>
          <TextField label="Topic"    value={analysis.topic} />
          <TextField label="Target Audience" value={analysis.audience} />
          <TextField label="Core Purpose"  value={analysis.purpose} />
          <TextField label="Tone of Voice"     value={analysis.tone} />
          <TagList   label="Keywords" items={analysis.keywords} />
        </Section>
      )}

      {/* ── Brainstorm ──────────────────────────────────────────────────── */}
      {brainstorm?.length > 0 && (
        <Section title="Brainstorm Concepts" emoji="🧠" defaultOpen={false}>
          {brainstorm.map((c, i) => (
            <div key={i} className="mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0 space-y-1">
              <p className="text-sm font-bold text-white">{i + 1}. {c.title}</p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-gray-300">Hook:</span> "{c.hook}"
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">{c.description}</p>
            </div>
          ))}
        </Section>
      )}

      {/* ── Recommended direction ────────────────────────────────────────── */}
      {recommended_direction && (
        <Section title="Recommended Direction" emoji="🎯" defaultOpen={false}>
          <p className="text-sm font-bold text-white mb-2">{recommended_direction.title}</p>
          <p className="text-sm text-gray-300 leading-relaxed">{recommended_direction.reason}</p>
        </Section>
      )}

      {/* ── Content (editable) ──────────────────────────────────────────── */}
      {content && (
        <Section title="Content Draft Editor" emoji="✍️" defaultOpen={true}>
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Title</p>
            <p className="text-base font-bold text-white">{content.title}</p>
          </div>
          {content.outline?.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Outline & Structure</p>
              <ol className="list-decimal list-inside space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                {content.outline.map((line, i) => (
                  <li key={i} className="text-xs text-gray-300 font-medium">{typeof line === 'string' ? line : line.section}</li>
                ))}
              </ol>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Content Draft (Auto-Saves)</p>
              {saving && <span className="text-xs text-gray-400 animate-pulse font-semibold">Saving…</span>}
              {savedIndicator && <span className="text-xs text-emerald-400 font-semibold">✓ Saved</span>}
            </div>
            <RichTextEditor
              value={draftContent}
              onChange={handleDraftChange}
              placeholder="Start editing your draft…"
            />
          </div>
        </Section>
      )}

      {/* ── Adaptations ─────────────────────────────────────────────────── */}
      {adaptations && Object.keys(adaptations).length > 0 && (
        <Section title="Platform Adaptations" emoji="🔄" defaultOpen={false}>
          {Object.entries(adaptations).map(([plat, text]) => (
            <div key={plat} className="mb-4 pb-4 border-b border-white/5 last:border-0 last:mb-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-white uppercase tracking-wider">{plat}</p>
                <CopyBtn text={typeof text === 'string' ? text : JSON.stringify(text)} />
              </div>
              <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                {typeof text === 'string' ? text : JSON.stringify(text, null, 2)}
              </p>
            </div>
          ))}
        </Section>
      )}

      {/* ── Creative suggestions ─────────────────────────────────────────── */}
      {creative_suggestions && (
        <Section title="Optimization Suggestions" emoji="✨" defaultOpen={false}>
          <TextField label="Call to Action" value={creative_suggestions.cta} />
          <TagList   label="SEO Keywords"     items={creative_suggestions.seo_keywords} />
          <TagList   label="Thumbnail Concepts"  items={creative_suggestions.thumbnail_ideas} />
          <TagList   label="Enhancement Tips"     items={creative_suggestions.improvements} />
        </Section>
      )}
    </div>
  )
}
