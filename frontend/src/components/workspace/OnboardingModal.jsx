import { useState, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'
import { HiArrowRight, HiArrowLeft, HiX } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const STEPS = [
  {
    emoji: '👋',
    title: 'Welcome to CreatorLoop',
    body: 'CreatorLoop is your AI-powered content studio. Turn one idea into polished content for every platform — in minutes.',
    accent: '#FF7A1A',
  },
  {
    emoji: '🧠',
    title: 'How the AI pipeline works',
    body: 'Our 5-stage pipeline understands your idea, brainstorms creative angles, writes full content drafts, optimises for each platform, and packages everything for publishing.',
    accent: '#F59E0B',
  },
  {
    emoji: '📝',
    title: 'Create your first project',
    body: 'Click "New Creation", describe your concept in a few sentences, choose a goal and platform — then let the AI do the rest. It takes about 30 seconds.',
    accent: '#2DD4BF',
  },
  {
    emoji: '🚀',
    title: "You're ready to create",
    body: 'All your projects are saved automatically. Edit, export as Markdown or JSON, and repurpose content any time from the Projects panel.',
    accent: '#22C55E',
  },
]

const ONBOARDING_KEY = 'cl_onboarding_done'

export function useOnboarding() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem(ONBOARDING_KEY)) setShow(true)
  }, [])
  const dismiss = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setShow(false)
  }, [])
  return { show, dismiss }
}

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0)
  const isLast = step === STEPS.length - 1
  const current = STEPS[step]

  const handleClose = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, '1')
    onClose()
  }, [onClose])

  const goNext = useCallback(() => {
    if (!isLast) setStep((s) => s + 1)
  }, [isLast])

  const goPrev = useCallback(() => {
    if (step > 0) setStep((s) => s - 1)
  }, [step])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowRight' && !isLast) goNext()
      if (e.key === 'ArrowLeft' && step > 0) goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleClose, goNext, goPrev, isLast, step])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(12px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className="w-full max-w-md animate-scale-in-spring rounded-2xl p-8 relative"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
        }}
      >
        {/* Close / skip */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 hover:text-slate-300 transition-colors"
          aria-label="Skip onboarding"
        >
          <HiX size={16} />
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-7" role="progressbar"
             aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length}
             aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
              aria-current={i === step ? 'step' : undefined}
              className="rounded-full transition-all duration-300 focus-visible:outline-none"
              style={{
                height: '6px',
                width: i === step ? '1.75rem' : '6px',
                background: i <= step ? current.accent : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div key={step} className="animate-fade-in">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-5"
            style={{ background: `${current.accent}12`, border: `1px solid ${current.accent}25` }}
            aria-hidden="true"
          >
            {current.emoji}
          </div>
          <h2 id="onboarding-title" className="text-xl font-bold text-white mb-3 tracking-tight leading-snug">
            {current.title}
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-8">{current.body}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs text-slate-600 hover:text-slate-400 transition-colors focus-visible:outline-none rounded"
          >
            Skip tour
          </button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={goPrev} aria-label="Previous step">
                <HiArrowLeft size={14} />
                Back
              </Button>
            )}
            {isLast ? (
              <Link to="/create" onClick={handleClose}>
                <Button variant="primary" size="md">
                  Start Creating
                  <HiArrowRight size={14} />
                </Button>
              </Link>
            ) : (
              <Button variant="primary" size="md" onClick={goNext} aria-label="Next step">
                Next
                <HiArrowRight size={14} />
              </Button>
            )}
          </div>
        </div>

        {/* Keyboard hint */}
        <p className="text-center text-[10px] text-slate-700 mt-5">
          Use ← → arrow keys to navigate · Esc to close
        </p>
      </div>
    </div>
  )
}
