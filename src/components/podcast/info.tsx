import { Link } from '@tanstack/react-router'
import { podcast } from '@/config'
import { cn } from '@/lib/utils'

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
        <section className='flex flex-col gap-3'>
          <h2 className='font-medium font-mono text-sm'>About</h2>
          <p>{podcast.about}</p>
        </section>
        <section className='flex flex-col gap-3'>
          <h2 className='font-medium font-mono text-sm'>Listen</h2>
          <div>todo</div>
        </section>
      </div>
    </div>
  )
}
