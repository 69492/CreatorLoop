import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/workspace/Sidebar'
import TopNav from '@/components/workspace/TopNav'

export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      <a href="#workspace-content" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main id="workspace-content" className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
