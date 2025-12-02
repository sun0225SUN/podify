import { Controls } from '@vidstack/react'
import { EpisodeTitle } from '@/components/player/episode-title'
import { Play } from '@/components/player/play'
import { SeekBackward, SeekForward } from '@/components/player/seek'
import { Speed } from '@/components/player/speed'
import { CurrentTime, Duration } from '@/components/player/time-info'
import { TimeSliders } from '@/components/player/time-sliders'
import { Volume } from '@/components/player/volume'
import { cn } from '@/lib/utils'

import styles from '@/styles/player.module.css'

export function PlayerLayoutDesktop() {
  return (
    <Controls.Root
      className={cn(
        'hidden w-full flex-col gap-5 px-10 py-4 md:flex',
        styles.controls,
      )}
    >
      <Controls.Group className='flex h-full w-full items-center gap-3'>
        <CurrentTime />
        <TimeSliders />
        <Duration />
      </Controls.Group>

      <Controls.Group className='relative flex min-h-14 w-full items-center justify-between'>
        <div className='hidden xl:block'>
          <EpisodeTitle />
        </div>
        <div className='-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex items-center gap-10'>
          <SeekBackward className='size-10' />
          <Play
            tooltipPlacement='top start'
            className='size-14'
          />
          <SeekForward className='size-10' />
        </div>
        <div className='hidden xl:block'>
          <div className='flex items-center gap-4'>
            <Speed />
            <div className='flex items-center'>
              <Volume />
            </div>
          </div>
        </div>
      </Controls.Group>
    </Controls.Root>
  )
}
