import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SelectCard from '@/components/workspace/SelectCard'
import StepIndicator from '@/components/workspace/StepIndicator'
import {
  HiLightBulb,
  HiPencilAlt,
  HiDocumentText,
  HiFilm,
  HiSpeakerphone,
  HiRefresh,
  HiArrowLeft,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi'
import { SiYoutube, SiInstagram } from 'react-icons/si'
import { HiGlobeAlt, HiMicrophone, HiAtSymbol, HiChat } from 'react-icons/hi'

const CREATIVE_GOALS = [
  {
    id: 'brainstorm',
    label: 'Brainstorm Ideas',
    description: 'Explore creative angles, hooks, and possibilities for your concept.',
    icon: <HiLightBulb size={16} />,
  },
  {
    id: 'story',
    label: 'Create Story',
    description: 'Develop a fully structured narrative with story arcs and beats.',
    icon: <HiDocumentText size={16} />,
  },
  {
    id: 'script',
    label: 'Write Script',
    description: 'Generate a ready-to-record script for video, podcast, or presentation.',
    icon: <HiFilm size={16} />,
  },
  {
    id: 'marketing',
    label: 'Marketing Content',
    description: 'Build ad copy, landing pages, email sequences, or social campaigns.',
    icon: <HiSpeakerphone size={16} />,
  },
  {
    id: 'repurpose',
    label: 'Repurpose Content',
    description: 'Adapt existing content for different platforms and formats.',
    icon: <HiRefresh size={16} />,
  },
]

const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Long-form scripts, hooks, and SEO-optimized descriptions.',
    icon: <SiYoutube size={17} />,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional posts, thought leadership, and industry insights.',
    icon: <HiAtSymbol size={17} />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Captions, visual storytelling, and carousel content.',
    icon: <SiInstagram size={17} />,
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Long-form articles, tutorials, and in-depth explorations.',
    icon: <HiGlobeAlt size={17} />,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    description: 'Threads, bite-sized insights, and engaging tweets.',
    icon: <HiChat size={17} />,
  },
  {
    id: 'podcast',
    label: 'Podcast',
    description: 'Episode scripts, show notes, and guest outlines.',
    icon: <HiMicrophone size={17} />,
  },
]

const LENGTHS = [
  {
    id: 'short',
    label: 'Short',
    description: 'Quick, concise, and punchy — ~500 words or 2–5 minutes.',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Standard depth and structure — ~1,500 words or 10–15 minutes.',
  },
  {
    id: 'long',
    label: 'Long',
    description: 'In-depth, comprehensive coverage — ~3,000+ words or 20+ minutes.',
  },
]

const STEPS = ['Concept', 'Goal', 'Platform', 'Length', 'Review']

export default function Create() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [idea, setIdea] = useState('')
  const [goal, setGoal] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [length, setLength] = useState(null)
  const [loading, setLoading] = useState(false)

  const charCount = idea.length
  const MIN_CHARS = 20

  const isStepValid = () => {
    if (currentStep === 0) return idea.trim().length >= MIN_CHARS
    if (currentStep === 1) return goal !== null
    if (currentStep === 2) return platform !== null
    if (currentStep === 3) return length !== null
    return true
  }

  const handleNext = () => {
    if (isStepValid() && currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    if (!isStepValid()) return
    setLoading(true)
    try {
      navigate('/results', { state: { idea, goal, platform, length } })
    } finally {
      setLoading(false)
    }
  }

  const charProgress = Math.min(100, (charCount / MIN_CHARS) * 100)
  const isReady = charCount >= MIN_CHARS

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <button
        type="button"
        onClick={() => navigate('/workspace')}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
      >
        <HiArrowLeft size={14} />
        Back to Workspace
      </button>

      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {/* Main card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(12,17,32,0.8)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}
      >
        <div className="p-6 sm:p-7">

          {/* ── Step 0: Concept ── */}
          {currentStep === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1.5 tracking-tight">
                  Describe your creative concept
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Share the core idea, message, or subject matter. The more detail you provide, the richer the output.
                </p>
              </div>

              <div>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g. How remote teams can use async communication to double deep work time and reduce meeting fatigue…"
                  rows={7}
                  className="w-full px-4 py-3.5 rounded-xl resize-none text-sm leading-relaxed text-gray-100 placeholder-gray-700
                             focus:outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.09)'
                    e.target.style.boxShadow = 'none'
                  }}
                  aria-label="Creative concept description"
                />
                <div className="flex items-center justify-between mt-2 px-1">
                  <span className="text-xs text-gray-600">
                    {!isReady ? `${MIN_CHARS - charCount} more characters needed` : (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <HiCheckCircle size={12} />
                        Ready to continue
                      </span>
                    )}
                  </span>
                  <span className={`text-xs font-semibold tabular-nums ${isReady ? 'text-emerald-400' : 'text-gray-600'}`}>
                    {charCount}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${charProgress}%`,
                      background: isReady
                        ? 'linear-gradient(to right, #34d399, #10b981)'
                        : 'linear-gradient(to right, #7c3aed, #a78bfa)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Goal ── */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1.5 tracking-tight">Choose your primary goal</h2>
                <p className="text-sm text-gray-500">Select the format or objective that best fits this content.</p>
              </div>
              <div className="grid gap-2.5">
                {CREATIVE_GOALS.map((g) => (
                  <SelectCard
                    key={g.id}
                    icon={g.icon}
                    label={g.label}
                    description={g.description}
                    selected={goal === g.id}
                    onClick={() => setGoal(g.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Platform ── */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1.5 tracking-tight">Select target platform</h2>
                <p className="text-sm text-gray-500">Where will this content primarily be published?</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {PLATFORMS.map((p) => (
                  <SelectCard
                    key={p.id}
                    icon={p.icon}
                    label={p.label}
                    description={p.description}
                    selected={platform === p.id}
                    onClick={() => setPlatform(p.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Length ── */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1.5 tracking-tight">Choose content depth</h2>
                <p className="text-sm text-gray-500">Determine the target length for your generated draft.</p>
              </div>
              <div className="grid gap-2.5">
                {LENGTHS.map((l) => (
                  <SelectCard
                    key={l.id}
                    label={l.label}
                    description={l.description}
                    selected={length === l.id}
                    onClick={() => setLength(l.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Review ── */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1.5 tracking-tight">Review your session</h2>
                <p className="text-sm text-gray-500">Confirm your configuration before launching the AI pipeline.</p>
              </div>

              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-5" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-2">Concept</p>
                  <p className="text-sm text-gray-200 leading-relaxed">{idea}</p>
                </div>
                <div className="grid grid-cols-3 divide-x" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderLeftColor: 'transparent' }}>
                  {[
                    { label: 'Goal',     value: CREATIVE_GOALS.find((g) => g.id === goal)?.label },
                    { label: 'Platform', value: PLATFORMS.find((p) => p.id === platform)?.label },
                    { label: 'Length',   value: length ? length.charAt(0).toUpperCase() + length.slice(1) : '—' },
                  ].map((item, idx) => (
                    <div key={item.label} className="p-4"
                         style={{ borderLeft: idx > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-1">{item.label}</p>
                      <p className="text-sm font-semibold text-white">{item.value ?? '—'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center gap-2.5 p-3.5 rounded-xl"
                style={{ background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.18)' }}
              >
                <HiSparkles size={14} className="text-brand-purple-light shrink-0" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  The AI pipeline will generate a complete draft including brainstorming, creative direction, full content, and platform adaptations.
                </p>
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div
            className="flex items-center gap-3 mt-8 pt-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <HiArrowLeft size={13} />
                Back
              </Button>
            )}
            <div className="flex-1" />
            {currentStep < STEPS.length - 1 ? (
              <Button variant="primary" size="md" onClick={handleNext} disabled={!isStepValid()}>
                Continue
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={!isStepValid()}
                loading={loading}
              >
                <HiSparkles size={14} />
                Generate Content
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
