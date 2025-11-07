import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Podcast, Youtube } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { TinyWaveFormIcon } from '@/components/common/waveform-icon'
import { SpotifyIcon, XYZIcon } from '@/components/icons'
import { podcast, site } from '@/config'
import { cn } from '@/lib/utils'
import { getPodcastStore } from '@/stores/podcast-store'

type PlatformConfig = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  colorClass: string
}

const platformIcons: Record<string, PlatformConfig> = {
  xyz: {
    icon: XYZIcon,
    colorClass: 'text-blue-500 hover:text-blue-600',
  },
  youtube: {
    icon: Youtube,
    colorClass: 'text-red-500 hover:text-red-600',
  },
  spotify: {
    icon: SpotifyIcon,
    colorClass: 'text-green-500 hover:text-green-600',
  },
  apple: {
    icon: Podcast,
    colorClass: 'text-purple-500 hover:text-purple-600',
  },
}

export function PodcastInfo() {
  const podcastStore = getPodcastStore()
  const podcastInfo = useStore(podcastStore, (state) => state.podcastInfo)
  const [isExpanded, setIsExpanded] = useState(false)

  if (!podcastInfo) {
    return null
  }

  const { title, description, cover } = podcastInfo
  const shouldTruncate = description.length > site.defaultDescriptionLength
  const displayDescription = isExpanded
    ? description
    : shouldTruncate
      ? `${description.slice(0, site.defaultDescriptionLength)}...`
      : description

  return (
    <div
      className={cn(
        'flex h-full flex-col gap-12 overflow-y-auto p-12',
        'border-border border-x',
      )}
    >
      <Link
        to='/'
        search={{ page: 1 }}
      >
        <img
          className='rounded-2xl'
          src={cover}
          referrerPolicy='no-referrer'
          loading='lazy'
          alt='cover'
          sizes='20rem'
        />
      </Link>

      <div className='text-left font-bold text-xl'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <>{children}</>,
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
          }}
        >
          {title}
        </ReactMarkdown>
      </div>

      <div className='flex flex-col gap-10'>
        <section className='flex flex-col gap-5'>
          <div className='flex items-center gap-2 font-medium font-mono text-sm'>
            <TinyWaveFormIcon
              colors={['fill-violet-300', 'fill-pink-300']}
              className='h-2.5 w-2.5'
            />
            <span>About</span>
          </div>
          <div className='flex flex-col gap-2'>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className='leading-relaxed'>{children}</p>
                ),
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
              }}
            >
              {displayDescription}
            </ReactMarkdown>
            {shouldTruncate && (
              <button
                type='button'
                onClick={() => setIsExpanded(!isExpanded)}
                className='self-start font-medium text-theme transition-colors hover:text-theme-hover'
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </section>

        {podcast.platforms && podcast.platforms.length > 0 && (
          <section className='flex flex-col gap-5'>
            <div className='flex items-center gap-2 font-medium font-mono text-sm'>
              <TinyWaveFormIcon
                colors={['fill-indigo-300', 'fill-blue-300']}
                className='h-2.5 w-2.5'
              />
              <span>Listen</span>
            </div>

            <div className='flex flex-col gap-6'>
              {podcast.platforms.map((platform) => {
                const config = platformIcons[platform.id]
                if (!config) return null

                const Icon = config.icon
                return (
                  <a
                    key={platform.id}
                    href={platform.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center gap-2'
                  >
                    <Icon className={cn('h-6 w-6', config.colorClass)} />
                    <span>{platform.name}</span>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
