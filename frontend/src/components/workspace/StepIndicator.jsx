/**
 * StepIndicator — premium progress indicator for the Create page.
 */
export default function StepIndicator({ steps, currentStep }) {
  const progress = Math.round(((currentStep) / (steps.length - 1)) * 100)

  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
      aria-label={`Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep]}`}
    >
      {/* Step labels */}
      <div className="flex items-start justify-between mb-3">
        {steps.map((step, i) => {
          const done   = i < currentStep
          const active = i === currentStep
          return (
            <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                  done
                    ? 'text-white'
                    : active
                      ? 'text-brand-purple-light scale-110'
                      : 'text-gray-700'
                }`}
                style={
                  done
                    ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 2px 8px rgba(124,58,237,0.3)' }
                    : active
                      ? { background: 'rgba(124,58,237,0.12)', border: '2px solid rgba(167,139,250,0.6)' }
                      : { background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.1)' }
                }
              >
                {done ? (
                  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`hidden sm:block text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  active ? 'text-brand-purple-light' : done ? 'text-gray-500' : 'text-gray-700'
                }`}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-1 rounded-full overflow-hidden mx-3.5"
           style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(to right, #7c3aed, #a78bfa)',
            boxShadow: progress > 0 ? '0 0 8px rgba(124,58,237,0.4)' : 'none',
          }}
        />
      </div>
    </div>
  )
}
