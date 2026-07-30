import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// ── Eagerly-loaded (critical path, tiny) ────────────────────────────────────
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import AuthPage, { SignInPage, SignUpPage, ForgotPasswordPage } from '@/pages/AuthPage'

// ── Lazy-loaded (non-critical, code-split by route) ──────────────────────────
const About         = lazy(() => import('@/pages/About'))
const Workspace     = lazy(() => import('@/pages/Workspace'))
const Create        = lazy(() => import('@/pages/Create'))
const Results       = lazy(() => import('@/pages/Results'))
const Dashboard     = lazy(() => import('@/pages/Dashboard'))
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'))
const ProfilePage   = lazy(() => import('@/pages/ProfilePage'))
const SettingsPage  = lazy(() => import('@/pages/SettingsPage'))
const HelpPage      = lazy(() => import('@/pages/HelpPage'))

// ── Fallback spinner shown while lazy chunks load ────────────────────────────
function PageLoader() {
  return (
    <div
      className="flex-1 flex items-center justify-center min-h-[60vh]"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="flex flex-col items-center gap-3">
        <svg
          className="animate-spin w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#FF7A1A" strokeWidth="3" />
          <path className="opacity-80" fill="#FF7A1A" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-xs text-slate-600 font-medium">Loading…</span>
      </div>
    </div>
  )
}

function S({ children }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  // ── Public landing pages ─────────────────────────────────────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <S><About /></S> },
    ],
  },

  // ── Auth pages (standalone, no workspace shell) ───────────────────────────
  { path: '/auth',                  element: <AuthPage /> },
  { path: '/auth/signin',           element: <SignInPage /> },
  { path: '/auth/signup',           element: <SignUpPage /> },
  { path: '/auth/forgot-password',  element: <ForgotPasswordPage /> },

  // ── Workspace (protected app shell) ──────────────────────────────────────
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <WorkspaceLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'workspace',       element: <S><Workspace /></S> },
      { path: 'create',          element: <S><Create /></S> },
      { path: 'results',         element: <S><Results /></S> },
      { path: 'projects',        element: <S><Dashboard /></S> },
      { path: 'projects/:id',    element: <S><ProjectDetail /></S> },
      { path: 'profile',         element: <S><ProfilePage /></S> },
      { path: 'settings',        element: <S><SettingsPage /></S> },
      { path: 'help',            element: <S><HelpPage /></S> },
    ],
  },

  // ── 404 ──────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
])
