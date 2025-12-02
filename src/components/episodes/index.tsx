import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Waveform } from '@/components/common/waveform'
import { EpisodeItem } from '@/components/episodes/episode-item'
import { EpisodesPagination } from '@/components/episodes/pagination'
import { site } from '@/config/index'
import { getPageStore } from '@/stores/page-store'
import type { Episode } from '@/types/podcast'

interface EpisodesProps {
  episodes: Episode[]
  currentPage: number
}

export function Episodes({ episodes, currentPage }: EpisodesProps) {
  useEffect(() => {
    const pageStore = getPageStore()
    pageStore.setState(() => ({ currentPage }))
  }, [currentPage])

  return (
    <>
      <EpisodesDesktop
        episodes={episodes}
        currentPage={currentPage}
      />
      <EpisodesMobile
        episodes={episodes}
        currentPage={currentPage}
      />
    </>
  )
}

function EpisodesDesktop({ episodes, currentPage }: EpisodesProps) {
  const { t } = useTranslation()
  const pageSize = site.pageSize
  const totalPages = Math.ceil(episodes.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentEpisodes = episodes.slice(startIndex, startIndex + pageSize)

  return (
    <div className='hidden w-full flex-col md:flex'>
      <div className='sticky top-0 z-10 border-border border-b bg-background'>
        <Waveform className='h-24 w-full' />
        <h1 className='absolute inset-0 top-10 px-10 font-bold text-2xl lg:px-20'>
          {t('episodes.title')}
        </h1>
      </div>

      {episodes.length === 0 ? (
        <p className='py-10 text-center text-muted-foreground'>
          {t('episodes.noEpisodes')}
        </p>
      ) : (
        <>
          <ul className='flex flex-col'>
            {currentEpisodes.map((episode) => (
              <EpisodeItem
                key={episode.id}
                episode={episode}
                variant='desktop'
              />
            ))}
          </ul>

          <EpisodesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            paddingClassName='px-10 lg:px-20 py-12'
          />
        </>
      )}
    </div>
  )
}

function EpisodesMobile({ episodes, currentPage }: EpisodesProps) {
  const { t } = useTranslation()
  const pageSize = site.pageSize
  const totalPages = Math.ceil(episodes.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentEpisodes = episodes.slice(startIndex, startIndex + pageSize)

  return (
    <div className='flex w-full flex-col md:hidden'>
      {episodes.length === 0 ? (
        <p className='py-8 text-center text-muted-foreground'>
          {t('episodes.noEpisodes')}
        </p>
      ) : (
        <>
          <ul className='flex flex-col'>
            {currentEpisodes.map((episode) => (
              <EpisodeItem
                key={episode.id}
                episode={episode}
                variant='mobile'
              />
            ))}
          </ul>

          <EpisodesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            paddingClassName='px-4 py-8'
          />
        </>
      )}
    </div>
  )
}
