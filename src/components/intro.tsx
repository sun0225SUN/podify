import Image from 'next/image'
import Link from 'next/link'
import { podcastInfo } from '~/config'

export function Intro() {
  return (
    <div className='flex w-full flex-col items-center gap-10 lg:items-start'>
      <Image
        className='rounded-xl lg:w-full'
        src={podcastInfo.cover}
        alt={podcastInfo.name}
        width={200}
        height={200}
        priority
      />

      <div className='flex flex-col gap-3 text-center lg:text-left'>
        <Link
          href='/'
          className='font-bold text-xl'
        >
          {podcastInfo.name}
        </Link>

        <p className='font-medium text-lg leading-8'>
          {podcastInfo.description}
        </p>
      </div>
    </div>
  )
}
