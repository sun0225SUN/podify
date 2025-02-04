import { Headphones } from 'lucide-react'
import Link from 'next/link'
import { podcastInfo } from '~/config'

export function Listen() {
  return (
    <section className='mt-10 lg:mt-12'>
      <h2 className='sr-only flex items-center font-medium font-mono text-sm leading-7 lg:not-sr-only'>
        <Headphones size={16} />
        <span className='ml-2.5'>Listen</span>
      </h2>

      <div className='h-px bg-gradient-to-r from-slate-200/0 via-slate-200 to-slate-200/0 lg:hidden' />

      <div className='mt-4 flex justify-center gap-10 font-medium text-base leading-7 sm:gap-8 lg:flex-col lg:gap-4'>
        {podcastInfo.listenChannel.map(({ label, icon, link }) => (
          <Link
            key={label}
            href={link}
            className='group flex items-center'
            aria-label={String(label)}
          >
            {icon}
            <span className='hidden flex-shrink-0 sm:ml-3 sm:block'>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
