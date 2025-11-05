import type { Episode } from '@/types/podcast'

interface EpisodeDetailProps {
  episode: Episode
}

export function EpisodeDetail({ episode }: EpisodeDetailProps) {
  return (
    <div className='flex flex-col gap-8 p-12'>
      <h1 className='font-bold text-3xl'>{episode.title}</h1>
      {episode.description && (
        <p className='text-muted-foreground'>{episode.description}</p>
      )}
      {episode.published && (
        <time className='text-muted-foreground text-sm'>
          {new Date(episode.published).toLocaleDateString()}
        </time>
      )}
    </div>
  )
}
