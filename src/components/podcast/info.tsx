import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Podcast, Youtube } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Waveform } from '@/components/common/waveform'
import { TinyWaveFormIcon } from '@/components/common/waveform-icon'
import { SpotifyIcon, XYZIcon } from '@/components/icons'
import { podcast, site } from '@/config'
import { cn } from '@/lib/utils'
import { getPodcastStore } from '@/stores/podcast-store'
import type { PodcastRSSInfo } from '@/types/podcast'

type PlatformConfig = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  colorClass: string
}

interface PodcastInfoContentProps {
  podcastInfo: PodcastRSSInfo
}

export function PodcastInfo() {
  const podcastStore = getPodcastStore()
  const podcastInfo = useStore(podcastStore, (state) => state.podcastInfo)

  if (!podcastInfo) {
    return null
  }

  return (
    <>
      <PodcastInfoDesktop podcastInfo={podcastInfo} />
      <PodcastInfoMobile podcastInfo={podcastInfo} />
    </>
  )
}

function PodcastInfoDesktop({ podcastInfo }: PodcastInfoContentProps) {
  const [isExpanded, setIsExpanded] = useState(false)
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
        'hidden md:flex',
        'h-full flex-col gap-12 p-12',
        'border-border border-x',
      )}
    >
      <Link
        to='/'
        search={{ page: 1 }}
        className='block aspect-square w-full'
      >
        <img
          className='h-full w-full rounded-2xl object-cover'
          src={cover}
          referrerPolicy='no-referrer'
          loading='lazy'
          alt='cover'
          width={320}
          height={320}
        />
      </Link>

      <div className='text-left font-bold text-xl'>{title}</div>

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
                className='cursor-pointer self-start font-medium text-theme transition-colors hover:text-theme-hover'
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
                    className='flex cursor-pointer items-center gap-2'
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

function PodcastInfoMobile({ podcastInfo }: PodcastInfoContentProps) {
  const { title, description, cover } = podcastInfo

  return (
    <div className='relative flex flex-col items-center gap-8 md:hidden'>
      <Waveform className='absolute top-0 left-0 w-full' />
      <Link
        to='/'
        search={{ page: 1 }}
        className='flex justify-center pt-20'
      >
        <img
          className='size-40 rounded-2xl object-cover'
          src={cover}
          referrerPolicy='no-referrer'
          loading='lazy'
          alt='cover'
          width={160}
          height={160}
        />
      </Link>

      <div className='text-left font-bold text-2xl'>{title}</div>

      <div className='line-clamp-2 px-10'>{description}</div>

      {podcast.platforms && podcast.platforms.length > 0 && (
        <div className='flex items-center gap-6'>
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
                className='transition-opacity hover:opacity-70'
                aria-label={platform.name}
              >
                <Icon className={cn('h-8 w-8', config.colorClass)} />
              </a>
            )
          })}
        </div>
      )}

      <div className='relative w-full py-2'>
        <div className='absolute inset-0 flex items-center'>
          <div className='h-px w-full bg-gradient-to-r from-transparent via-border to-transparent' />
        </div>
      </div>
    </div>
  )
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
