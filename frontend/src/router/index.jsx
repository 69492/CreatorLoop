import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import AuthPage from '@/pages/AuthPage'
import Workspace from '@/pages/Workspace'
import Create from '@/pages/Create'
import Results from '@/pages/Results'
import Dashboard from '@/pages/Dashboard'
import ProjectDetail from '@/pages/ProjectDetail'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'

export const router = createBrowserRouter([
  // ── Public landing pages ────────────────────────────────────────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
    ],
  },

  // ── Auth page (standalone, no layout) ──────────────────────────────────────
  { path: '/auth', element: <AuthPage /> },

  // ── Workspace (protected app shell) ────────────────────────────────────────
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <WorkspaceLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'workspace', element: <Workspace /> },
      { path: 'create', element: <Create /> },
      { path: 'results', element: <Results /> },
      { path: 'projects', element: <Dashboard /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // ── 404 ─────────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
])
