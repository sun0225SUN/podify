import {
  PlayButton,
  Tooltip,
  type TooltipPlacement,
  useMediaState,
} from '@vidstack/react'
import { PauseIcon, PlayIcon } from '@vidstack/react/icons'
import { cn } from '@/lib/utils'

interface MediaButtonProps {
  tooltipPlacement: TooltipPlacement
  className?: string
}

export function Play({ tooltipPlacement, className }: MediaButtonProps) {
  const isPaused = useMediaState('paused')

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <PlayButton
          className={cn(
            'group relative inline-flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#262626] text-white outline-none ring-media-focus ring-inset data-[focus]:ring-4 dark:bg-white dark:text-black',
            className,
          )}
          data-umami-event='episode-audio-play'
        >
          {isPaused ? (
            <PlayIcon className='size-6' />
          ) : (
            <PauseIcon className='size-6' />
          )}
        </PlayButton>
      </Tooltip.Trigger>
      <Tooltip.Content
        className='fade-out slide-out-to-bottom-2 data-[visible]:fade-in data-[visible]:slide-in-from-bottom-4 z-10 parent-data-[open]:hidden animate-out rounded-sm bg-black/90 px-2 py-0.5 font-medium text-sm text-white data-[visible]:animate-in'
        placement={tooltipPlacement}
      >
        {isPaused ? 'Play' : 'Pause'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
