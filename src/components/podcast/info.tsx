import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Waveform } from '@/components/common/waveform'
import { TinyWaveFormIcon } from '@/components/common/waveform-icon'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { podcast, site } from '@/config/index'
import { cn } from '@/lib/utils'
import { getPodcastStore } from '@/stores/podcast-store'
import type { PodcastRSSInfo } from '@/types/podcast'

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
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const { title, description, cover, link } = podcastInfo

  const shouldTruncate = description.length > site.defaultDescriptionLength

  let displayDescription = description

  if (shouldTruncate && !isExpanded) {
    displayDescription = `${description.slice(0, site.defaultDescriptionLength)}...`
  }

  return (
    <div className={cn('hidden md:flex', 'h-full flex-col gap-12 p-12')}>
      <CardContainer
        containerClassName='block w-full p-0'
        className='h-full w-full'
      >
        <CardBody className='h-full w-full p-0'>
          <CardItem
            translateZ='50'
            className='w-full'
          >
            <Link
              to={link}
              className='block aspect-square w-full'
            >
              <img
                className='h-full w-full rounded-2xl object-cover shadow-xl'
                src={cover}
                referrerPolicy='no-referrer'
                loading='lazy'
                alt='cover'
                width={320}
                height={320}
              />
            </Link>
          </CardItem>
        </CardBody>
      </CardContainer>

      <div className='text-left font-bold text-xl'>{title}</div>

      <div className='flex flex-col gap-10 pb-10'>
        <section className='flex flex-col gap-5'>
          <div className='flex items-center gap-2 font-medium font-mono text-sm'>
            <TinyWaveFormIcon
              colors={['fill-violet-300', 'fill-pink-300']}
              className='h-2.5 w-2.5'
            />
            <span>{t('podcastInfo.about')}</span>
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
                {isExpanded
                  ? t('podcastInfo.showLess')
                  : t('podcastInfo.showMore')}
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
              <span>{t('podcastInfo.listen')}</span>
            </div>

            <div className='flex flex-col gap-6'>
              {podcast.platforms.map((platform) => {
                const Icon = platform.icon
                return (
                  <a
                    key={platform.name}
                    href={platform.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex cursor-pointer items-center gap-2'
                  >
                    <Icon className={cn('h-6 w-6', platform.colorClass)} />
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
            const Icon = platform.icon
            return (
              <a
                key={platform.name}
                href={platform.link}
                target='_blank'
                rel='noopener noreferrer'
                className='transition-opacity hover:opacity-70'
                aria-label={platform.name}
              >
                <Icon className={cn('h-8 w-8', platform.colorClass)} />
              </a>
            )
          })}
        </div>
      )}

      <div className='relative w-full py-2'>
        <div className='absolute inset-0 flex items-center'>
          <div className='h-px w-full bg-linear-to-r from-transparent via-border to-transparent' />
        </div>
      </div>
    </div>
  )
}
