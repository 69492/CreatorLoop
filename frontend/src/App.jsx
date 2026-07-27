import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'
import { ToastProvider } from '@/hooks/useToast'

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App
