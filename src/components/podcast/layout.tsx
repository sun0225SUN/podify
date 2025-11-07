import { PodcastAside } from '@/components/podcast/aside'
import { PodcastInfo } from '@/components/podcast/info'

interface PodcastLayoutProps {
  children: React.ReactNode
}

export function PodcastLayout({ children }: PodcastLayoutProps) {
  return (
    <>
      <div className='hidden md:fixed md:inset-0 md:flex md:overflow-hidden md:bg-background'>
        <aside className='flex h-full w-16 shrink-0 flex-col overflow-y-auto overscroll-y-contain border-border border-r'>
          <PodcastAside />
        </aside>
        <section className='flex h-full shrink-0 flex-col overflow-y-auto overscroll-y-contain border-border border-r md:w-80 lg:w-96'>
          <PodcastInfo />
        </section>
        <main className='flex h-full flex-1 flex-col overflow-y-auto overscroll-y-contain pb-28'>
          {children}
        </main>
      </div>

      <div className='flex min-h-screen flex-col md:hidden'>
        <PodcastInfo />
        <div className='flex-1'>{children}</div>
      </div>
    </>
  )
}
