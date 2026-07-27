import { createBrowserRouter } from 'react-router-dom'
import RootLayout from '@/components/layout/RootLayout'
import WorkspaceLayout from '@/components/layout/WorkspaceLayout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import NotFound from '@/pages/NotFound'
import Workspace from '@/pages/Workspace'
import Create from '@/pages/Create'
import Results from '@/pages/Results'
import Dashboard from '@/pages/Dashboard'
import ProjectDetail from '@/pages/ProjectDetail'

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
  // ── Workspace (app shell) ───────────────────────────────────────────────────
  {
    path: '/',
    element: <WorkspaceLayout />,
    children: [
      { path: 'workspace', element: <Workspace /> },
      { path: 'create', element: <Create /> },
      { path: 'results', element: <Results /> },
      { path: 'projects', element: <Dashboard /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
    ],
  },
  // ── 404 ─────────────────────────────────────────────────────────────────────
  { path: '*', element: <NotFound /> },
])
