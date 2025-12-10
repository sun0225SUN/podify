import { useMediaPlayer, usePlaybackRateOptions } from '@vidstack/react'
import { useEffect, useState } from 'react'

export function Speed() {
  const options = usePlaybackRateOptions()
  const [speed, setSpeed] = useState(3)
  const player = useMediaPlayer()

  useEffect(() => {
    if (player && options[speed]) {
      player.playbackRate = Number.parseFloat(options[speed].value)
    }
  }, [speed, player, options])

  return (
    <div
      className='cursor-pointer rounded-md border px-2 py-1 text-xs transition-colors hover:bg-gray-100 dark:hover:bg-white/10'
      onClick={() => setSpeed((current) => (current + 1) % options.length)}
    >
      {speed === 3 ? '1.0x' : options[speed]?.label}
    </div>
  )
}
