import { useStore } from '@tanstack/react-store'
import { Controls } from '@vidstack/react'
import { Play } from '@/components/player/play'
import { SeekBackward, SeekForward } from '@/components/player/seek'
import { Speed } from '@/components/player/speed'
import { CurrentTime, Duration } from '@/components/player/time-info'
import { TimeSliders } from '@/components/player/time-sliders'
import { Volume } from '@/components/player/volume'
import { cn } from '@/lib/utils'
import { getPlayerStore } from '@/stores/player-store'

import styles from '@/styles/player.module.css'

export function PlayerLayoutMobile() {
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)

  return (
    <Controls.Root
      className={cn(
        'flex w-full flex-col gap-4 px-4 py-3 md:hidden',
        styles.controls,
      )}
    >
      <Controls.Group className='flex h-full w-full items-center gap-2'>
        <CurrentTime className='text-xs' />
        <TimeSliders />
        <Duration className='text-xs' />
      </Controls.Group>

      {currentEpisode && (
        <div className='flex items-center justify-center'>
          <div className='line-clamp-1 overflow-hidden text-center font-medium text-sm'>
            {currentEpisode.title}
          </div>
        </div>
      )}

      <Controls.Group className='relative flex w-full items-center justify-between'>
        <div className='flex min-w-12 justify-start'>
          <Speed />
        </div>
        <div className='-translate-x-1/2 absolute left-1/2 flex items-center gap-6'>
          <SeekBackward className='size-8 text-neutral-500 active:scale-95 dark:text-neutral-400' />
          <Play
            tooltipPlacement='top'
            className='size-12'
          />
          <SeekForward className='size-8 text-neutral-500 active:scale-95 dark:text-neutral-400' />
        </div>
        <div className='flex min-w-12 justify-end'>
          <Volume />
        </div>
      </Controls.Group>
    </Controls.Root>
  )
}
