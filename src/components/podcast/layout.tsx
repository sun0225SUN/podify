import { PodcastAside } from '@/components/podcast/aside'
import { PodcastInfo } from '@/components/podcast/info'

interface PodcastLayoutProps {
  children: React.ReactNode
}

export function PodcastLayout({ children }: PodcastLayoutProps) {
  return (
    <div className='flex'>
      <section className='fixed inset-0 left-0 flex w-120 overflow-y-auto'>
        <PodcastAside />
        <PodcastInfo />
      </section>
      <div className='ml-120 flex-1'>{children}</div>
    </div>
  )
}
