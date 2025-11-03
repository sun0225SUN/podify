import { createFileRoute } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme/toggle'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className='flex h-screen flex-col items-center justify-center gap-10'>
      <ThemeToggle />
      Hello World
    </div>
  )
}
