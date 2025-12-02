import { MuteButton, useMediaState, VolumeSlider } from '@vidstack/react'
import { Volume1, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Volume() {
  const volume = useMediaState('volume')
  const isMuted = useMediaState('muted')

  return (
    <div className='group relative flex items-center justify-center'>
      <div
        className={cn(
          '-translate-x-1/2 absolute bottom-full left-1/2 z-50 pb-2',
          'hidden flex-col items-center justify-end group-hover:flex',
          'fade-in slide-in-from-bottom-2 animate-in duration-200',
        )}
      >
        <div
          className={cn(
            'relative flex flex-col items-center rounded-3xl p-3',
            'bg-white dark:bg-neutral-900',
            'border border-black/5 shadow-xl dark:border-white/10',
          )}
        >
          <VolumeSlider.Root
            className='relative h-24 w-1.5 cursor-pointer touch-none select-none items-center outline-none'
            orientation='vertical'
          >
            <VolumeSlider.Track className='relative h-full w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/20'>
              <VolumeSlider.TrackFill className='absolute bottom-0 w-full rounded-full bg-neutral-900 transition-[height] duration-200 will-change-[height] dark:bg-white' />
            </VolumeSlider.Track>

            <VolumeSlider.Preview
              className='-translate-x-1/2 -top-10 absolute left-1/2 flex flex-col items-center opacity-0 transition-opacity duration-200 data-visible:opacity-100'
              noClamp
            >
              <VolumeSlider.Value className='rounded-md border border-black/5 bg-white px-2 py-0.5 font-medium text-neutral-900 text-xs shadow-sm dark:border-white/10 dark:bg-black dark:text-white' />
            </VolumeSlider.Preview>

            <VolumeSlider.Thumb className='-translate-x-1/2 -translate-y-1/2 absolute top-[calc(100%-var(--slider-fill))] left-1/2 z-20 h-3 w-3 rounded-full border border-black/5 bg-white opacity-0 shadow-sm ring-white/40 transition-opacity group-hover:opacity-100 dark:border-white/10 dark:bg-white' />
          </VolumeSlider.Root>
        </div>
      </div>

      <MuteButton className='group/mute relative inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-md outline-none ring-media-focus ring-inset hover:bg-black/5 data-focus:ring-4 dark:hover:bg-white/10'>
        {isMuted || volume === 0 ? (
          <VolumeX className='size-5 text-neutral-500 dark:text-neutral-400' />
        ) : volume < 0.5 ? (
          <Volume1 className='size-5' />
        ) : (
          <Volume2 className='size-5' />
        )}
      </MuteButton>
    </div>
  )
}
