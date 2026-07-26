/**
 * Step progress indicator for the Create page.
 */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 transition-all ${
              i < currentStep
                ? 'bg-brand-purple border-brand-purple text-white'
                : i === currentStep
                  ? 'bg-brand-purple/20 border-brand-purple text-brand-purple-light'
                  : 'bg-transparent border-white/20 text-gray-600'
            }`}
          >
            {i < currentStep ? (
              <svg viewBox="0 0 12 12" width="12" height="12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              i + 1
            )}
          </div>

          {/* Label */}
          <span
            className={`hidden sm:block ml-2 text-xs font-medium transition-colors ${
              i <= currentStep ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {step}
          </span>

          {/* Connector */}
          {i < steps.length - 1 && (
            <div
              className={`flex-1 mx-3 h-0.5 transition-colors ${
                i < currentStep ? 'bg-brand-purple/60' : 'bg-white/10'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
