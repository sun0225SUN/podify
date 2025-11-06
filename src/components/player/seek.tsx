import { SeekButton } from '@vidstack/react'
import { SeekBackward15Icon, SeekForward15Icon } from '@vidstack/react/icons'

export function SeekForward() {
  return (
    <SeekButton
      className='relative inline-flex size-8 cursor-pointer items-center justify-center rounded-md outline-none ring-sky-400 ring-inset hover:bg-white/20 aria-hidden:hidden data-[focus]:ring-4'
      seconds={15}
      data-umami-event='seek-forward'
    >
      <SeekForward15Icon className='size-6' />
    </SeekButton>
  )
}

export function SeekBackward() {
  return (
    <SeekButton
      className='relative inline-flex size-8 cursor-pointer items-center justify-center rounded-md outline-none ring-sky-400 ring-inset hover:bg-white/20 aria-hidden:hidden data-[focus]:ring-4'
      seconds={-15}
      data-umami-event='seek-backward'
    >
      <SeekBackward15Icon className='size-6' />
    </SeekButton>
  )
}
