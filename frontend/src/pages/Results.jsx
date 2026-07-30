import { useEffect, useCallback, useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import {
  HiArrowLeft,
  HiRefresh,
  HiClipboardCopy,
  HiChevronDown,
  HiChevronUp,
  HiCheck,
  HiExclamationCircle,
  HiSparkles,
  HiSave,
  HiCheckCircle,
} from 'react-icons/hi'
import { useWorkspace, PIPELINE_STAGES } from '@/hooks/useWorkspace'
import { projectService } from '@/services/projectService'
import { useToast } from '@/hooks/useToast'

// ── Helper: copy to clipboard ─────────────────────────────────────────────
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copy = useCallback((text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    })
  }, [])
  return { copy, copied }
}

// ── AI Pipeline progress ──────────────────────────────────────────────────
const STAGE_LABELS = {
  0: 'Understanding Idea',
  1: 'Brainstorming',
  2: 'Writing Content',
  3: 'Platform Optimization',
  4: 'Final Polish',
}

function PipelineProgress({ currentStage, status }) {
  const totalStages = PIPELINE_STAGES.length
  const progressPct = status === 'done' ? 100 : Math.round((currentStage / totalStages) * 100)

  return (
    <div
      className="mb-6 rounded-xl p-6"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: 'rgba(255,122,26,0.1)', border: '1px solid rgba(255,122,26,0.2)' }}>
          <HiSparkles size={18} style={{ color: '#FF7A1A' }} />
        </div>
        <div>
          <h2 className="text-white font-bold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
            AI Generation Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            {status === 'loading'
              ? (STAGE_LABELS[currentStage] ?? 'Processing…')
              : status === 'done' ? '✓ Pipeline Complete' : 'Ready'}
          </p>
        </div>
        {status === 'loading' && (
          <div className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
               style={{ background: 'rgba(255,122,26,0.08)', color: '#FF9A4D', border: '1px solid rgba(255,122,26,0.2)' }}>
            {progressPct}%
          </div>
        )}
        {status === 'done' && (
          <div className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
               style={{ background: 'rgba(34,197,94,0.08)', color: '#4ADE80', border: '1px solid rgba(34,197,94,0.2)' }}>
            Complete
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPct}%`,
            background: 'linear-gradient(to right, #FF7A1A, #2DD4BF)',
          }}
        />
      </div>

      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage, i) => {
          const done   = status === 'done' || i < currentStage
          const active = i === currentStage && status === 'loading'
          return (
            <div
              key={stage.id}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300"
              style={
                done
                  ? { background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)' }
                  : active
                    ? { background: 'rgba(255,122,26,0.08)', border: '1px solid rgba(255,122,26,0.25)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', opacity: 0.4 }
              }
            >
              {done ? (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                  <HiCheck size={12} style={{ color: '#4ADE80' }} />
                </div>
              ) : active ? (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: 'rgba(255,122,26,0.15)', border: '1px solid rgba(255,122,26,0.3)' }}>
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#FF7A1A" strokeWidth="4" />
                    <path className="opacity-75" fill="#FF7A1A" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-slate-600"
                     style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                  {i + 1}
                </div>
              )}

              <span className="text-sm mr-1">{stage.emoji}</span>
              <span className="text-sm font-medium flex-1"
                    style={{ color: done ? '#4ADE80' : active ? '#fff' : '#64748B' }}>
                {STAGE_LABELS[i] ?? stage.label}
              </span>

              {done   && <span className="text-xs font-semibold" style={{ color: '#4ADE80' }}>Done</span>}
              {active && <span className="text-xs font-semibold animate-pulse" style={{ color: '#FF9A4D' }}>Processing…</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Collapsible result card ────────────────────────────────────────────────
function ResultCard({ title, emoji, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-xl overflow-hidden transition-all"
         style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors focus-visible:outline-none"
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{emoji}</span>
          <span className="text-white font-semibold text-[15px]" style={{ fontFamily: "'Sora', sans-serif" }}>
            {title}
          </span>
        </div>
        {open
          ? <HiChevronUp size={16} className="text-slate-500 shrink-0" />
          : <HiChevronDown size={16} className="text-slate-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 border-t animate-fade-in" style={{ borderColor: 'var(--color-border)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ── Copy button ────────────────────────────────────────────────────────────
function CopyBtn({ text, id, copy, copied }) {
  const isCopied = copied === id
  return (
    <button
      type="button"
      onClick={() => copy(text, id)}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none"
      style={{
        background: isCopied ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.05)',
        border: isCopied ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--color-border)',
        color: isCopied ? '#4ADE80' : '#94A3B8',
      }}
      onMouseEnter={(e) => { if (!isCopied) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' } }}
      onMouseLeave={(e) => { if (!isCopied) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8' } }}
    >
      {isCopied
        ? <><HiCheck size={12} /> Copied</>
        : <><HiClipboardCopy size={12} /> Copy</>}
    </button>
  )
}

function InfoField({ label, value }) {
  if (!value) return null
  return (
    <div className="p-3.5 rounded-lg" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-sm text-slate-200 font-medium">{value}</div>
    </div>
  )
}

// ── Analysis card ──────────────────────────────────────────────────────────
function AnalysisCard({ data }) {
  if (!data) return null
  return (
    <ResultCard title="Idea Analysis" emoji="🔍" defaultOpen>
      <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
        <InfoField label="Topic"         value={data.topic} />
        <InfoField label="Target Audience" value={data.audience} />
        <InfoField label="Core Purpose"  value={data.purpose} />
        <InfoField label="Tone of Voice" value={data.tone} />
        <InfoField label="Content Depth" value={data.difficulty} />
        <InfoField label="Content Type"  value={data.content_type} />
      </div>
      {data.keywords?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.keywords.map((kw) => (
            <Badge key={kw} variant="orange">#{kw}</Badge>
          ))}
        </div>
      )}
    </ResultCard>
  )
}

// ── Brainstorm card ────────────────────────────────────────────────────────
function BrainstormCard({ concepts }) {
  if (!concepts?.length) return null
  return (
    <ResultCard title="Creative Concepts" emoji="✨">
      <div className="mt-3 space-y-3">
        {concepts.map((c, i) => (
          <div key={i} className="p-4 rounded-xl space-y-2"
               style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-white font-semibold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>{c.title}</h4>
              <span className="text-xs font-mono text-slate-600 shrink-0">#{c.id ?? i + 1}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{c.description ?? c.angle}</p>
            {c.hook && (
              <div className="p-3 rounded-lg text-xs text-slate-200 italic leading-relaxed"
                   style={{ background: 'rgba(255,122,26,0.06)', border: '1px solid rgba(255,122,26,0.15)' }}>
                "{c.hook}"
              </div>
            )}
          </div>
        ))}
      </div>
    </ResultCard>
  )
}

// ── Direction card ─────────────────────────────────────────────────────────
function DirectionCard({ data, copy, copied }) {
  if (!data) return null
  const title = data.title ?? data.recommended_title ?? ''
  const reason = data.reason ?? data.rationale ?? ''
  return (
    <ResultCard title="Recommended Direction" emoji="🎯" defaultOpen>
      <div className="mt-3 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-white font-bold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h4>
            <CopyBtn text={title} id="dir-title" copy={copy} copied={copied} />
          </div>
          {data.hook && (
            <div className="p-3.5 text-sm text-slate-200 italic leading-relaxed rounded-xl"
                 style={{ background: 'rgba(255,122,26,0.06)', border: '1px solid rgba(255,122,26,0.18)' }}>
              "{data.hook}"
            </div>
          )}
        </div>
        {reason && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Strategic Rationale</div>
            <p className="text-sm text-slate-300 leading-relaxed">{reason}</p>
          </div>
        )}
        {data.key_messages?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Key Messaging Pillars</div>
            <ul className="space-y-2">
              {data.key_messages.map((msg, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {msg}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ResultCard>
  )
}

// ── Content card ───────────────────────────────────────────────────────────
function ContentCard({ data, copy, copied }) {
  if (!data) return null
  const draft = data.draft ?? data.full_draft ?? ''
  return (
    <ResultCard title="Generated Draft" emoji="📝" defaultOpen>
      <div className="mt-3 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-white font-bold text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>{data.title}</h4>
            {data.subtitle && <p className="text-xs text-slate-500 mt-0.5">{data.subtitle}</p>}
          </div>
          <CopyBtn text={draft} id="content-draft" copy={copy} copied={copied} />
        </div>

        {data.outline?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Outline & Structure</div>
            <div className="space-y-2">
              {data.outline.map((section, i) => {
                const label = typeof section === 'string' ? section : section.section
                const points = typeof section === 'string' ? [] : (section.talking_points ?? [])
                return (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
                    <div className="text-sm font-semibold text-slate-200 mb-1">{label}</div>
                    {points.length > 0 && (
                      <ul className="space-y-1">
                        {points.map((pt, j) => (
                          <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Full Content Draft</div>
          <div className="rounded-xl p-4 sm:p-5 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto"
               style={{ background: 'rgba(3,5,13,0.7)', border: '1px solid var(--color-border)', fontFamily: 'Inter, sans-serif' }}>
            {draft}
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-xs text-slate-500 font-medium">
              ~{data.word_count ?? 0} words · {data.reading_time_minutes ?? 0} min read
            </span>
            <CopyBtn text={draft} id="content-draft-2" copy={copy} copied={copied} />
          </div>
        </div>
      </div>
    </ResultCard>
  )
}

// ── Adaptations card ───────────────────────────────────────────────────────
function AdaptationsCard({ data, copy, copied }) {
  if (!data || Object.keys(data).length === 0) return null
  const platforms = Object.entries(data)

  const getPlatformText = (platform, content) => {
    if (typeof content === 'string') return content
    if (platform === 'youtube') return content.description ?? content.script_opening ?? ''
    if (platform === 'linkedin') return content.post ?? ''
    if (platform === 'instagram') return content.caption ?? ''
    if (platform === 'twitter') {
      if (Array.isArray(content.thread)) return content.thread.join('\n\n')
      return content.standalone_tweet ?? ''
    }
    if (platform === 'blog') return content.intro_paragraph ?? ''
    if (platform === 'podcast') return content.show_notes ?? content.intro_script ?? ''
    return JSON.stringify(content, null, 2)
  }

  return (
    <ResultCard title="Platform Adaptations" emoji="🌐">
      <div className="mt-3 space-y-3">
        {platforms.map(([platform, content]) => {
          const text = getPlatformText(platform, content)
          const isThread = typeof content === 'object' && Array.isArray(content?.thread)
          return (
            <div key={platform} className="p-4 rounded-xl"
                 style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-sm font-semibold text-white capitalize" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {platform}
                </span>
                <CopyBtn text={text} id={`adapt-${platform}`} copy={copy} copied={copied} />
              </div>
              {isThread ? (
                <div className="space-y-2">
                  {content.thread.map((tweet, i) => (
                    <div key={i} className="text-xs text-slate-200 p-3 rounded-lg leading-relaxed"
                         style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {tweet}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-5">{text}</p>
              )}
            </div>
          )
        })}
      </div>
    </ResultCard>
  )
}

// ── Suggestions card ───────────────────────────────────────────────────────
function SuggestionsCard({ data, copy, copied }) {
  if (!data) return null
  const ctaText = typeof data.cta === 'string' ? data.cta : data.call_to_action?.primary ?? null
  const improvements = data.improvements ?? data.improvement_tips ?? []

  return (
    <ResultCard title="Optimization Suggestions" emoji="✨" defaultOpen>
      <div className="mt-3 space-y-4">
        {data.better_hook && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Alternative Hook</div>
              <CopyBtn text={data.better_hook} id="hook" copy={copy} copied={copied} />
            </div>
            <div className="p-3.5 text-sm text-slate-200 italic rounded-xl leading-relaxed"
                 style={{ background: 'rgba(255,122,26,0.06)', border: '1px solid rgba(255,122,26,0.18)' }}>
              "{data.better_hook}"
            </div>
          </div>
        )}

        {ctaText && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Call to Action</div>
              <CopyBtn text={ctaText} id="cta-p" copy={copy} copied={copied} />
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
              <p className="text-sm text-slate-200 font-medium">{ctaText}</p>
            </div>
          </div>
        )}

        {data.seo_keywords?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">SEO Keywords</div>
            <div className="flex flex-wrap gap-2">
              {data.seo_keywords.map((kw, i) => (
                <Badge key={i} variant="teal">{kw}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.thumbnail_ideas?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Visual / Thumbnail Concepts</div>
            <div className="space-y-1.5">
              {data.thumbnail_ideas.map((idea, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />
                  {idea}
                </div>
              ))}
            </div>
          </div>
        )}

        {improvements?.length > 0 && (
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Recommended Enhancements</div>
            <div className="space-y-2">
              {improvements.map((tip, i) => {
                if (typeof tip === 'string') {
                  return (
                    <div key={i} className="p-3 rounded-lg" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
                      <p className="text-xs text-green-400 font-medium">→ {tip}</p>
                    </div>
                  )
                }
                return (
                  <div key={i} className="p-3 rounded-lg space-y-1" style={{ background: 'var(--color-elevated)', border: '1px solid var(--color-border)' }}>
                    <div className="text-xs font-bold" style={{ color: '#FF7A1A' }}>{tip.area}</div>
                    <p className="text-xs text-slate-400">{tip.current_issue}</p>
                    <p className="text-xs text-green-400 font-medium">→ {tip.suggested_fix}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </ResultCard>
  )
}

// ── Error state ────────────────────────────────────────────────────────────
function ErrorState({ error, onRetry }) {
  return (
    <div className="text-center py-16 rounded-xl"
         style={{ background: 'var(--color-surface)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-red-400"
           style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <HiExclamationCircle size={28} />
      </div>
      <h3 className="text-white font-bold text-xl mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
        Generation Failed
      </h3>
      <p className="text-slate-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">{error}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="primary" onClick={onRetry}>
          <HiRefresh size={16} />
          Try Again
        </Button>
        <Link to="/create">
          <Button variant="secondary">Back to Create</Button>
        </Link>
      </div>
    </div>
  )
}

// ── Main Results page ──────────────────────────────────────────────────────
export default function Results() {
  const { state } = useLocation()
  const { generate, status, currentStage, results, error, reset } = useWorkspace()
  const { copy, copied } = useCopy()
  const { toast } = useToast()

  const [saving, setSaving]   = useState(false)
  const [savedId, setSavedId] = useState(null)

  const { idea, goal, platform, length } = state ?? {}

  useEffect(() => {
    if (!idea) return
    generate({ idea, goal, platform, length })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    setSavedId(null)
    reset()
    generate({ idea, goal, platform, length })
  }

  const handleSave = async () => {
    if (!results || saving) return
    setSaving(true)
    try {
      const title = results.content?.title || results.recommended_direction?.title || idea?.slice(0, 80) || 'Untitled'
      const saved = await projectService.create({
        title, idea, goal, platform, length,
        analysis:              results.analysis              ?? {},
        brainstorm:            results.brainstorm            ?? [],
        recommended_direction: results.recommended_direction ?? {},
        content:               results.content               ?? {},
        adaptations:           results.adaptations           ?? {},
        creative_suggestions:  results.creative_suggestions  ?? {},
      })
      setSavedId(saved.id)
      toast.success('Project saved to library!')
    } catch (err) {
      toast.error(`Save failed: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors focus-visible:outline-none rounded-lg"
        >
          <HiArrowLeft size={16} />
          Back to Create
        </Link>
        {status === 'done' && (
          <Button variant="secondary" size="sm" onClick={handleRetry}>
            <HiRefresh size={14} />
            Regenerate
          </Button>
        )}
      </div>

      {/* No session */}
      {!idea && (
        <div className="text-center py-14 rounded-xl"
             style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <p className="text-slate-400 mb-4">No active session data found.</p>
          <Link to="/create"><Button variant="primary">Start New Creation</Button></Link>
        </div>
      )}

      {/* Pipeline progress */}
      {idea && (status === 'loading' || status === 'done' || status === 'idle') && (
        <PipelineProgress
          currentStage={status === 'done' ? PIPELINE_STAGES.length : currentStage}
          status={status}
        />
      )}

      {/* Error */}
      {status === 'error' && <ErrorState error={error} onRetry={handleRetry} />}

      {/* Results */}
      {status === 'done' && results && (
        <div className="space-y-0 animate-fade-in">
          {/* Metadata */}
          <div className="flex flex-wrap gap-2 mb-5">
            {goal     && <Badge variant="orange" className="capitalize">Goal: {goal.replace(/-/g, ' ')}</Badge>}
            {platform && <Badge variant="teal"   className="capitalize">Platform: {platform}</Badge>}
            {length   && <Badge variant="default" className="capitalize">Length: {length}</Badge>}
          </div>

          <AnalysisCard     data={results.analysis} />
          <BrainstormCard   concepts={results.brainstorm} />
          <DirectionCard    data={results.recommended_direction} copy={copy} copied={copied} />
          <ContentCard      data={results.content}             copy={copy} copied={copied} />
          <AdaptationsCard  data={results.adaptations}         copy={copy} copied={copied} />
          <SuggestionsCard  data={results.creative_suggestions} copy={copy} copied={copied} />

          {/* Bottom actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 p-5 rounded-xl"
               style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {savedId ? (
                <Link to={`/projects/${savedId}`} className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto">
                    <HiCheckCircle size={16} />
                    View Saved Project
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" onClick={handleSave} loading={saving} className="w-full sm:w-auto">
                  <HiSave size={16} />
                  Save to Projects
                </Button>
              )}
              <Button variant="secondary" onClick={handleRetry} className="w-full sm:w-auto">
                <HiRefresh size={15} />
                Regenerate
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/create"><Button variant="ghost">New Creation</Button></Link>
              <Link to="/projects"><Button variant="ghost">Projects</Button></Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
