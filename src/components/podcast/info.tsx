import { Link } from '@tanstack/react-router'
import { Podcast, Youtube } from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'
import { TinyWaveFormIcon } from '@/components/common/waveform-icon'
import { SpotifyIcon, XYZIcon } from '@/components/icons'
import { podcast } from '@/config'
import { cn } from '@/lib/utils'

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
  return (
    <div className={cn('flex flex-col gap-12 p-12', 'border-border border-x')}>
      <Link to='/'>
        <img
          className='rounded-2xl'
          src={podcast.base.cover}
          referrerPolicy='no-referrer'
          loading='lazy'
          alt='cover'
          sizes='20rem'
        />
      </Link>

      <div className='flex flex-col gap-3 text-left'>
        <p className='font-bold text-xl'>
          <Link to='/'>{podcast.base.title}</Link>
        </p>
        <p className='font-medium text-lg'>{podcast.base.description}</p>
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
          <p>{podcast.about}</p>
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
