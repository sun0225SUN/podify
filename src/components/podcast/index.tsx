import { PodcastInfo } from '@/components/podcast/info'
import type { PodcastInfoProps } from '@/types/podcast'

export function Podcast({ podcastInfo }: { podcastInfo: PodcastInfoProps }) {
  return (
    <div className='flex flex-col items-center gap-6'>
      <PodcastInfo podcastInfo={podcastInfo} />
    </div>
  )
}
