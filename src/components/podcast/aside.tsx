import { Link } from '@tanstack/react-router'
import { Fragment } from 'react'
import { ThemeToggle } from '@/components/theme/toggle'
import { podcast } from '@/config'

export function PodcastAside() {
  return (
    <aside className='flex h-full flex-col items-center justify-between py-8'>
      <section className='sticky top-0 flex items-center gap-6 whitespace-nowrap py-4 [writing-mode:vertical-rl]'>
        <span className='font-mono text-muted-foreground'>Hosted by</span>
        <span className='flex gap-6 font-bold'>
          {podcast.hosts.map((host, hostIndex) => (
            <Fragment key={host.name}>
              {hostIndex !== 0 && (
                <span
                  aria-hidden='true'
                  className='text-muted-foreground'
                >
                  /
                </span>
              )}
              <Link
                to={host.link}
                target='_blank'
                className='cursor-pointer'
              >
                {host.name}
              </Link>
            </Fragment>
          ))}
        </span>
      </section>
      <ThemeToggle />
    </aside>
  )
}
