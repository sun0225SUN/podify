import Link from 'next/link'
import { Fragment } from 'react'
import { ThemeToggle } from '~/components/theme/toggle'
import { podcastInfo } from '~/config'
import { cn } from '~/lib/utils'

export function Aside() {
  return (
    <div
      className={cn(
        'top-0 hidden h-screen py-12 lg:sticky',
        'flex-col items-center justify-between lg:flex',
        'bg-slate-50 dark:bg-black',
      )}
    >
      <div
        className={cn(
          'w-16 text-sm leading-7 ',
          'flex items-center [writing-mode:vertical-rl]',
        )}
      >
        <p className='font-semibold'>Hosted by</p>
        <div className='mt-6 flex gap-4 font-bold'>
          {podcastInfo.hosts.map((host, hostIndex) => (
            <Fragment key={host.name}>
              {hostIndex !== 0 && <span aria-hidden='true'>/</span>}
              <Link
                href={host.link ?? '/'}
                className={cn(
                  'tracking-widest',
                  host.link
                    ? 'hover:text-theme-500 dark:hover:text-theme-400'
                    : ' cursor-default',
                )}
              >
                {host.name}
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
      <ThemeToggle />
    </div>
  )
}
