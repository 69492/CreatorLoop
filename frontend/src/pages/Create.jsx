import { useState, useEffect } from 'react'
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
} from 'react-icons/hi'
import { SiYoutube, SiInstagram } from 'react-icons/si'
import { HiGlobeAlt, HiMicrophone, HiAtSymbol, HiChat } from 'react-icons/hi'

const CREATIVE_GOALS = [
  {
    id: 'brainstorm',
    label: 'Brainstorm Ideas',
    description: 'Explore creative angles, hooks, and possibilities for your concept.',
    icon: <HiLightBulb size={18} />,
  },
  {
    id: 'story',
    label: 'Create Story',
    description: 'Develop a fully structured narrative with story arcs and beats.',
    icon: <HiDocumentText size={18} />,
  },
  {
    id: 'script',
    label: 'Write Script',
    description: 'Generate a ready-to-record script for video, podcast, or presentation.',
    icon: <HiFilm size={18} />,
  },
  {
    id: 'marketing',
    label: 'Create Marketing Content',
    description: 'Build ad copy, landing pages, email sequences, or social campaigns.',
    icon: <HiSpeakerphone size={18} />,
  },
  {
    id: 'repurpose',
    label: 'Repurpose Existing Content',
    description: 'Adapt existing content for different platforms and formats.',
    icon: <HiRefresh size={18} />,
  },
]

const PLATFORMS = [
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Long-form video scripts, hooks, and SEO-optimized descriptions.',
    icon: <SiYoutube size={20} />,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Professional posts, thought leadership, and industry insights.',
    icon: <HiAtSymbol size={20} />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Short-form captions, visual storytelling, and carousel content.',
    icon: <SiInstagram size={20} />,
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Long-form articles, tutorials, and in-depth explorations.',
    icon: <HiGlobeAlt size={20} />,
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    description: 'Threads, bite-sized insights, and engaging tweets.',
    icon: <HiChat size={20} />,
  },
  {
    id: 'podcast',
    label: 'Podcast',
    description: 'Episode scripts, show notes, and guest outlines.',
    icon: <HiMicrophone size={20} />,
  },
]

const LENGTHS = [
  {
    id: 'short',
    label: 'Short',
    description: 'Quick, concise, and punchy (~500 words or 2-5 minutes).',
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Standard depth and structure (~1500 words or 10-15 minutes).',
  },
  {
    id: 'long',
    label: 'Long',
    description: 'In-depth, comprehensive coverage (~3000+ words or 20+ minutes).',
  },
]

const STEPS = ['Idea', 'Goal', 'Platform', 'Length', 'Review']

export default function Create() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)

  // Form state
  const [idea, setIdea] = useState('')
  const [goal, setGoal] = useState(null)
  const [platform, setPlatform] = useState(null)
  const [length, setLength] = useState(null)
  const [charCount, setCharCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCharCount(idea.length)
  }, [idea])

  const isStepValid = () => {
    if (currentStep === 0) return idea.trim().length >= 20
    if (currentStep === 1) return goal !== null
    if (currentStep === 2) return platform !== null
    if (currentStep === 3) return length !== null
    if (currentStep === 4) return true
    return false
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
      navigate('/results', {
        state: { idea, goal, platform, length },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/workspace')}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple rounded-lg"
      >
        <HiArrowLeft size={16} />
        Back to Workspace
      </button>

      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Card className="p-6 sm:p-8 relative">
        {/* Step 0 — Idea Input */}
        {currentStep === 0 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">
                Describe your creative concept
              </h2>
              <p className="text-sm text-gray-400">
                Share the core idea, message, or subject matter for your content. Be as detailed as you like.
              </p>
            </div>

            <div>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. How remote teams can use asynchronous communication to double deep work time..."
                rows={7}
                className="w-full px-4 py-3 rounded-xl bg-navy-700/80 border border-white/15 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all text-sm leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2.5 px-1">
                <span className="text-xs text-gray-500">Minimum 20 characters required</span>
                <span
                  className={`text-xs font-medium ${charCount >= 20 ? 'text-emerald-400' : 'text-gray-500'}`}
                >
                  {charCount} characters
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Creative Goal */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Choose your primary goal</h2>
              <p className="text-sm text-gray-400">
                Select what format or objective best fits this piece of content.
              </p>
            </div>

            <div className="grid gap-3">
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

        {/* Step 2 — Target Platform */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Select target platform</h2>
              <p className="text-sm text-gray-400">
                Where will this content primarily be published?
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
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

        {/* Step 3 — Content Length */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Choose content depth & length</h2>
              <p className="text-sm text-gray-400">
                Determine the target length for your generated draft.
              </p>
            </div>

            <div className="grid gap-3">
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

        {/* Step 4 — Review */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Review session parameters</h2>
              <p className="text-sm text-gray-400">
                Confirm your configuration before launching the creative pipeline.
              </p>
            </div>

            <div className="glass-card p-5 space-y-4 border-white/15 bg-navy-800/80">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Concept Overview
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed font-medium">{idea}</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Goal
                  </h3>
                  <p className="text-sm font-semibold text-white capitalize">
                    {CREATIVE_GOALS.find((g) => g.id === goal)?.label}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Platform
                  </h3>
                  <p className="text-sm font-semibold text-white capitalize">
                    {PLATFORMS.find((p) => p.id === platform)?.label}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Length
                  </h3>
                  <p className="text-sm font-semibold text-white capitalize">{length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-white/10">
          {currentStep > 0 && (
            <Button variant="secondary" onClick={handleBack}>
              <HiArrowLeft size={16} />
              Back
            </Button>
          )}

          <div className="flex-1" />

          {currentStep < STEPS.length - 1 ? (
            <Button variant="primary" onClick={handleNext} disabled={!isStepValid()}>
              Next Step
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!isStepValid()}
              loading={loading}
            >
              <HiSparkles size={16} />
              Generate Content
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
