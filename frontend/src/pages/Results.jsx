import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { HiArrowLeft, HiSparkles, HiClock } from 'react-icons/hi'

const LOADING_STEPS = [
  { id: 1, label: 'Preparing Workspace' },
  { id: 2, label: 'Understanding Idea' },
  { id: 3, label: 'Initializing Creative Workflow' },
  { id: 4, label: 'Ready for AI' },
]

function LoadingSequence({ onComplete }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    if (activeStep >= LOADING_STEPS.length) {
      onComplete()
      return
    }
    const timer = setTimeout(() => setActiveStep((s) => s + 1), 700)
    return () => clearTimeout(timer)
  }, [activeStep, onComplete])

  return (
    <div className="space-y-3">
      {LOADING_STEPS.map((step, i) => (
        <div
          key={step.id}
          className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
            i < activeStep
              ? 'bg-green-500/10 border border-green-500/20'
              : i === activeStep
                ? 'bg-brand-purple/15 border border-brand-purple/30'
                : 'bg-white/5 border border-white/10 opacity-40'
          }`}
        >
          {/* Icon */}
          {i < activeStep ? (
            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                <path
                  d="M2 6l3 3 5-5"
                  stroke="#4ade80"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          ) : i === activeStep ? (
            <div className="w-6 h-6 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0">
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#9f67ff" strokeWidth="4" />
                <path className="opacity-75" fill="#9f67ff" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center shrink-0">
              <span className="text-[10px] text-gray-500">{step.id}</span>
            </div>
          )}

          <span
            className={`text-sm font-medium ${
              i < activeStep ? 'text-green-400' : i === activeStep ? 'text-white' : 'text-gray-600'
            }`}
          >
            {step.label}
          </span>

          {i < activeStep && (
            <span className="ml-auto text-xs text-green-600">Done</span>
          )}
          {i === activeStep && (
            <span className="ml-auto text-xs text-brand-purple-light">Running...</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Results() {
  const { state } = useLocation()
  const [loadingDone, setLoadingDone] = useState(false)

  const { idea, goal, platform, length } = state ?? {}

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-3xl mx-auto">
      {/* Back */}
      <Link
        to="/create"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <HiArrowLeft size={16} />
        Back to Create
      </Link>

      {/* Loading sequence */}
      {!loadingDone && (
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center">
              <HiSparkles size={18} className="text-brand-purple-light" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Initializing Pipeline</h2>
              <p className="text-xs text-gray-500">Setting up your creative workflow...</p>
            </div>
          </div>
          <LoadingSequence onComplete={() => setLoadingDone(true)} />
        </Card>
      )}

      {/* Empty state — AI waiting */}
      {loadingDone && (
        <>
          <Card className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-green-500/15 border border-green-500/25 flex items-center justify-center">
                <svg viewBox="0 0 12 12" width="16" height="16" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold text-base">Workflow Ready</h2>
                <p className="text-xs text-gray-500">Pipeline initialized successfully</p>
              </div>
            </div>

            {/* Session summary */}
            {idea && (
              <div className="glass-card p-4 mb-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Session Summary
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">{idea}</p>
                <div className="flex flex-wrap gap-2">
                  {goal && (
                    <span className="px-2.5 py-1 rounded-lg bg-brand-purple/15 border border-brand-purple/30 text-xs text-brand-purple-light capitalize">
                      {goal.replace('-', ' ')}
                    </span>
                  )}
                  {platform && (
                    <span className="px-2.5 py-1 rounded-lg bg-brand-blue/15 border border-brand-blue/30 text-xs text-brand-blue-light capitalize">
                      {platform.replace('-', '/')}
                    </span>
                  )}
                  {length && (
                    <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-gray-300 capitalize">
                      {length}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* AI waiting state */}
          <Card className="text-center py-10">
            <div className="w-16 h-16 rounded-3xl bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center mx-auto mb-5">
              <HiClock size={28} className="text-brand-purple-light" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Waiting for AI Collaboration...
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-6">
              This page will become fully functional in Phase 3 when IBM Granite integration is
              enabled. The creative pipeline architecture is ready to execute.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/create">
                <Button variant="primary">Start New Creation</Button>
              </Link>
              <Link to="/workspace">
                <Button variant="secondary">Back to Dashboard</Button>
              </Link>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
