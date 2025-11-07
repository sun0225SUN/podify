import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Pause, Play } from 'lucide-react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { cn } from '@/lib/utils'
import {
  getPlayerStore,
  pause,
  play,
  setCurrentEpisode,
} from '@/stores/player-store'
import type { Episode } from '@/types/podcast'

const markdownComponents: Partial<Components> = {
  a: ({ href, children }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='font-medium text-theme underline transition-colors hover:text-theme-hover'
    >
      {children}
    </a>
  ),
  img: () => null,
  h1: ({ children }) => <span>{children}</span>,
  h2: ({ children }) => <span>{children}</span>,
  h3: ({ children }) => <span>{children}</span>,
  h4: ({ children }) => <span>{children}</span>,
  h5: ({ children }) => <span>{children}</span>,
  h6: ({ children }) => <span>{children}</span>,
  p: ({ children }) => <span>{children} </span>,
  ul: ({ children }) => <span>{children}</span>,
  ol: ({ children }) => <span>{children}</span>,
  li: ({ children }) => <span>{children} </span>,
  blockquote: ({ children }) => <span>{children}</span>,
}

interface EpisodeItemProps {
  episode: Episode
  variant: 'desktop' | 'mobile'
}

export function EpisodeItem({ episode, variant }: EpisodeItemProps) {
  const isDesktop = variant === 'desktop'
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)
  const isPlaying = useStore(playerStore, (state) => state.isPlaying)
  const isCurrentEpisode = currentEpisode?.id === episode.id
  const isCurrentlyPlaying = isCurrentEpisode && isPlaying

  const handlePlayPause = () => {
    if (isCurrentlyPlaying) {
      pause()
    } else if (isCurrentEpisode) {
      play()
    } else {
      setCurrentEpisode(episode)
    }
  }

  return (
    <li
      className={cn(
        'flex flex-col gap-3 border-border border-b',
        isDesktop ? 'px-10 py-12 lg:px-28' : 'p-8',
      )}
    >
      {episode.published && (
        <time
          className={cn(
            'text-muted-foreground',
            isDesktop ? 'text-sm' : 'text-xs',
          )}
        >
          {new Date(episode.published).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      )}
      <h2 className={cn('font-bold', isDesktop ? 'text-2xl' : 'text-xl')}>
        {episode.title}
      </h2>
      {episode.description && (
        <div
          className={cn(
            'line-clamp-2 text-foreground/80 leading-relaxed',
            !isDesktop && 'text-sm',
          )}
        >
          <ReactMarkdown components={markdownComponents}>
            {episode.description}
          </ReactMarkdown>
        </div>
      )}
      <div
        className={cn(
          'mt-2 flex items-center font-medium text-theme hover:text-theme-hover',
          isDesktop ? 'gap-4 text-sm' : 'flex-wrap gap-3 text-xs',
        )}
      >
        <button
          type='button'
          onClick={handlePlayPause}
          className={cn(
            'flex cursor-pointer items-center font-medium text-theme hover:text-theme-hover',
            isDesktop ? 'gap-2' : 'gap-1.5',
          )}
        >
          {isCurrentlyPlaying ? (
            <Pause
              className={cn('flex-shrink-0', isDesktop ? 'size-4' : 'size-3.5')}
            />
          ) : (
            <Play
              className={cn('flex-shrink-0', isDesktop ? 'size-4' : 'size-3.5')}
            />
          )}
          <span>{isCurrentlyPlaying ? 'Pause' : 'Listen'}</span>
        </button>
        <span className='text-muted-foreground'>/</span>
        <Link
          to='/episodes/$episodeId'
          params={{ episodeId: episode.id }}
          className='cursor-pointer font-medium text-theme hover:text-theme-hover'
        >
          Show notes
        </Link>
      </div>
    </li>
  )
}
