'use client'

import clsx from 'clsx'
import { Info } from 'lucide-react'
import { useState } from 'react'
import { podcastInfo } from '~/config'

export function About() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className='mt-12 hidden lg:block'>
      <h2 className='flex items-center font-medium font-mono text-sm/7'>
        <Info size={16} />
        <span className='ml-2'>About</span>
      </h2>
      <p
        className={clsx(
          'mt-2 text-base leading-7',
          !isExpanded && 'lg:line-clamp-4',
        )}
      >
        {podcastInfo.introduction}
      </p>

      {!isExpanded && (
        <button
          type='button'
          className='mt-2 hidden font-bold text-sm/6 text-theme-500 hover:text-theme-700 active:text-theme-900 lg:inline-block'
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </button>
      )}
    </section>
  )
}
