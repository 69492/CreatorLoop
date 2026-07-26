/**
 * Consistent section header: label + heading + subheading.
 * center: true (default) | false
 */
export default function SectionHeader({ label, heading, subheading, center = true }) {
  const alignCls = center ? 'text-center items-center' : 'items-start'

  return (
    <div className={`flex flex-col gap-3 mb-12 sm:mb-16 ${alignCls}`}>
      {label && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-brand-purple-light bg-brand-purple/15 border border-brand-purple/30 w-fit">
          {label}
        </span>
      )}
      <h2 className="section-heading">{heading}</h2>
      {subheading && (
        <p className={`section-subheading ${center ? 'mx-auto text-center' : ''}`}>
          {subheading}
        </p>
      )}
    </div>
  )
}
