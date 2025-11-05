import { Link } from '@tanstack/react-router'
import type { Episode } from '@/types/podcast'

interface EpisodesProps {
  episodes: Episode[]
}

export function Episodes({ episodes }: EpisodesProps) {
  return (
    <div className='flex flex-col gap-8 p-12'>
      <h1 className='font-bold text-2xl'>Episodes</h1>
      {episodes.length === 0 ? (
        <p className='text-muted-foreground'>No episodes available.</p>
      ) : (
        <ul className='flex flex-col gap-6'>
          {episodes.map((episode) => (
            <li
              key={episode.id}
              className='flex flex-col gap-2 rounded-lg border border-border p-6 transition-colors hover:bg-muted/50'
            >
              <Link
                to='/episodes/$episodeId'
                params={{ episodeId: episode.id }}
                className='flex flex-col gap-2'
              >
                <h2 className='font-semibold text-lg'>{episode.title}</h2>
                {episode.description && (
                  <p className='line-clamp-2 text-muted-foreground'>
                    {episode.description}
                  </p>
                )}
                {episode.published && (
                  <time className='text-muted-foreground text-sm'>
                    {new Date(episode.published).toLocaleDateString()}
                  </time>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
