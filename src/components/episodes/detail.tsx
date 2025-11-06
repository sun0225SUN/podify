import '@/styles/episode.css'

import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { ChevronLeft, Play } from 'lucide-react'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Waveform } from '@/components/common/waveform'
import { cn } from '@/lib/utils'
import { getPageStore } from '@/stores/page-store'
import type { Episode } from '@/types/podcast'

interface EpisodeDetailProps {
  episode: Episode
}

export function EpisodeDetail({ episode }: EpisodeDetailProps) {
  const publishedDate = new Date(episode.published)
  const pageStore = getPageStore()
  const currentPage = useStore(pageStore, (state) => state.currentPage)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <section className='flex w-full flex-1 flex-col'>
      <div className='sticky top-0 z-10 border-border border-b bg-background'>
        <Waveform className='h-24 w-full' />
        <Link
          to='/'
          search={{ page: currentPage }}
          className={cn(
            'absolute inset-0 flex items-center gap-2 px-28',
            'text-md transition-colors hover:text-muted-foreground',
          )}
        >
          <ChevronLeft className='size-4' />
          <span className='font-bold'>Back</span>
        </Link>
      </div>

      <article className='px-28 py-16'>
        <div className='flex items-center gap-6'>
          <button
            type='button'
            className={cn(
              'group mt-2 flex h-18 w-18 flex-shrink-0 items-center justify-center',
              'rounded-full bg-theme',
              'shadow-lg shadow-theme/20',
              'transition-all hover:scale-105 hover:bg-theme-hover hover:shadow-theme/30 hover:shadow-xl',
              'focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2',
            )}
            aria-label='Play episode'
          >
            <Play className='h-8 w-8 fill-white text-white' />
          </button>

          <div className='flex flex-col'>
            <h1 className='mt-2 font-bold text-4xl text-foreground'>
              {episode.title}
            </h1>
            <time className='order-first font-mono text-muted-foreground text-sm leading-7'>
              {publishedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </div>

        <div className='episode-content'>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
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
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || ''}
                  className='my-6 max-h-[500px] max-w-full rounded-lg object-contain shadow-md'
                  loading='lazy'
                />
              ),
            }}
          >
            {episode.content ?? episode.description}
          </ReactMarkdown>
        </div>
      </article>
    </section>
  )
}
