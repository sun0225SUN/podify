import { useStore } from '@tanstack/react-store'
import { Controls } from '@vidstack/react'
import { Play } from '@/components/player/play'
import { SeekBackward, SeekForward } from '@/components/player/seek'
import { CurrentTime, Duration } from '@/components/player/time-info'
import { TimeSliders } from '@/components/player/time-sliders'
import { cn } from '@/lib/utils'
import { getPlayerStore } from '@/stores/player-store'

import styles from '@/styles/player.module.css'

export function PlayerLayoutMobile() {
  const playerStore = getPlayerStore()
  const currentEpisode = useStore(playerStore, (state) => state.currentEpisode)

  return (
    <Controls.Root
      className={cn('flex w-full flex-col gap-3 px-4 py-3', styles.controls)}
    >
      {currentEpisode && (
        <div className='line-clamp-1 overflow-hidden text-center font-medium text-sm'>
          {currentEpisode.title}
        </div>
      )}

      <Controls.Group className='relative flex w-full items-center justify-center'>
        <div className='flex items-center gap-3'>
          <SeekBackward />
          <Play
            tooltipPlacement='top'
            className='size-10'
          />
          <SeekForward />
        </div>
      </Controls.Group>

      <Controls.Group className='flex h-full w-full items-center gap-2'>
        <CurrentTime className='text-xs' />
        <TimeSliders />
        <Duration className='text-xs' />
      </Controls.Group>
    </Controls.Root>
  )
}
