import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/workspace/Sidebar'
import TopNav from '@/components/workspace/TopNav'

export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen bg-navy-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
