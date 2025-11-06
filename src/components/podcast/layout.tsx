import { PodcastAside } from '@/components/podcast/aside'
import { PodcastInfo } from '@/components/podcast/info'

interface PodcastLayoutProps {
  children: React.ReactNode
}

export function PodcastLayout({ children }: PodcastLayoutProps) {
  return (
    <div className='flex'>
      <section className='fixed inset-y-0 left-0 flex w-120'>
        <PodcastAside />
        <PodcastInfo />
      </section>
      <section className='ml-120 flex flex-1 flex-col pb-28'>
        {children}
      </section>
    </div>
  )
}
