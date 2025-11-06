import { Episodes } from '@/components/episodes'
import { PodcastLayout } from '@/components/podcast/layout'
import type { Episode } from '@/types/podcast'

interface PodcastProps {
  episodes: Episode[]
  currentPage: number
}

export function Podcast({ episodes, currentPage }: PodcastProps) {
  return (
    <PodcastLayout>
      <Episodes
        episodes={episodes}
        currentPage={currentPage}
      />
    </PodcastLayout>
  )
}
