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

// ── Helper: copy to clipboard with confirmation ────────────────────────────
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

// ── Pipeline progress bar ──────────────────────────────────────────────────
function PipelineProgress({ currentStage, status }) {
  return (
    <Card className="mb-6 border-white/15 bg-navy-800/90">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center shrink-0 text-brand-purple-light shadow-md">
          <HiSparkles size={18} />
        </div>
        <div>
          <h2 className="text-white font-bold text-base">AI Generation Pipeline</h2>
          <p className="text-xs text-gray-400">
            {status === 'loading' ? 'Synthesizing creative direction & content...' : status === 'done' ? 'Pipeline Complete' : 'Ready'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage, i) => {
          const done = i < currentStage
          const active = i === currentStage && status === 'loading'

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-300 ${
                done
                  ? 'bg-emerald-500/10 border border-emerald-500/25'
                  : active
                    ? 'bg-brand-purple/20 border border-brand-purple/40 shadow-sm'
                    : 'bg-white/5 border border-white/5 opacity-40'
              }`}
            >
              {/* Stage icon */}
              {done ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <HiCheck size={12} className="text-emerald-400" />
                </div>
              ) : active ? (
                <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
                  <svg className="animate-spin w-3.5 h-3.5 text-brand-purple-light" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-[10px] text-gray-500 font-bold">
                  {i + 1}
                </div>
              )}

              <span className="text-sm mr-1">{stage.emoji}</span>
              <span className={`text-sm font-medium flex-1 ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-gray-500'}`}>
                {stage.label}
              </span>

              {done && <span className="text-xs text-emerald-400 font-semibold">Done</span>}
              {active && <span className="text-xs text-brand-purple-light animate-pulse font-semibold">Processing...</span>}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

// ── Collapsible result card ────────────────────────────────────────────────
function ResultCard({ title, emoji, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="glass-card mb-4 overflow-hidden border-white/15 transition-all">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{emoji}</span>
          <span className="text-white font-bold text-base">{title}</span>
        </div>
        {open ? (
          <HiChevronUp size={18} className="text-gray-400 shrink-0" />
        ) : (
          <HiChevronDown size={18} className="text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-white/10 animate-fade-in">{children}</div>
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
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-gray-300 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple"
    >
      {isCopied ? (
        <><HiCheck size={13} className="text-emerald-400" /> <span className="text-emerald-400">Copied</span></>
      ) : (
        <><HiClipboardCopy size={13} /> Copy</>
      )}
    </button>
  )
}

// ── Analysis card ──────────────────────────────────────────────────────────
function AnalysisCard({ data }) {
  if (!data) return null
  return (
    <ResultCard title="Idea Analysis" emoji="🔍" defaultOpen>
      <div className="mt-3 grid sm:grid-cols-2 gap-3">
        {[
          { label: 'Topic', value: data.topic },
          { label: 'Target Audience', value: data.audience },
          { label: 'Core Purpose', value: data.purpose },
          { label: 'Tone of Voice', value: data.tone },
          { label: 'Content Depth', value: data.difficulty },
          { label: 'Content Type', value: data.content_type },
        ].map((item) => item.value && (
          <div key={item.label} className="bg-white/5 rounded-xl p-3.5 border border-white/5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
            <div className="text-sm font-medium text-gray-200">{item.value}</div>
          </div>
        ))}
      </div>
      {data.keywords?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.keywords.map((kw) => (
            <Badge key={kw} variant="purple">
              #{kw}
            </Badge>
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
    <ResultCard title="Creative Concepts" emoji="💡">
      <div className="mt-3 space-y-3">
        {concepts.map((c, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-white font-bold text-sm">{c.title}</h4>
              <span className="text-xs font-mono text-gray-500 shrink-0">#{c.id ?? i + 1}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{c.description ?? c.angle}</p>
            {c.hook && (
              <div className="bg-brand-purple/10 rounded-lg p-3 text-xs text-brand-purple-light border border-brand-purple/20 italic leading-relaxed">
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
    <ResultCard title="Recommended Creative Direction" emoji="🎯" defaultOpen>
      <div className="mt-3 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h4 className="text-white font-bold text-base">{title}</h4>
            <CopyBtn text={title} id="dir-title" copy={copy} copied={copied} />
          </div>
          {data.hook && (
            <div className="bg-brand-purple/15 rounded-xl p-3.5 text-sm text-gray-200 italic leading-relaxed border border-brand-purple/30">
              "{data.hook}"
            </div>
          )}
        </div>
        {reason && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Strategic Rationale</div>
            <p className="text-sm text-gray-300 leading-relaxed">{reason}</p>
          </div>
        )}
        {data.key_messages?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Messaging Pillars</div>
            <ul className="space-y-2">
              {data.key_messages.map((msg, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-purple-light shrink-0" />
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
    <ResultCard title="Generated Draft" emoji="✍️" defaultOpen>
      <div className="mt-3 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-bold text-lg">{data.title}</h4>
            {data.subtitle && <p className="text-xs text-gray-400 mt-0.5">{data.subtitle}</p>}
          </div>
          <CopyBtn text={draft} id="content-draft" copy={copy} copied={copied} />
        </div>

        {data.outline?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Outline & Structure</div>
            <div className="space-y-2">
              {data.outline.map((section, i) => {
                const label = typeof section === 'string' ? section : section.section
                const points = typeof section === 'string' ? [] : (section.talking_points ?? [])
                return (
                  <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <div className="text-sm font-semibold text-gray-200 mb-1">{label}</div>
                    {points.length > 0 && (
                      <ul className="space-y-1">
                        {points.map((pt, j) => (
                          <li key={j} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-500 shrink-0" />
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
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Content Draft</div>
          <div className="bg-navy-900/90 border border-white/10 rounded-xl p-4 sm:p-5 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-sans">
            {draft}
          </div>
          <div className="flex items-center justify-between mt-3 px-1">
            <span className="text-xs text-gray-400 font-medium">~{data.word_count ?? 0} words · {data.reading_time_minutes ?? 0} min read</span>
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
          const isTwitterThread = typeof content === 'object' && Array.isArray(content?.thread)
          return (
            <div key={platform} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-bold text-white capitalize">{platform}</span>
                <CopyBtn text={text} id={`adapt-${platform}`} copy={copy} copied={copied} />
              </div>
              {isTwitterThread ? (
                <div className="space-y-2">
                  {content.thread.map((tweet, i) => (
                    <div key={i} className="text-xs text-gray-200 bg-white/5 rounded-lg p-3 leading-relaxed border border-white/5">
                      {tweet}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap line-clamp-5">{text}</p>
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
    <ResultCard title="Creative Optimization Suggestions" emoji="✨" defaultOpen>
      <div className="mt-3 space-y-4">
        {data.better_hook && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alternative Hook</div>
              <CopyBtn text={data.better_hook} id="hook" copy={copy} copied={copied} />
            </div>
            <div className="bg-brand-purple/10 rounded-xl p-3.5 text-sm text-gray-200 italic border border-brand-purple/20 leading-relaxed">
              "{data.better_hook}"
            </div>
          </div>
        )}

        {ctaText && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Call to Action</div>
              <CopyBtn text={ctaText} id="cta-p" copy={copy} copied={copied} />
            </div>
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/5">
              <p className="text-sm text-gray-200 font-medium">{ctaText}</p>
            </div>
          </div>
        )}

        {data.seo_keywords?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">SEO Keywords</div>
            <div className="flex flex-wrap gap-2">
              {data.seo_keywords.map((kw, i) => (
                <Badge key={i} variant="blue">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {data.thumbnail_ideas?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Visual / Thumbnail Concepts</div>
            <div className="space-y-1.5">
              {data.thumbnail_ideas.map((idea, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue-light shrink-0" />
                  {idea}
                </div>
              ))}
            </div>
          </div>
        )}

        {improvements?.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recommended Enhancements</div>
            <div className="space-y-2">
              {improvements.map((tip, i) => {
                if (typeof tip === 'string') {
                  return (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-xs text-emerald-400 font-medium">→ {tip}</p>
                    </div>
                  )
                }
                return (
                  <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                    <div className="text-xs font-bold text-brand-purple-light">{tip.area}</div>
                    <p className="text-xs text-gray-400">{tip.current_issue}</p>
                    <p className="text-xs text-emerald-400 font-medium">→ {tip.suggested_fix}</p>
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
    <Card className="text-center py-12 border-red-500/30">
      <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/25 flex items-center justify-center mx-auto mb-4 text-red-400">
        <HiExclamationCircle size={28} />
      </div>
      <h3 className="text-white font-bold text-xl mb-2">Generation Failed</h3>
      <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">{error}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="primary" onClick={onRetry}>
          <HiRefresh size={16} />
          Try Again
        </Button>
        <Link to="/create">
          <Button variant="secondary">Back to Create</Button>
        </Link>
      </div>
    </Card>
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
        title,
        idea,
        goal,
        platform,
        length,
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
      {/* Back Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
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

      {/* No session state */}
      {!idea && (
        <Card className="text-center py-12">
          <p className="text-gray-400 mb-4">No active session data found.</p>
          <Link to="/create"><Button variant="primary">Start New Creation</Button></Link>
        </Card>
      )}

      {/* Pipeline progress */}
      {idea && (status === 'loading' || status === 'done' || status === 'idle') && (
        <PipelineProgress
          currentStage={status === 'done' ? PIPELINE_STAGES.length : currentStage}
          status={status}
        />
      )}

      {/* Error */}
      {status === 'error' && (
        <ErrorState error={error} onRetry={handleRetry} />
      )}

      {/* Results */}
      {status === 'done' && results && (
        <div className="space-y-6 animate-fade-in">
          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2">
            {goal && (
              <Badge variant="purple" className="capitalize">
                Goal: {goal.replace(/-/g, ' ')}
              </Badge>
            )}
            {platform && (
              <Badge variant="blue" className="capitalize">
                Platform: {platform}
              </Badge>
            )}
            {length && (
              <Badge variant="default" className="capitalize">
                Length: {length}
              </Badge>
            )}
          </div>

          <AnalysisCard data={results.analysis} />
          <BrainstormCard concepts={results.brainstorm} />
          <DirectionCard data={results.recommended_direction} copy={copy} copied={copied} />
          <ContentCard data={results.content} copy={copy} copied={copied} />
          <AdaptationsCard data={results.adaptations} copy={copy} copied={copied} />
          <SuggestionsCard data={results.creative_suggestions} copy={copy} copied={copied} />

          {/* Bottom actions panel */}
          <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-navy-800/90 border-white/15">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {savedId ? (
                <Link to={`/projects/${savedId}`} className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto">
                    <HiCheckCircle size={18} />
                    View Saved Project
                  </Button>
                </Link>
              ) : (
                <Button variant="primary" onClick={handleSave} loading={saving} className="w-full sm:w-auto">
                  <HiSave size={18} />
                  Save to Projects
                </Button>
              )}

              <Button variant="secondary" onClick={handleRetry} className="w-full sm:w-auto">
                <HiRefresh size={16} />
                Regenerate
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/create">
                <Button variant="ghost">New Creation</Button>
              </Link>
              <Link to="/projects">
                <Button variant="ghost">Projects</Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
