import '@/styles/episode.css'

import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { ChevronLeft, Pause, Play } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Waveform } from '@/components/common/waveform'
import { ImageLightbox, ImageWithLightbox } from '@/components/image-lightbox'
import { useIsClient } from '@/hooks/use-is-client'
import { useLightbox } from '@/hooks/use-lightbox'
import { extractImagesFromMarkdown, parseTimeStamps } from '@/lib/markdown'
import { cn } from '@/lib/utils'
import { getPageStore } from '@/stores/page-store'
import {
  getPlayerStore,
  pause,
  play,
  seek,
  setCurrentEpisode,
  setInitialEpisode,
} from '@/stores/player-store'
import type { Episode } from '@/types/podcast'

interface EpisodeDetailProps {
  episode: Episode
}

export function EpisodeDetail({ episode }: EpisodeDetailProps) {
  const lightbox = useLightbox()

  const images = useMemo(() => {
    const content = episode.content ?? episode.description ?? ''
    return extractImagesFromMarkdown(content)
  }, [episode.content, episode.description])

  const content = useMemo(() => {
    return parseTimeStamps(episode.content ?? episode.description ?? '')
  }, [episode.content, episode.description])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setInitialEpisode(episode)
  }, [episode])

  const markdownComponents: Partial<Components> = {
    a: ({ href, children }) => {
      if (href?.startsWith('#t=')) {
        const timeStr = href.replace('#t=', '')
        return (
          <button
            type='button'
            className='cursor-pointer border-none bg-transparent p-0 font-medium font-mono text-theme hover:underline'
            onClick={(e) => {
              e.preventDefault()
              const parts = timeStr.split(':').map(Number).reverse()
              const seconds = parts.reduce(
                (acc, curr, i) => acc + curr * 60 ** i,
                0,
              )

              seek(seconds)
            }}
          >
            {children}
          </button>
        )
      }

      return (
        <a
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-theme underline transition-colors hover:text-theme-hover'
        >
          {children}
        </a>
      )
    },
    img: ({ src, alt }: { src?: string; alt?: string }) => {
      const imageIndex = src ? images.findIndex((img) => img.src === src) : -1
      return (
        <ImageWithLightbox
          src={src}
          alt={alt}
          index={imageIndex >= 0 ? imageIndex : 0}
          onOpen={lightbox.open}
        />
      )
    },
  }

  return (
    <>
      <EpisodeDetailDesktop
        episode={episode}
        content={content}
        markdownComponents={markdownComponents}
      />
      <EpisodeDetailMobile
        episode={episode}
        content={content}
        markdownComponents={markdownComponents}
      />
      <ImageLightbox
        images={images}
        open={lightbox.isOpen}
        index={lightbox.currentIndex}
        onClose={lightbox.close}
        onViewChange={lightbox.setIndex}
      />
    </>
  )
}

interface EpisodeDetailDesktopProps extends EpisodeDetailProps {
  content: string
  markdownComponents: Partial<Components>
}

function EpisodeDetailDesktop({
  episode,
  content,
  markdownComponents,
}: EpisodeDetailDesktopProps) {
  const isClient = useIsClient()
  const { t, i18n } = useTranslation()
  const publishedDate = new Date(episode.published)
  const pageStore = getPageStore()
  const currentPage = useStore(pageStore, (state) => state.currentPage)
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)

  const isCurrentEpisodePlaying = currentEpisode?.id === episode.id && isPlaying

  const handlePlayPause = () => {
    if (isCurrentEpisodePlaying) {
      pause()
    } else if (currentEpisode?.id === episode.id) {
      play()
    } else {
      setCurrentEpisode(episode)
    }
  }

  return (
    <section className='hidden w-full flex-col md:flex'>
      <div className='sticky top-0 z-10 border-border border-b bg-background/5 backdrop-blur-xs'>
        <Waveform className='h-24 w-full' />
        <Link
          to='/'
          search={{ page: currentPage }}
          className={cn(
            'absolute inset-0 flex items-center gap-2 px-10 lg:px-20',
            'text-base transition-colors hover:text-muted-foreground',
          )}
        >
          <ChevronLeft className='size-4' />
          <span className='font-bold'>{t('episodes.back')}</span>
        </Link>
      </div>

      <article className='px-10 py-16 lg:px-20'>
        <div className='flex items-center gap-6'>
          <button
            type='button'
            onClick={handlePlayPause}
            className={cn(
              'group mt-2 flex h-18 w-18 shrink-0 items-center justify-center',
              'rounded-full bg-theme',
              'shadow-lg shadow-theme/20',
              'transition-all hover:scale-105 hover:bg-theme-hover hover:shadow-theme/30 hover:shadow-xl',
              'cursor-pointer focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2',
            )}
            aria-label={
              isCurrentEpisodePlaying
                ? t('episodes.pauseEpisode')
                : t('episodes.playEpisode')
            }
          >
            {isCurrentEpisodePlaying ? (
              <Pause className='h-8 w-8 fill-white text-white' />
            ) : (
              <Play className='h-8 w-8 fill-white text-white' />
            )}
          </button>

          <div className='flex flex-col'>
            <h1 className='mt-2 font-bold text-4xl text-foreground'>
              {episode.title}
            </h1>
            <time className='order-first font-mono text-muted-foreground text-sm leading-7'>
              {publishedDate.toLocaleDateString(
                i18n.language === 'zh' ? 'zh-CN' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
            </time>
          </div>
        </div>

        <div
          className={cn(
            'episode-content transition-opacity duration-300',
            isClient ? 'opacity-100' : 'opacity-0',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  )
}

interface EpisodeDetailMobileProps extends EpisodeDetailProps {
  content: string
  markdownComponents: Partial<Components>
}

function EpisodeDetailMobile({
  episode,
  content,
  markdownComponents,
}: EpisodeDetailMobileProps) {
  const isClient = useIsClient()
  const { t, i18n } = useTranslation()
  const publishedDate = new Date(episode.published)
  const pageStore = getPageStore()
  const currentPage = useStore(pageStore, (state) => state.currentPage)
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)

  const isCurrentEpisodePlaying = currentEpisode?.id === episode.id && isPlaying

  const handlePlayPause = () => {
    if (isCurrentEpisodePlaying) {
      pause()
    } else if (currentEpisode?.id === episode.id) {
      play()
    } else {
      setCurrentEpisode(episode)
    }
  }

  return (
    <section className='flex w-full flex-col md:hidden'>
      <div className='sticky top-0 z-10 h-14 w-full bg-background/95 backdrop-blur-md'>
        <Link
          to='/'
          search={{ page: currentPage }}
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-2',
            'cursor-pointer text-foreground text-sm transition-colors hover:text-muted-foreground',
          )}
        >
          <ChevronLeft className='size-4 text-foreground' />
          <span className='font-bold'>{t('episodes.back')}</span>
        </Link>
      </div>

      <article className='p-8'>
        <div className='flex items-center gap-4'>
          <button
            type='button'
            onClick={handlePlayPause}
            className={cn(
              'group mt-2 flex h-14 w-14 shrink-0 items-center justify-center',
              'rounded-full bg-theme',
              'shadow-lg shadow-theme/20',
              'transition-all hover:scale-105 hover:bg-theme-hover hover:shadow-theme/30 hover:shadow-xl',
              'cursor-pointer focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2',
            )}
            aria-label={
              isCurrentEpisodePlaying
                ? t('episodes.pauseEpisode')
                : t('episodes.playEpisode')
            }
          >
            {isCurrentEpisodePlaying ? (
              <Pause className='h-6 w-6 fill-white text-white' />
            ) : (
              <Play className='h-6 w-6 fill-white text-white' />
            )}
          </button>

          <div className='flex flex-col'>
            <h1 className='mt-2 font-bold text-2xl text-foreground'>
              {episode.title}
            </h1>
            <time className='order-first font-mono text-muted-foreground text-xs leading-7'>
              {publishedDate.toLocaleDateString(
                i18n.language === 'zh' ? 'zh-CN' : 'en-US',
                {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              )}
            </time>
          </div>
        </div>

        <div
          className={cn(
            'episode-content transition-opacity duration-300',
            isClient ? 'opacity-100' : 'opacity-0',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  )
}
