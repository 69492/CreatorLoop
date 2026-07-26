/**
 * Reusable section wrapper with consistent padding.
 */
export default function SectionWrapper({ id, className = '', children }) {
  return (
    <section id={id} className={`py-20 sm:py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  )
}
