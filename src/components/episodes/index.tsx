import { Link } from '@tanstack/react-router'
import { Waveform } from '@/components/common/waveform'
import type { Episode } from '@/types/podcast'

interface EpisodesProps {
  episodes: Episode[]
}

export function Episodes({ episodes }: EpisodesProps) {
  return (
    <div className='flex w-full flex-1 flex-col'>
      <div className='relative border-border border-b'>
        <Waveform className='h-24 w-full' />
        <h1 className='absolute inset-0 top-10 px-28 font-bold text-2xl'>
          Episodes
        </h1>
      </div>

      {episodes.length === 0 ? (
        <p className='text-muted-foreground'>No episodes available.</p>
      ) : (
        <ul className='flex flex-col border-border border-b'>
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className='flex flex-col gap-3 px-28 py-8'
            >
              {episode.published && (
                <time className='text-muted-foreground text-sm'>
                  {new Date(episode.published).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
              <h2 className='font-bold text-2xl'>{episode.title}</h2>
              {episode.description && (
                <p className='text-foreground/80 leading-relaxed'>
                  {episode.description}
                </p>
              )}
              <div className='mt-2 flex items-center gap-4 text-sm'>
                <Link
                  to='/episodes/$episodeId'
                  params={{ episodeId: episode.id }}
                  className='flex items-center gap-2 font-medium text-theme hover:text-theme-hover'
                >
                  <span>▶</span>
                  <span>Listen</span>
                </Link>
                <span className='text-muted-foreground'>/</span>
                <Link
                  to='/episodes/$episodeId'
                  params={{ episodeId: episode.id }}
                  className='font-medium text-theme hover:text-theme-hover'
                >
                  Show notes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
