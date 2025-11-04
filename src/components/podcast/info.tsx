import type { PodcastInfoProps } from '@/types/podcast'

export function PodcastInfo({
  podcastInfo,
}: {
  podcastInfo: PodcastInfoProps
}) {
  return (
    <div>
      <div className='text-center'>
        <h1 className='mb-2 font-bold text-4xl'>{podcastInfo.title}</h1>

        {podcastInfo.description && (
          <p className='max-w-2xl text-gray-600 text-lg dark:text-gray-400'>
            {podcastInfo.description}
          </p>
        )}

        {podcastInfo.link && (
          <a
            href={podcastInfo.link}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400'
          >
            Visit Podcast
          </a>
        )}

        {podcastInfo.cover && (
          <img
            src={podcastInfo.cover}
            alt={podcastInfo.title}
            className='h-48 w-48 rounded-lg object-cover'
          />
        )}
      </div>
    </div>
  )
}
