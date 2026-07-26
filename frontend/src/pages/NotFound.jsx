import { Link, useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { HiArrowLeft, HiHome } from 'react-icons/hi'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex items-center justify-center px-4 bg-hero-gradient relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-brand-purple/15 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-brand-blue/10 rounded-full filter blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 display */}
        <div className="mb-6">
          <span className="text-[120px] sm:text-[160px] font-black leading-none gradient-text select-none">
            404
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          The page you are looking for doesn't exist or has been moved. Let's get you back on
          track.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <HiArrowLeft size={16} />
            Go Back
          </Button>
          <Link to="/">
            <Button variant="secondary">
              <HiHome size={16} />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
