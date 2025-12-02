import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { podcastStore } from '@/stores/podcast-store'
import type { Episode } from '@/types/podcast'

interface EpisodeNavigationProps {
  currentEpisodeId: string
}

export function EpisodeNavigation({
  currentEpisodeId,
}: EpisodeNavigationProps) {
  const { t } = useTranslation()
  const episodes = useStore(podcastStore, (state) => state.episodes) || []

  const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisodeId)
  if (currentIndex === -1) return null

  const prevEpisode =
    currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null
  const nextEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null

  if (!prevEpisode && !nextEpisode) return null

  return (
    <div className='mt-12 grid grid-cols-1 gap-4 border-border border-t pt-8 md:grid-cols-2'>
      {prevEpisode ? (
        <EpisodeCard
          episode={prevEpisode}
          direction='prev'
          label={t('episodes.previous')}
        />
      ) : (
        <div />
      )}
      {nextEpisode ? (
        <EpisodeCard
          episode={nextEpisode}
          direction='next'
          label={t('episodes.next')}
        />
      ) : (
        <div />
      )}
    </div>
  )
}

function EpisodeCard({
  episode,
  direction,
  label,
}: {
  episode: Episode
  direction: 'prev' | 'next'
  label: string
}) {
  return (
    <Link
      to='/episodes/$episodeId'
      params={{ episodeId: episode.id }}
      className='group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50'
    >
      <div className='flex items-center gap-2 text-muted-foreground text-sm'>
        {direction === 'prev' && (
          <ChevronLeft className='group-hover:-translate-x-1 size-4 transition-transform' />
        )}
        <span>{label}</span>
        {direction === 'next' && (
          <ChevronRight className='size-4 transition-transform group-hover:translate-x-1' />
        )}
      </div>
      <span className='line-clamp-2 font-medium text-lg'>{episode.title}</span>
    </Link>
  )
}
