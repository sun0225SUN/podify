import { Episodes } from '@/components/episodes'
import { PodcastLayout } from '@/components/podcast/layout'
import type { Episode } from '@/types/podcast'

interface PodcastProps {
  episodes: Episode[]
}

export function Podcast({ episodes }: PodcastProps) {
  return (
    <PodcastLayout>
      <Episodes episodes={episodes} />
    </PodcastLayout>
  )
}
