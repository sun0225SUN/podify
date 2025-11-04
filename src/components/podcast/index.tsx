interface PodcastInfoProps {
  title?: string
  description?: string
  link?: string
  coverArt?: string
}

export function Podcast({
  title,
  description,
  link,
  coverArt,
}: PodcastInfoProps) {
  if (!title) {
    return null
  }

  return (
    <div className='flex flex-col items-center gap-6'>
      {coverArt && (
        <img
          src={coverArt}
          alt={title}
          className='h-48 w-48 rounded-lg object-cover'
        />
      )}
      <div className='text-center'>
        <h1 className='mb-2 font-bold text-4xl'>{title}</h1>
        {description && (
          <p className='max-w-2xl text-gray-600 text-lg dark:text-gray-400'>
            {description}
          </p>
        )}
        {link && (
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400'
          >
            Visit Podcast
          </a>
        )}
      </div>
    </div>
  )
}
