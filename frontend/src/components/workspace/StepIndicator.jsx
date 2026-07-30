/**
 * StepIndicator — Midnight Studio progress indicator
 */
export default function StepIndicator({ steps, currentStep }) {
  const progress = Math.round((currentStep / (steps.length - 1)) * 100)

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
                  active ? 'scale-110' : ''
                }`}
                style={
                  done
                    ? { background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#22C55E' }
                    : active
                      ? { background: 'rgba(255,122,26,0.12)', border: '2px solid rgba(255,122,26,0.6)', color: '#FF7A1A' }
                      : { background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.1)', color: '#64748B' }
                }
              >
                {done ? (
                  <svg viewBox="0 0 12 12" width="11" height="11" fill="none" aria-hidden="true">
                    <path d="M2 6l3 3 5-5" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className="hidden sm:block text-[10px] font-semibold tracking-wide transition-colors duration-200"
                style={
                  active ? { color: '#FF7A1A' }
                  : done  ? { color: '#94A3B8' }
                  : { color: '#475569' }
                }
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div className="relative h-0.5 rounded-full overflow-hidden mx-3.5"
           style={{ background: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(to right, #FF7A1A, #2DD4BF)',
          }}
        />
      </div>
    </div>
  )
}
