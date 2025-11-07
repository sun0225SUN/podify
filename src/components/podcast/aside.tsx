import { Link } from '@tanstack/react-router'
import { Github } from 'lucide-react'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/components/theme/toggle'
import { podcast } from '@/config'

export function PodcastAside() {
  const { t } = useTranslation()

  return (
    <aside className='flex h-full flex-col items-center justify-between py-8'>
      <section className='sticky top-0 flex items-center gap-6 whitespace-nowrap py-4 [writing-mode:vertical-rl]'>
        <span className='font-mono text-muted-foreground'>
          {t('aside.hostedBy')}
        </span>
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
      <section className='flex flex-col items-center gap-5'>
        <a
          href='https://github.com/sun0225SUN/podify'
          target='_blank'
          className='cursor-pointer'
          rel='noopener'
        >
          <Github className='size-6' />
        </a>
        <ThemeToggle />
      </section>
    </aside>
  )
}
